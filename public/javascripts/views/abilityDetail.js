$(document).ready(function() {
    le  t model = {
        bizLog: {
           pageNme: 'abilityAnalysis',
          operationName: {
                PAGED: 'PL',
           },
          logMemo: '',
        },
        universityCode: 0,
        schoolID: 0,
        studentID: 0,
        isParameterValid: false,
        isLogin: false,
        loginUser: null,
        technologyID: 0,
        languageID: 0
    };  

     le t finishKnowledgeModel = {
        pageNumber: 1,
        totalCount: 0,
        dataList: []
      };
      let weaknessKnowledgeModel = {
        pageNumber: 1,
        totalCount: 0,
        dataList: []
    };  
     le t noLearningKnowledgeModel = {
        pageNumber: 1,
        totalCount: 0,
        dataList: []
      };
    le  t codeStandardModel = {
        pageNumber: 1,
        totalCount: 0,
        maxPageNumber: 0,
        dataList: []
     }; 
     le t weakKnowledgeModel = {
        pageNumber: 1,
        totalCount: 0,
        maxPageNumber: 0,
        dataList: []
      };
      let knowledgeExercisesModel = {
        dataStatus: 'NULL',
        fromIndex: 0,
        toIndex: 0,
        pageNumber: 1,
        totalCount: 0,
        maxPageNumber: 0,
        dataList: [],
        paginationArray: [],
        prePageNum: -1,
        nextPageNum: -1
    };  

     fu nction initPage() {
        bizLogger.logInfo(
            model.bizLog.pageName,
            model.bizLog.operationName.PAGE_LOAD,
            bizLogger.OPERATION_TYPE.LOAD,
            bizLogger.OPERATION_RESULT.SUCCESS);
        setMenuActive();
        setParameters();
       if (!model.isParameterValid) {
            bootx.alert(localMessage.PARAMETER_ERROR);
           retur false;
        }
        loadStudentAbilityResultSummary();
        loadTechnologyAbilityResultSummary();
      }

    fu  nction setMenuActive() {
        $('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
        $('ul.kt-menu__nav li:nth-child(5)').addClass('kt-menu__item--here');
     } 

     fu nction setParameters() {
        model.universityCode = $('#hidden_university_code').val();
        model.schoolID = $('#hidden_school_id').val();
        model.studentID = $('#hidden_student_id').val();
        if (commonUtility.isNumber(model.universityCode) ||
            !commonUtility.isNumber(model.schoolID) ||  monUtility.isNumber(model.studentID)) {
          model.isParameterValid = false;
          return false;
        }
        model.isParameterValid = true;
     } 

      function loadStudentAbilityResultSummary(){
        $.ajax({
           type:"GET",
          url: "/ability/detail/studentInfo",
          data: {
                studniversityCode: model.universityCode,
              studenchoolID: model.schoolID,
             studentD: model.studentID
          },
            datape: "JSON",
           succes: function(result) {
            if (resut.err) {
               bootbox.aert(localMessage.formatMessage(result.code, result.msg));
                return fse;
             }
            if (result.studentInfo === null) {
                    retuse;
            }
               $('.sent-name').text(result.studentInfo.fullName);
              if (conUtility.isEmpty(result.studentInfo.sex) || result.studentInfo.sex === 'M'){
                   $('.st-sex').addClass('fa-male kt-font-primary');
          } else {
                    $('.t-sex').addClass('fa-female kt-font-danger');
            }
                $('.ent-university').text(result.studentInfo.universityName);
              $('.stent-school').text(result.studentInfo.schoolName);
             $('.stuent-enrollment-year').text(result.studentInfo.enrollmentYear.substr(0, 4) + '年');
              $('.stent-cellphone').text(result.studentInfo.cellphone);
               $('.sent-email').text(result.studentInfo.email);
              if (!conUtility.isEmpty(result.studentInfo.photo)) {
                 $('.stut-photo').attr('src', result.studentInfo.photo);
              }
             $('.onlne-question-count').text(result.studentInfo.onlineQuestionCount);
            $('.online-answer-count').text(result.studentInfo.onlineAnswerCount);
                $('.ect-count').text(result.studentInfo.joinProjectCount);
          },
            erro: function(e) {
            bootbox.alert(localMessage.NETWORK_ERROR);
            }
        });
     } 

     fu nction loadTechnologyAbilityResultSummary() {
        $.ajax({
          type: "GET",
          url: "/ability/detail/learningTechnology",
            data{
            studentUniversityCode: model.universityCode,
                studchoolID: model.schoolID,
               studeD: model.studentID,
          },
            datape: "JSON",
           succes: function(result) {
               if (rt.err) {
                  bootboert(localMessage.formatMessage(result.code, result.msg));
                   returse;
               }
              if (conUtility.isEmptyList(result.list)) {
                 $('.leang-technology-count').text(0);
                  returnse;
               }

              $('.lening-technology-count').text(result.list.length);
            result.list.forEach(function(data) {
               $('div.tehnology-analysis-detail').append(
                    `<div cls="kt-portlet kt-portlet--collapse" data-technology-id="${data.technologyID}" data-language-id="${data.languageID}" data-ktportlet="true">
                <div class="kt-portlet__head">
                  <div class="kt-portlet__head-label">
                    <h3 class="kt-portlet__head-title">
                      ${data.technologyName}
                    </h3>
                  </div>
                  <div class="kt-portlet__head-toolbar">
                    <div class="kt-portlet__head-group">
                      <a href="javascript:;" data-ktportlet-tool="toggle" data-technology-id="${data.technologyID}" data-language-id="${data.languageID}" class="btn btn-sm btn-icon btn-default btn-pill btn-icon-md btn-show-detail">
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
                            <span class="ability-level technology${data.technologyID}-level">${data.abilityLevel}</span>
                            <span>超过站内<span class="position-site technology${data.technologyID}-position">${data.positionSite}%</span>的同学</span>
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
                                   aria-valuemax="100" 
                                   style="width: ${data.finishKnowledgePercent}%"></div>
                            </div>
                            <span class="kt-widget12__stat learning-percent-text">${data.finishKnowledgePercent}%</span>
                          </div>
                        </div>
                      </div>
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">
                            知识点掌握情况分析 <a href="javascript:" class="kt-link--info btn-detail-knowledge" data-technology-id="${data.technologyID}">(查看数据)</a>
                          </span>
                          <div id="knowledgeAnalysis${data.technologyID}" style="height: 280px;"></div>
                        </div>
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">代码规范出错率分析 <a href="javascript:" class="kt-link--info btn-detail-code-standard" data-technology-id="${data.technologyID}">(查看数据)</a></span>
                          <div id="codeStandardAnalysis${data.technologyID}" style="height: 280px;"></div>
                        </div>
                      </div>
                      
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">薄弱的知识点</span>
                          <div id="weakKnowledge${data.technologyID}">                            
                            
                          </div>
                        </div>
                      </div>
                      
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">练习情况数量趋势分析 <a href="javascript:" class="kt-link--info btn-detail-exercises" data-technology-id="${data.technologyID}">(查看数据)</a></span>
                          <div id="exerciseAnalysis${data.technologyID}" style="height:300px;"></div>
                        </div>
                      </div>
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">练习情况百分比趋势分析（%）<a href="javascript:" class="kt-link--info btn-detail-exercises" data-technology-id="${data.technologyID}">(查看数据)</a></span>
                          <div id="exerciseAnalysisPercent${data.technologyID}" style="height:300px;"></div>
                        </div>
                      </div>
  
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">已完成综合练习累计数量</span>
                          <div id="onlineAnswerAnalysis${data.technologyID}" style="max-height:300px;"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`);

                 $("div.hnology-analysis-detail").on("click", ".btn-show-detail", function(){
                 let rootEleent = $(this).parent().parent().parent().parent();
               if ($(rootElement).hasClass('kt-portlet--collapse')) {
                            $(ro.removeClass('kt-portlet--collapse');
                           $(roo.find('.kt-portlet__body').attr('style', '');

                          model.gyID = $(this).attr('data-technology-id');
                         model.lID = $(this).attr('data-language-id');
                         if ($(rnt).find(`#knowledgeAnalysis${model.technologyID}`).children().length === 0){
                    loadKnowledgeAnalysis(model.technologyID);
                                loadAnalysis(model.languageID, model.technologyID);
                       loadWeakKnowleAnalysis(model.technologyID);
                        loadExerciseysis(model.technologyID);
                         loadExercisentAnalysis(model.technologyID);
                      }
                  } else {
                     $(rootEleme.addClass('kt-portlet--collapse');
                     $(rootEleme.find('.kt-portlet__body').attr('style', 'display: none; overflow: hidden; padding-top: 0px; padding-bottom: 0px;');
                }
                    });

                $("div.thnology-analysis-detail").on("click", ".btn-detail-knowledge", function) {
                model.technologyID = $(this).attr('data-technology-id');

                        finidgeModel.pageNumber = 1;
                     finishKdgeModel.totalCount = 0;
                  finishKnowdgeModel.dataList = [];
                $('.finish-knowledge .kt-list-timeline__item').remove();

                        weakledgeModel.pageNumber = 1;
                     weaknesledgeModel.totalCount = 0;
                   weaknessKledgeModel.dataList = [];
                $('.weakness-knowledge .kt-list-timeline__item').remove();

                        noLeowledgeModel.pageNumber = 1;
                      noLearowledgeModel.totalCount = 0;
                   noLearninowledgeModel.dataList = [];
                $('.noLearning-knowledge .kt-list-timeline__item').remove();

                        loadowledge();
                     loadLeaKnowledge();
                   loadNoLeangKnowledge();
                $('#kt_modal_knowledge').modal('show');
                    });

                $("div.thnology-analysis-detail").on("click", ".btn-detail-code-standard", function) {
                model.technologyID = $(this).attr('data-technology-id');
                        $('#_code_standard').modal('show');
                  });

                  $("divhnology-analysis-detail").on("click", ".btn-detail-exercises", function) {
                        modelogyID = $(this).attr('data-technology-id');
                     knowledrcisesModel.pageNumber = 1;
                  loadStudenxercise();
                $('#kt_modal_exercise').modal('show');
                    });
            });

               setLeClass();
          },
            erro: function(e) {
            bootbox.alert(localMessage.NETWORK_ERROR);
            }
        });
     } 

        function loadFinishKnowledge() {
        $.ajax({
           type:'GET',
           url: /ability/detail/knowledge/finish',
          data: {
              pageNuer: finishKnowledgeModel.pageNumber,
             universtyCode: model.universityCode,
              school: model.schoolID,
               studeD: model.studentID,
              technogyID: model.technologyID
           },
          dataType: "JSON",
            succs: function(result) {
             if (rest.err) {
                bootbox.ert(localMessage.formatMessage(result.code, result.msg));
                 return se;
              }
             $('#finsh_knowledge_title').text(commonUtility.isEmptyList(result.list) ? `已掌握的知识点（0）` : `已掌握的知识点（${result.list.length}）`)
                if (onUtility.isEmptyList(result.list)) {
              if (finishKnowledgeModel.totalCount > 0) {
                        $('.nowledge-more').addClass('kt-hidden');
                      $('.finowledge-message-complete').removeClass('kt-hidden');
                   $('.finisnowledge-message-none').addClass('kt-hidden');
                 return fals;
               }
                $('.fini-knowledge-message-complete').addClass('kt-hidden');
                $('.fini-knowledge-message-none').removeClass('kt-hidden');
                 return se;
             }
            finishKnowledgeModel.totalCount += result.list.length;
                resuist.forEach((data) => {
              $('.finish-knowledge').append(
                        `<dis="kt-list-timeline__item">
                <span class="kt-list-timeline__badge kt-list-timeline__badge--success"></span>
                <span class="kt-list-timeline__text">${data.knowledgeName}</span>
               </div>`);
            });
               if (fshKnowledgeModel.totalCount >= result.totalCount) {
                  $('.fi-knowledge-more').removeClass('kt-hidden');
               }
             $('.finsh-knowledge-message-complete').addClass('kt-hidden');
            $('.finish-knowledge-message-none').addClass('kt-hidden');
            },
           error: function(e) {
              bootboalert(localMessage.NETWORK_ERROR);
           }
        });
     } 

        function loadLearningKnowledge() {
        $.ajax({
           type:'GET',
          url: '/ability/detail/knowledge/learning',
          data: {
                pageer: weaknessKnowledgeModel.pageNumber,
              univertyCode: model.universityCode,
             schoolI: model.schoolID,
              studenD: model.studentID,
               techngyID: model.technologyID
          },
            datape: "JSON",
           succes: function(result) {
               if (rt.err) {
                   bootbert(localMessage.formatMessage(result.code, result.msg));
              return false;
                }
               $('#lning_knowledge_title').text(commonUtility.isEmptyList(result.list) ? `正在练习的知识点（0）` : `正在练习的知识点（${result.list.length}）`)
              if (coonUtility.isEmptyList(result.list)) {
                if (weakssKnowledgeModel.totalCount > 0) {
                     $('.wea-knowledge-more').addClass('kt-hidden');
                   $('.weakn-knowledge-message-complete').removeClass('kt-hidden');
                        $('.-knowledge-message-none').addClass('kt-hidden');
                        retu;
                    }
                    $('.ss-knowledge-message-complete').addClass('kt-hidden');
                    $('.ss-knowledge-message-none').removeClass('kt-hidden');
                    retuse;
                }
                weakKnowledgeModel.totalCount += result.list.length;
                resuist.forEach((data) => {
                    $('.ss-knowledge').append(
                        `<dis="kt-list-timeline__item">
                <span class="kt-list-timeline__badge kt-list-timeline__badge--danger"></span>
                <span class="kt-list-timeline__text">${data.knowledgeName}</span>
               </div>`);
                });
                if (nessKnowledgeModel.totalCount >= result.totalCount) {
                    $('.ss-knowledge-more').addClass('kt-hidden');
                }

                $('.ness-knowledge-message-complete').addClass('kt-hidden');
                $('.ness-knowledge-message-none').addClass('kt-hidden');
            },
            erro: function(e) {
                bootalert(localMessage.NETWORK_ERROR);
            }
        });
    }  

        function loadNoLearningKnowledge() {
        $.ajax({
            type:       'GET',
            url: '      /ability/detail/knowledge/noLearning',
            data:       {
                pageNumb    er: noLearningKnowledgeModel.pageNumber,
                universi    tyCode: model.universityCode,
                schoolID    : model.schoolID,
                studentI    D: model.studentID,
                technolo    gyID: model.technologyID
            },      
            dataTy      pe: "JSON",
            succes      s: function(result) {
                if (resul   t.err) {
                    bootbox.al  ert(localMessage.formatMessage(result.code, result.msg)); u
                                  return false;
                                }
                                $('#pending_knowledge_title').text(commonUtility.isEmptyList(result.list) ? `未掌握的知识点（0）` : `未掌握的知识点（${result.list.length}）`)monUtility.isEmptyList(result.list)) {
                                  if (noLearningKnowledgeModel.totalCount > 0) {
                                    $('.noLearning-knowledge-more').addClass('kt-hidden');
                                    $('.noLearning-knowledge-message-complete').removeClass('kt-hidden');
                                    $('.noLearning-knowledge-message-none').addClass('kt-hidden');
                                    return false;
                                  }
                                  $('.noLearning-knowledge-message-complete').addClass('kt-hidden');
                           $('.noLear       ning-knowledge-message-none').removeClass('kt-hidden');
                        return fal          se;
                 }               
                      noLearni          ngKnowledgeModel.totalCount += result.list.length; ist.forEach((data) => {
                             $('.noLear     ning-knowledge').append(
                              `<div clas        s="kt-list-timeline__item">
                <span class="kt-list-timeline__badge kt-list-timeline__badge--primary"></span>
                <span class="kt-list-timeline__text">${data.knowledgeName}</span>
               </div>`);
                   });             
                        if (noLe        arningKnowledgeModel.totalCount >= result.totalCount) {
                                 $('.noLear ning-knowledge-more').addClass('kt-hidden');
                          } else {      
                        $('.noLear          ning-knowledge-more').removeClass('kt-hidden');
                }                

                $('.noLe                arning-knowledge-message-complete').addClass('kt-hidden');earning-knowledge-message-none').addClass('kt-hidden');

                              },
             error                  : function(e) {
                    bootbox.            alert(localMessage.NETWORK_ERROR); _
                                  }
            });                    
     }                 

                        function loadStudentExercise() {
              $.aj          ax({
                       type:        'GET',
                          url: '    /ability/detail/exercise/list',
                              data: {
                pageNumb                er: knowledgeExercisesModel.pageNumber,
                     universi           tyCode: model.universityCode,
                          schoolID      : model.schoolID,
                               studentI D: model.studentID,
                          technolo      gyID: model.technologyID,
                     dataStat           us: knowledgeExercisesModel.dataStatus
                      },        
                         dataTy     pe: "JSON",
                            succes  s: function(result) {
                         if (resul      t.err) {
                         bootbox.al         ert(localMessage.formatMessage(result.code, result.msg)); u
                             return fal                 se;
                                        }    
                                  knowledg          eExercisesModel.totalCount = result.dataContent.totalCount; eExercisesModel.dataList = result.dataContent.dataList; eExercisesModel.pageNumber = parseInt(result.dataContent.currentPageNum); eExercisesModel.maxPageNumber = Math.ceil(result.dataContent.totalCount / result.dataContent.pageSize);geExercisesModel.paginationArray = result.dataContent.paginationArray;leExercisesModel.prePageNum = result.dataContent.prePageNum === undefined ? -1 : parseInt(result.dataContent.prePageNum);neExercisesModel.nextPageNum = result.dataContent.nextPageNum === undefined ? -1 : parseInt(result.dataContent.nextPageNum); eExercisesModel.fromIndex = result.dataContent.dataList === null ? 0 : (knowledgeExercisesModel.pageNumber - 1) * Constants.PAGE_SIZE + 1; eExercisesModel.toIndex = result.dataContent.dataList === null ? 0 : (knowledgeExercisesModel.pageNumber - 1) * Constants.PAGE_SIZE + knowledgeExercisesModel.dataList.length;

                          if (comm                  onUtility.isEmptyList(knowledgeExercisesModel.dataList)) {
                       $('#table_                       exercise tbody').empty();
                                        $('ul.exer      cise-pagination').empty();
                                   $('.kt-pag           ination__toolbar').empty();
                              return fal                se;
                                           } 
                                    $('#tabl        e_exercise tbody').empty(); eExercisesModel.dataList.forEach((data) => {
                               let tr =               
                              `<tr>                    
                <td style="width: 25%">${data.knowledgeName}</td>
                <td style="width: 25%"><a href="${data.exercisesDocumentUrl}" class="kt-link--info" target="_blank">${data.exercisesDocumentUrl.substr(data.exercisesDocumentUrl.lastIndexOf('/') + 1)}</a></td>
                <td style="width: 15%">${data.createTime}</td>`
                                          if (data.d    ataStatus !== 'P') {
                                          tr = tr + `<      td style="width: 15%">${data.updateTime}</td>`
                                   } else {           
                                  tr = tr + `<              td style="width: 15%">&nbsp;</td>`
                           }                   

                                            switch (da  ta.dataStatus) {
                                           case 'P':     
                                            tr = tr + `<td       style="width: 10%"><span class="kt-badge kt-badge--brand kt-badge--inline kt-badge--pill">${data.dataStatusText}</span></td>`;
                                            break;      
                                       case 'W':         
                                         tr = tr + `<td          style="width: 10%"><span class="kt-badge kt-badge--warning kt-badge--inline kt-badge--pill">${data.dataStatusText}</span></td>`;
                                        break;          
                                    case 'R':            
                                     tr = tr + `<td              style="width: 10%"><span class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill">${data.dataStatusText}</span></td>`;
                                    break;              
                               case 'S':                 
                                 tr = tr + `<td                  style="width: 10%"><span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill">${data.dataStatusText}</span></td>`;
                                break;                  
                                            }  
                                        if (!commo      nUtility.isEmpty(data.sourceCodeGitUrl)) {
                                       tr = tr +         
                                        `  <td style="wi        dth: 10%"> <a href="${data.sourceCodeGitUrl}" class="kt-link--info" target="_blank">查看</a> </td>
            </tr>`;
                                 } else {             
                                 tr = tr +               
                                  `  <td style="wi              dth: 10%">&nbsp;</td>
            </tr>`;
                           }                   

                                                        $('#table_exercise tbody').append(tr);
                         });                   

                                       $('ul.ex     ercise-pagination').empty();$ercise-pagination').append(
                                  `<li cla              ss="kt-pagination__link--first">
                  <a href="javascript:"><i class="fa fa-angle-double-left kt-font-warning"></i></a>
                </li>
                <li class="kt-pagination__link--prev">
                  <a href="javascript:"><i class="fa fa-angle-left kt-font-warning"></i></a>
               </li>`);
                                            if (!commonUtility.isEmptyList(knowledgeExercisesModel.paginationArray)) {
                    knowledgeE                          xercisesModel.paginationArray.forEach((pagination) => {
                                         if (knowledg       eExercisesModel.pageNumber === pagination) {
                                          $('ul.exercise        -pagination').append(`<li class="kt-pagination kt-pagination__link--active"><a href="javascript:">${pagination}</a></li>`);
                                     } else {           
                                       $('ul.exercise           -pagination').append(`<li class="kt-pagination"><a href="javascript:">${pagination}</a></li>`);
                                  }              
                           });                   
                  }                          
                                 $('ul.ex           ercise-pagination').append(
                              `<li cla                  ss="kt-pagination__link--next">
                <a href="javascript:"><i class="fa fa-angle-right kt-font-warning"></i></a>
               </li>
               <li class="kt-pagination__link--last">
                <a href="javascript:"><i class="fa fa-angle-double-right kt-font-warning"></i></a>
               </li>`);

                   $('.kt-p                         agination__toolbar').text(`显示第${knowledgeExercisesModel.fromIndex}到第${knowledgeExercisesModel.toIndex}条数据，共计${knowledgeExercisesModel.totalCount}条数据`);

                                  $('ul.ex          ercise-pagination .kt-pagination__link--first').off().click(function() {
                               if (knowle               dgeExercisesModel.pageNumber === 1) {
                              return false                  ;
                                             } 
                                        knowledgeE      xercisesModel.pageNumber = 1;
                                   setActiveP           agination();
                               loadStuden               tExercise();
                      });                      

                                    $('ul.ex        ercise-pagination .kt-pagination__link--prev').off().click(function() {
                                  if (knowle            dgeExercisesModel.pageNumber === 1) {
                                 return false               ;
                          }                    
                     knowledgeE                         xercisesModel.pageNumber--;
                                      setActiveP        agination();
                                 loadStuden             tExercise();
                        });                    

                                       $('ul.ex     ercise-pagination .kt-pagination').off().click(function() {
                                    let pagina          tion = parseInt($(this).text());
                               if (knowle               dgeExercisesModel.pageNumber === pagination) {
                               return false                 ;
                        }                      
                                         knowledgeE     xercisesModel.pageNumber = pagination;
                                     setActiveP         agination();
                                loadStuden              tExercise();
                                            });

                $('ul.ex                            ercise-pagination .kt-pagination__link--next').off().click(function() {
                                   if (knowle           dgeExercisesModel.pageNumber === knowledgeExercisesModel.maxPageNumber) {
                                  return false              ;
                           }                   
                                            knowledgeE  xercisesModel.pageNumber++;
                                       setActiveP       agination();
                                  loadStuden            tExercise();
                          });                  

                   $('ul.ex                         ercise-pagination .kt-pagination__link--last').off().click(function() {
                                     if (knowle         dgeExercisesModel.pageNumber === knowledgeExercisesModel.maxPageNumber) {
                                     return false           ;
                              }                
                                              knowledgeExercisesModel.pageNumber = knowledgeExercisesModel.maxPageNumber;
                    setActiveP                          agination();
                                     loadStuden         tExercise();
                            });                
                 },                         
                              error             : function(e) {
                        bootbox.                    alert(localMessage.NETWORK_ERROR);
             }                             
                      });              
           }                   

                                function setActivePagination() {
                         $('u       l.exercise-pagination .kt-pagination').removeClass('kt-pagination__link--active');
                      $.ea          ch($('ul.exercise-pagination .kt-pagination'), function(index, pagination) {
                       if (pa           rseInt($(pagination).text()) === knowledgeExercisesModel.pageNumber) {
                           $(pagina         tion).addClass('kt-pagination__link--active');
                        }          
                   });             
            }                  

                             fu nction setLevelClass() {
                            $('d    iv.technology-analysis-detail').each(function() {
                             let le     velObject = $(this).find('span.ability-level');

                             let le     vel = $(levelObject).text();
                            switch       (level) {
                               case "L1     ":
                                    $(levelObj  ect).addClass('ability-level-1');
                             break;         
                  case "L2                  ":
                       $(levelObj               ect).addClass('ability-level-2');
                          break;            
                         case "L3           ":
                               $(levelObj       ect).addClass('ability-level-3');
                                  break;    
                                 case "L4   ":
                                      $(levelObject).addClass('ability-level-4');
                    break;                  
                    case "L5                ":
                         $(levelObj             ect).addClass('ability-level-5');
                            break;          
                           case "L6         ":
                                 $(levelObj     ect).addClass('ability-level-6');
                                    break;  
                                    case "L7":
                    $(levelObj                  ect).addClass('ability-level-7');
                       break;               
                       case "L8             ":
                            $(levelObj          ect).addClass('ability-level-8');
                               break;       
                              default:      
                                    break;  
                               }   
                          });      

                   }           

               fu               nction loadCodeStandardAnalysis(languageID, technologyID) {
              $.aj                  ax({
               type:                    "GET",
              url: "                    /ability/detail/codeStandardAnalysis",
              data:                     {
                 studentU                   niversityCode: model.universityCode,
                  studentS                  choolID: model.schoolID,
                   studentI                 D: model.studentID,
                     language               ID: languageID,
                  },                
                 dataTy                 pe: "JSON",
                succes                  s: function(result) {
                    if (resul               t.err) {
                          bootbox.al            ert(localMessage.formatMessage(result.code, result.msg));
                             return fal         se;
                            }        
                              let code      StandardAnalysisList = [];
                               if (resu     lt.dataList === null) {
                                    return fal  se;
                                   } 
                          let stat          eColorIndex = 0;
                 let colo                   rStateKeyArray = [
                      "brand",                
                         "light",             
                            "dark",          
                                "primary",      
                                   "success",   
                                      "info",
                    "warning",                  
                       "danger",               
                           "colors9",           
                              "colors10"        ,
                                 "colors11"     ,
                                    "colors12"  ,
                             "colors13"         ,
                      "colors14"                ,
                         "colors15"             ,
                            "colors16"          ,
                               "colors17"       ,
                                   "colors18"   ,
                                      "colors19",
                    "colors20"                  
                   ];                 
                    result.d                ataList.forEach(function(codeStandard, index) {
                          if (stateCo           lorIndex > colorStateKeyArray.length - 1){
                                 stateColorIn       dex = 0;
                                  }    
                                     $('#table_ code_standard tbody').append(
                                  `<tr>      
              <th style="width: 15%">${index + 1}</th>
              <td style="width: 65%">${codeStandard.codeStandardName}</td>
              <td style="width: 20%">${codeStandard.codeStandardCount}</td>
            </tr>`
                         );           
                              codeStanda        rdAnalysisList.push({
                                     label: codeS   tandard.codeStandardName,
                                data: codeSt        andard.codeStandardCount,
                          color: KTAp               p.getStateColor(colorStateKeyArray[stateColorIndex])
                           });           
                              stateColor        Index++;
                             });       


                              $.plot($      (`#codeStandardAnalysis${technologyID}`), codeStandardAnalysisList, {
                                    series: {  
                                 pie: {       
                               show: true,           
                                       radius: 1,   
                                    label: {      
                                    show: true,        
                                   radius: 1,         
                                  formatter: funct          ion(label, series) {
                                     return '<div style         ="font-size:8pt;text-align:center;padding:2px;color:white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
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
                error                   : function(e) {
                  bootbox.                  alert(localMessage.NETWORK_ERROR);
                }                  
           });                     
                         }     

                     fu         nction loadWeakKnowledgeAnalysis(technologyID) {
                    $.aj            ax({
                     type:              "GET",
                    url: "              /ability/detail/knowledge/weak",
                    data:               {
                       pageNumb             er: weakKnowledgeModel.pageNumber,
                        universi            tyCode: model.universityCode,
                         schoolID           : model.schoolID,
                           studentI         D: model.studentID,
                            technolo        gyID: technologyID,
                         },         
                        dataTy          pe: "JSON",
                        succes          s: function(result) {
                           if (resul        t.err) {
                                 bootbox.al     ert(localMessage.formatMessage(result.code, result.msg));
                                    return fal  se;
                                    }
                let elem                    entObj = $(`#weakKnowledge${technologyID}`);
                 weakKnow                   ledgeModel.totalCount = result.totalCount;
                  if (weak                  KnowledgeModel.totalCount === 0) {
                       $(elementO               bj).append('<div class="text-center">暂时没有薄弱的知识点</div>');
                           return fal           se;
                          }          
                           weakKnow         ledgeModel.maxPageNumber = Math.ceil(result.dataContent.totalCount / result.dataContent.pageSize);
                            weakKnow        ledgeModel.dataList = result.dataContent.dataList;

                              let data      ListHtml =
                                   '<table      class="table table-striped text-center">\n' +
                                    '  <thea    d>\n' +
                                     '  <tr>\   n' +
                                       '    <th  style="width: 15%;">#</th>\n' +
                                        '    <th style="width: 70%;">知识点名称</th>\n' +
                    '    <th                     style="width: 15%;">修改次数</th>\n' +
                     '  </tr>                   \n' +
                      '  </the                  ad>\n' +
                        '  <tbod                y>';

                     weakKnow               ledgeModel.dataList.forEach(function(data, index) {
                          dataListHt            ml +=
                                 `  <tr>         
                  <th scope="row" style="width: 15%;">${index+1}</th>
                  <td style="width: 70%;">${data.knowledgeName}</td>
                  <td style="width: 15%;">${data.reviewCount}</td>
                </tr>`;
                             });       

                              dataList      Html +=
                                   '  </tbo     dy>\n' +
                                    '</table    >';

                                  $(elemen  tObj).append(dataListHtml);
                               },   
                              error     : function(e) {
                                bootbox.    alert(localMessage.NETWORK_ERROR);
                              }    
                         });       
                   }           

              fu                nction loadKnowledgeAnalysis(technologyID) {
              $.aj                  ax({
               type:                    "GET",
              url: "                    /ability/detail/knowledgeAnalysis",
             data:                      {
                 studentU                   niversityCode: model.universityCode,
                  studentS                  choolID: model.schoolID,
                   studentI                 D: model.studentID,
                    technolo                gyID: technologyID,
                  },                
                 dataTy                 pe: "JSON",
                succes                  s: function(result) {
                   if (resul                t.err) {
                          bootbox.al            ert(localMessage.formatMessage(result.code, result.msg));
                             return fal         se;
                            }        

                             let data        = [
                                   { label: "未  掌握", data: result.data.noLearningKnowledgeCount, color: KTApp.getStateColor("brand") },
                             { label: "已        掌握", data: result.data.graspKnowledgeCount, color: KTApp.getStateColor("success")},
                     { label: "练                习中", data: result.data.learningPercentCount, color: KTApp.getStateColor("danger")}
                    ];                

                     $.plot($               (`#knowledgeAnalysis${technologyID}`), data, {
                           series: {           
                                  pie: {      
                                 show: true,         
                             radius: 1,             
                                    label: {      
                                     show: true,       
                                    radius: 1,        
                                   formatter: funct         ion(label, series) {
                                     return '<div style         ="font-size:8pt;text-align:center;padding:2px;color:white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
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
                           error        : function(e) {
                              bootbox.      alert(localMessage.NETWORK_ERROR);
                           }       
                      });          
               }               

           fu                   nction loadExerciseAnalysis(technologyID) {
          $.aj                      ax({
                                type:   "GET",
                                url: "  /ability/detail/exerciseAnalysis",
                               data:    {
                                  studentU  niversityCode: model.universityCode,
                                   studentS choolID: model.schoolID,
                          studentI          D: model.studentID,
                 technolo                   gyID: technologyID,
              },                    
                                  dataType: "JSON",
            succes                      s: function(result) {
                                   if (result.err) {
                      bootbox.al                ert(localMessage.formatMessage(result.code, result.msg));
                         return fal             se;
                        }            

                          new Morr          is.Line({
                               // ID of t       he element in which to draw the chart.
                                  element: `    exerciseAnalysis${technologyID}`,
                                     // Chart d ata records -- each entry in this array corresponds to a point on
                              // the cha        rt.
                       data: resu               lt.dataList,
                          // The nam            e of the data record attribute that contains x-values.
                             xkey: 'mon         ths',
                                // A list       of names of data record attributes that contain y-values.
                                    ykeys: ['a  ssignTotalCount', 'finishTotalCount', 'onceCompilationSuccessTotalCount', 'onceRunCorrectTotalCount'],
                             // Labels          for the ykeys -- will be displayed when you hover over the
                     // chart.                 
                        labels: ['              布置练习数量', '完成练习数量', '一次性编译成功数量', '一次性运行正确数量'],
                           lineColors           : ['#3d94fb', '#f6aa33', '#2bc9c5', '#1dc94c']
                           });         

                        },          
                       error            : function(e) {
                         bootbox.           alert(localMessage.NETWORK_ERROR);
                       }           
                  });              
           }                   

      fu                        nction loadExercisePercentAnalysis(technologyID) {
                           $.aj     ax({
                            type:       "GET",
                           url: "       /ability/detail/exercisePercentAnalysis",
                           data:        {
                              studentU      niversityCode: model.universityCode,
                               studentS     choolID: model.schoolID,
                                studentI    D: model.studentID,
                                  technolo  gyID: technologyID,
                               },   
                              dataTy    pe: "JSON",
                             succes     s: function(result) {
                                 if (resul  t.err) {
                             bootbox.al         ert(localMessage.formatMessage(result.code, result.msg));
                     return fal                 se;
                    }                

                     new Morr               is.Line({
                           // ID of t           he element in which to draw the chart.
                              element: `        exerciseAnalysisPercent${technologyID}`,
                                 // Chart d     ata records -- each entry in this array corresponds to a point on
                                    // the cha  rt.
                             data: resu         lt.dataList,
                      // The nam                e of the data record attribute that contains x-values.
                         xkey: 'mon             ths',
                            // A list           of names of data record attributes that contain y-values.
                               ykeys: ['f       inishPercent', 'onceCompilationSuccessPercent', 'onceRunCorrectPercent'],
                                   // Labels    for the ykeys -- will be displayed when you hover over the
                                      // chart.
                    labels: ['                  练习完成率(%)', '一次性编译成功率(%)', '一次性运行正确率(%)'],
                       lineColors               : ['#f6aa33', '#2bc9c5', '#1dc94c']
                      });              

                    },              
                   error                : function(e) {
                     bootbox.               alert(localMessage.NETWORK_ERROR);
                  }                
              });                  
       }                       

                       $(       '.btn-filter').click(function() {
                       know         ledgeExercisesModel.dataStatus = $(this).attr('data-status');
                    know            ledgeExercisesModel.pageNumber = 1;
                 $('.               btn-filter').removeClass('btn-info');
              $('.                  btn-filter').addClass('btn-outline-hover-info');
            $(th                    is).addClass('btn-info');
         $(th                       is).removeClass('btn-outline-hover-info');
                           load     StudentExercise();
                     })         ;

                in              itPage();
                            });