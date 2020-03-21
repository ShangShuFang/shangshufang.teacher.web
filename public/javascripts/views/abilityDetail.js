$(document).ready(function () {
  let model = {
    bizLog: {
      pageName: 'abilityAnalysis',
      operationName: {
        PAGE_LOAD: 'PL',
      },
      logMemo: '',
    },
    universityCode: 0,
    schoolID: 0,
    studentID: 0,
    isParameterValid: false,
    isLogin: false,
    loginUser: null
  };

  function initPage() {
    bizLogger.logInfo(
        model.bizLog.pageName,
        model.bizLog.operationName.PAGE_LOAD,
        bizLogger.OPERATION_TYPE.LOAD,
        bizLogger.OPERATION_RESULT.SUCCESS);
    setMenuActive();
    setParameters();
    if(!model.isParameterValid){
      bootbox.alert(localMessage.PARAMETER_ERROR);
      return false;
    }
    loadStudentInfo();
    loadTechnologyAnalysisData();
  }

  function setMenuActive() {
    $('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
    $('ul.kt-menu__nav li:nth-child(3)').addClass('kt-menu__item--here');
  }

  function setParameters() {
    model.universityCode = $('#hidden_university_code').val();
    model.schoolID = $('#hidden_school_id').val();
    model.studentID = $('#hidden_student_id').val();
    if(!commonUtility.isNumber(model.universityCode) || 
        !commonUtility.isNumber(model.schoolID) || 
        !commonUtility.isNumber(model.studentID)){
      model.isParameterValid = false;
      return false;
    }
    model.isParameterValid = true;
  }

  function loadStudentInfo() {
    $.ajax({
      type: "GET",
      url: "/ability/detail/studentInfo",
      data: {
        studentUniversityCode: model.universityCode,
        studentSchoolID: model.schoolID,
        studentID: model.studentID
      },
      dataType: "JSON",
      success: function(result) {
        if(result.err){
          bootbox.alert(localMessage.formatMessage(result.code, result.msg));
          return false;
        }
        $('.student-name').text(result.studentInfo.fullName);
        if(commonUtility.isEmpty(result.studentInfo.sex) || result.studentInfo.sex === 'M'){
          $('.student-sex').addClass('fa-male kt-font-primary');
        }else{
          $('.student-sex').addClass('fa-female kt-font-danger');
        }
        $('.student-university').text(result.studentInfo.universityName);
        $('.student-school').text(result.studentInfo.schoolName);
        $('.student-enrollment-year').text(result.studentInfo.enrollmentYear + '级');
        $('.student-cellphone').text(result.studentInfo.cellphone);
        $('.student-email').text(result.studentInfo.email);
        if(!commonUtility.isEmpty(result.studentInfo.photo)){
          $('.student-photo').attr('src', result.studentInfo.photo);
        }
      },
      error : function(e){
        bootbox.alert(localMessage.NETWORK_ERROR);
      }
    });
  };

  function loadTechnologyAnalysisData() {
    $.ajax({
      type: "GET",
      url: "/ability/detail/learningTechnology",
      data: {
        studentUniversityCode: model.universityCode,
        studentSchoolID: model.schoolID,
        studentID: model.studentID,
      },
      dataType: "JSON",
      success: function(result) {
        if(result.err){
          bootbox.alert(localMessage.formatMessage(result.code, result.msg));
          return false;
        }
        if(commonUtility.isEmptyList(result.dataList)){
          return false;
        }

        result.dataList.forEach(function (data) {
          $('div.technology-analysis-detail').append(
              `<div class="kt-portlet kt-portlet--collapse" data-technology-id="${data.technologyID}" data-ktportlet="true">
                <div class="kt-portlet__head">
                  <div class="kt-portlet__head-label">
                    <h3 class="kt-portlet__head-title">
                      ${data.technologyName}
                    </h3>
                  </div>
                  <div class="kt-portlet__head-toolbar">
                    <div class="kt-portlet__head-group">
                      <a href="javascript:;" data-ktportlet-tool="toggle" data-technology-id="${data.technologyID}" class="btn btn-sm btn-icon btn-default btn-pill btn-icon-md btn-show-detail">
                        <i class="la la-angle-down"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="kt-portlet__body" kt-hidden-height="240" style="display: none; overflow: hidden; padding-top: 0px; padding-bottom: 0px;">
                  <div class="kt-widget12">
                    <div class="kt-widget12__content">
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc">专业能力</span>
                          <span class="kt-widget12__value">
                            上造
                            <small>超过校内58%的同学</small>
                            <small>超过校外20%的同学</small>
                          </span>
                        </div>
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc">学习完成度</span>
                          <div class="kt-widget12__progress">
                            <div class="progress kt-progress--sm">
                              <div class="progress-bar kt-bg-success learning-percent"
                                   role="progressbar"
                                   aria-valuenow="100"
                                   aria-valuemin="0"
                                   aria-valuemax="100"></div>
                            </div>
                            <span class="kt-widget12__stat learning-percent-text"></span>
                          </div>
                        </div>
                      </div>
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">知识点掌握情况分析</span>
                          <div id="knowledgeAnalysis${data.technologyID}" style="height: 280px;"></div>
                        </div>
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">代码规范出错率分析</span>
                          <div id="codeStandardAnalysis${data.technologyID}" class="code-standard-analysis" style="height: 280px;">
                            <ul>
                              <li class="kt-badge kt-badge--inline kt-badge--success">
                                <i class="fa fa-check"></i> &nbsp;
                                代码规范性一
                              </li>
                              <li class="kt-badge kt-badge--inline kt-badge--danger">
                                <i class="fa fa-exclamation"></i> &nbsp;
                                代码规范性二
                              </li>
                              <li class="kt-badge kt-badge--inline kt-badge--success">
                                <i class="fa fa-check"></i> &nbsp;
                                代码规范性三
                              </li>
                              <li class="kt-badge kt-badge--inline kt-badge--success">
                                <i class="fa fa-check"></i> &nbsp;
                                代码规范性四
                              </li>
                              <li class="kt-badge kt-badge--inline kt-badge--success">
                                <i class="fa fa-check"></i> &nbsp;
                                代码规范性五
                              </li>
                              <li class="kt-badge kt-badge--inline kt-badge--success">
                                <i class="fa fa-check"></i> &nbsp;
                                代码规范性六
                              </li>
                              <li class="kt-badge kt-badge--inline kt-badge--danger">
                                <i class="fa fa-exclamation"></i> &nbsp;
                                代码规范性七
                              </li>
                              <li class="kt-badge kt-badge--inline kt-badge--danger">
                                <i class="fa fa-exclamation"></i> &nbsp;
                                代码规范性八
                              </li>
                              <li class="kt-badge kt-badge--inline kt-badge--success">
                                <i class="fa fa-check"></i> &nbsp;
                                代码规范性九
                              </li>
                              <li class="kt-badge kt-badge--inline kt-badge--success">
                                <i class="fa fa-check"></i> &nbsp;
                                代码规范性十
                              </li>
                              <li class="kt-badge kt-badge--inline kt-badge--success">
                                <i class="fa fa-check"></i> &nbsp;
                                代码规范性十
                              </li>
                              <li class="kt-badge kt-badge--inline kt-badge--success">
                                <i class="fa fa-check"></i> &nbsp;
                                代码规范性十
                              </li><li class="kt-badge kt-badge--inline kt-badge--success">
                              <i class="fa fa-check"></i> &nbsp;
                              代码规范性十
                            </li>
                              <li class="kt-badge kt-badge--inline kt-badge--success">
                                <i class="fa fa-check"></i> &nbsp;
                                代码规范性十
                              </li>
                              <li class="kt-badge kt-badge--inline kt-badge--success">
                                <i class="fa fa-check"></i> &nbsp;
                                代码规范性十
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">练习情况数量趋势分析</span>
                          <div id="exerciseAnalysis${data.technologyID}" style="height:300px;"></div>
                        </div>
                      </div>
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">练习情况百分比趋势分析（%）</span>
                          <div id="exerciseAnalysisPercent${data.technologyID}" style="height:300px;"></div>
                        </div>
                      </div>
  
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">已完成的综合练习</span>
                          <div id="onlineAnswerAnalysis${data.technologyID}" style="max-height:300px;"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`);

          $("div.technology-analysis-detail").on("click",".btn-show-detail",function(){
            let rootElement = $(this).parent().parent().parent().parent();
            if($(rootElement).hasClass('kt-portlet--collapse')){
              $(rootElement).removeClass('kt-portlet--collapse');
              $(rootElement).find('.kt-portlet__body').attr('style', '');

              let technologyID = $(this).attr('data-technology-id');
              if($(rootElement).find(`#knowledgeAnalysis${technologyID}`).children().length === 0){
                loadKnowledgeAnalysis(technologyID);
                loadExerciseAnalysis(technologyID);
                loadExercisePercentAnalysis(technologyID);
              }
            }else{
              $(rootElement).addClass('kt-portlet--collapse');
              $(rootElement).find('.kt-portlet__body').attr('style', 'display: none; overflow: hidden; padding-top: 0px; padding-bottom: 0px;');
            }
          });

        })
      },
      error : function(e){
        bootbox.alert(localMessage.NETWORK_ERROR);
      }
    });
  }

  function loadKnowledgeAnalysis(technologyID) {
    $.ajax({
      type: "GET",
      url: "/ability/detail/knowledgeAnalysis",
      data: {
        studentUniversityCode: model.universityCode,
        studentSchoolID: model.schoolID,
        studentID: model.studentID,
        technologyID: technologyID,
      },
      dataType: "JSON",
      success: function(result) {
        if(result.err){
          bootbox.alert(localMessage.formatMessage(result.code, result.msg));
          return false;
        }

        $('.learning-percent').css('width', `${result.data.learningPercentCount}%`);
        $('.learning-percent-text').text(`${result.data.learningPercentCount}%`);
        let data = [
          {label: "未掌握", data: result.data.noLearningKnowledgeCount, color:  KTApp.getStateColor("brand")},
          {label: "已掌握", data: result.data.graspKnowledgeCount, color:  KTApp.getStateColor("success")},
          {label: "较薄弱", data: result.data.weaknessKnowledgeCount, color:  KTApp.getStateColor("danger")}
        ];

        $.plot($(`#knowledgeAnalysis${technologyID}`), data, {
          series: {
            pie: {
              show: true,
              radius: 1,
              label: {
                show: true,
                radius: 1,
                formatter: function(label, series) {
                  return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
                },
                background: {
                  opacity: 0.8
                }
              }
            }
          },
          legend: {
            show: false
          }
        });
      },
      error : function(e){
        bootbox.alert(localMessage.NETWORK_ERROR);
      }
    });
  }

  function loadExerciseAnalysis(technologyID) {
    $.ajax({
      type: "GET",
      url: "/ability/detail/exerciseAnalysis",
      data: {
        studentUniversityCode: model.universityCode,
        studentSchoolID: model.schoolID,
        studentID: model.studentID,
        technologyID: technologyID,
      },
      dataType: "JSON",
      success: function(result) {
        if(result.err){
          bootbox.alert(localMessage.formatMessage(result.code, result.msg));
          return false;
        }

        new Morris.Line({
          // ID of the element in which to draw the chart.
          element: `exerciseAnalysis${technologyID}`,
          // Chart data records -- each entry in this array corresponds to a point on
          // the chart.
          data: result.dataList,
          // The name of the data record attribute that contains x-values.
          xkey: 'months',
          // A list of names of data record attributes that contain y-values.
          ykeys: ['assignTotalCount', 'finishTotalCount', 'onceCompilationSuccessTotalCount', 'onceRunCorrectTotalCount'],
          // Labels for the ykeys -- will be displayed when you hover over the
          // chart.
          labels: ['布置练习数量', '完成练习数量', '一次性编译成功数量', '一次性运行正确数量'],
          lineColors: ['#3d94fb', '#f6aa33', '#2bc9c5', '#1dc94c']
        });

      },
      error : function(e){
        bootbox.alert(localMessage.NETWORK_ERROR);
      }
    });
  }

  function loadExercisePercentAnalysis (technologyID) {
    $.ajax({
      type: "GET",
      url: "/ability/detail/exercisePercentAnalysis",
      data: {
        studentUniversityCode: model.universityCode,
        studentSchoolID: model.schoolID,
        studentID: model.studentID,
        technologyID: technologyID,
      },
      dataType: "JSON",
      success: function(result) {
        if(result.err){
          bootbox.alert(localMessage.formatMessage(result.code, result.msg));
          return false;
        }

        new Morris.Line({
          // ID of the element in which to draw the chart.
          element: `exerciseAnalysisPercent${technologyID}`,
          // Chart data records -- each entry in this array corresponds to a point on
          // the chart.
          data: result.dataList,
          // The name of the data record attribute that contains x-values.
          xkey: 'months',
          // A list of names of data record attributes that contain y-values.
          ykeys: ['finishPercent', 'onceCompilationSuccessPercent', 'onceRunCorrectPercent'],
          // Labels for the ykeys -- will be displayed when you hover over the
          // chart.
          labels: ['练习完成率(%)', '一次性编译成功率(%)', '一次性运行正确率(%)'],
          lineColors: ['#f6aa33', '#2bc9c5', '#1dc94c']
        });

      },
      error : function(e){
        bootbox.alert(localMessage.NETWORK_ERROR);
      }
    });
  }

  initPage();
});
