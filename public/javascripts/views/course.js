let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    bizLog: {
      pageName: 'course',
      operationName: {
        PAGE_LOAD: 'PL',
        SAVE_COURSE: 'SC'
      },
      logMemo: '',
    },

    //region step1: 选择所属技术
    pageNumber: 1,
    technologyTotalCount: 0,
    technologyList: [],
    //endregion

    //region step2: 课程基本信息
    courseName: '',
    courseBeginDate: '',
    courseBeginDateFormat: '',
    courseEndDate: '',
    courseEndDateFormat: '',
    courseIntroduction: '',
    weeklyDayList: [
      {day:1, dayText: '周一'},
      {day:2, dayText: '周二'},
      {day:3, dayText: '周三'},
      {day:4, dayText: '周四'},
      {day:5, dayText: '周五'},
      {day:6, dayText: '周六'},
      {day:7, dayText: '周日'},
    ],
    courseList: [
      {order:1, orderText: '第一节', time: '08:00~08:45'},
      {order:2, orderText: '第二节', time: '09:00~09:45'},
      {order:3, orderText: '第三节', time: '10:00~10:45'},
      {order:4, orderText: '第四节', time: '11:00~11:45'},
      {order:5, orderText: '第五节', time: '14:00~14:45'},
      {order:6, orderText: '第六节', time: '15:00~15:45'},
      {order:7, orderText: '第七节', time: '16:00~16:45'},
      {order:8, orderText: '第八节', time: '17:00~17:45'}
    ],
    selectWeekday: null,
    selectCourseList: [],
    courseScheduleList: [],
    //endregion

    //region step3: 课程计划
    selectedTechnology: null,
    courseOrder: 0,
    learningPhaseList: [],
    selectedLearningPhase: {learningPhaseID: 0, learningPhaseName: '请选择学习阶段'},
    knowledgeList: [],
    courseKnowledgeList: [],
    coursePlanList: [],

    copyCoursePlanTitle: '',
    copyCourseList: [],
    copyCoursePlanList: [],
    isAdd: false,
    //endregion

    //region step4: 预览提交
    loginUser: null,
    isSubmitSuccess: false
    //endregion
  };

  $scope.initPage = function () {
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.PAGE_LOAD,
        bizLogger.OPERATION_TYPE.LOAD,
        bizLogger.OPERATION_RESULT.SUCCESS);
    if(!commonUtility.isLogin()){
      location.href = '/login?backUrl=/course';
      return false;
    }
    $scope.model.loginUser = commonUtility.getLoginUser();
    $scope.setMenuActive();
    $scope.loadTechnologyList();
  };

  $scope.setMenuActive = function () {
    $('ul.kt-menu__nav li:nth-child(1)').addClass('kt-menu__item--here');
  };

  //region step1: 选择所属技术
  $scope.loadTechnologyList = function () {
    $http.get(`/index/technologyList?pageNumber=${$scope.model.pageNumber}`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if(response.data.dataContent === null || response.data.dataContent.dataList === null){
        if($scope.model.pageNumber > 1){
          $scope.model.pageNumber--;
          layer.msg(localMessage.NO_TECHNOLOGY_DATA);
        }
        return false;
      }

      response.data.dataContent.dataList.forEach(function (data) {
        data.selected = false;
        $scope.model.technologyList.push(data);
      });

      $scope.model.technologyTotalCount = response.data.dataContent.totalCount;
      $scope.model.pageNumber = response.data.dataContent.currentPageNum;
      $scope.setCourseTechnology();
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.setCourseTechnology = function() {
    let technologyID = localStorage.getItem(Constants.KEY_NEW_COURSE_TECHNOLOGY);
    if(technologyID === null) {
      return false;
    }
    $scope.model.technologyList.forEach(function (technology) {
      if(technology.technologyID === parseInt(technologyID)){
        $scope.model.selectedTechnology = technology;
        technology.selected = true;
      }
    });
    $scope.loadLearningPhase();
    $scope.model.courseKnowledgeList.splice(0, $scope.model.courseKnowledgeList.length);
    $scope.loadCourseCopyList();
  };

  $scope.onLoadMoreTechnology = function (){
    $scope.model.pageNumber++;
    $scope.loadTechnologyList();
  };

  $scope.onChooseTechnology = function(selectedTechnology){
    if($scope.model.selectedTechnology !== null &&
        $scope.model.selectedTechnology.technologyID === selectedTechnology.technologyID){
      return false;
    }
    $scope.model.selectedTechnology = selectedTechnology;
    $scope.model.technologyList.forEach(function (technology) {
      technology.selected = technology.technologyID === selectedTechnology.technologyID;
    });
    $scope.loadLearningPhase();
    $scope.model.courseKnowledgeList.splice(0, $scope.model.courseKnowledgeList.length);
    $scope.loadCourseCopyList();
  };
  //endregion

  //region step2: 课程基本信息
  $scope.onShowCourseScheduleModal = function() {
    $scope.model.selectWeekday = null;
    $scope.model.selectCourseList.splice(0, $scope.model.selectCourseList.length);
    $('input[name="weekday"]').prop('checked',false);
    $('input[name="courseTime"]').prop('checked',false);
    $('#kt_modal_1').modal('show');
  };

  $scope.onBeginDateChange = function(beginDate) {
    $http.get(`/common/dateFormat?utcDate=${beginDate}`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      $scope.model.courseBeginDateFormat = response.data.formatDate
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onEndDateChange = function(courseEndDate) {
    $http.get(`/common/dateFormat?utcDate=${courseEndDate}`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      $scope.model.courseEndDateFormat = response.data.formatDate
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onChooseWeeklyDay = function(weekday) {
    $scope.model.selectWeekday = weekday;
  };

  $scope.onChooseCourse = function(course) {
    let isExists = false;
    let index = -1;
    $scope.model.selectCourseList.forEach(function (selectCourse, i) {
      if(selectCourse.order === course.order) {
        isExists = true;
        index = i;
      }
    });

    if(isExists){
      $scope.model.selectCourseList.splice(index, 1);
    }else{
      $scope.model.selectCourseList.push(course);
    }
  };

  $scope.onSelectCourseSchedule = function(){
    if($scope.model.selectWeekday !== null && $scope.model.selectCourseList.length > 0){
      let courseList = [];
      $scope.model.selectCourseList.forEach(function (selectCourse) {
        courseList.push(selectCourse);
      });

      $scope.model.courseScheduleList.push({
        weekday: $scope.model.selectWeekday,
        schedule: courseList
      });
    }
    $('#kt_modal_1').modal('hide');
  };

  $scope.onRemoveCourseSchedule = function(courseSchedule) {
    let index = -1;
    $scope.model.courseScheduleList.forEach(function (course, i) {
      if(course.weekday.day === courseSchedule.weekday.day){
        index = i;
      }
    });
    $scope.model.courseScheduleList.splice(index, 1);
  };
  //endregion

  //region step3: 课程计划
  $scope.loadCourseCopyList = function () {
    $http.get(`/course/copy/list?universityCode=${$scope.model.loginUser.universityCode}&schoolID=${$scope.model.loginUser.schoolID}&teacherID=${$scope.model.loginUser.customerID}&technologyID=${$scope.model.selectedTechnology.technologyID}`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if(commonUtility.isEmptyList(response.data.dataList)){
        $scope.model.copyCourseList = [];
        return false;
      }
      $scope.model.copyCourseList = response.data.dataList;
      $scope.model.copyCoursePlanTitle = `拷贝${$scope.model.selectedTechnology.technologyName}授课计划`;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onShowCoursePlanModal = function(){
    if(!$scope.model.isAdd){
      $scope.model.courseOrder = 1;
    }else {
      $scope.model.courseOrder++;
      $('input[name="technologyKnowledge"]').prop('checked',false);
      $scope.model.courseKnowledgeList.splice(0, $scope.model.courseKnowledgeList.length);
      $scope.model.isAdd = false;
    }
    $('#kt_modal_2').modal('show');
  };

  $scope.onShowCopyModal = function () {
    $('#kt_modal_3').modal('show');
  };

  $scope.onCopyCoursePlan = function (course) {

    $http.get(`/course/copy/coursePlan?universityCode=${course.universityCode}&schoolID=${course.schoolID}&courseID=${course.courseID}`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if(commonUtility.isEmptyList(response.data.dataList)){
        layer.msg(localMessage.COURSE_PLAN_NOT_FOUND);
        return false;
      }

      let courseClassArray = commonUtility.distinctArray(response.data.dataList.map(obj => {return obj.courseClass}));

      courseClassArray.forEach(function (courseClass) {
        let courseClassDataList= response.data.dataList.filter((data) => {return data.courseClass === courseClass;});

        let courseKnowledgeIDArray = courseClassDataList.map(obj => {return obj.knowledgeID});
        let courseKnowledgeNameArray = courseClassDataList.map(obj => {return obj.knowledgeName});

        let learningPhaseIDArray = courseClassDataList.map(obj => {return obj.learningPhaseID});
        let learningPhaseNameArray = courseClassDataList.map(obj => {return obj.learningPhaseName});

        $scope.model.coursePlanList.push({
          technologyID: $scope.model.selectedTechnology.technologyID,
          technologyName: $scope.model.selectedTechnology.technologyName,
          technologyThumbnail: $scope.model.selectedTechnology.technologyThumbnail,
          courseOrder: courseClass,
          learningPhaseID: learningPhaseIDArray[0],
          learningPhaseName: learningPhaseNameArray[0],
          knowledgeIDArray: courseKnowledgeIDArray,
          knowledgeNameArray: courseKnowledgeNameArray
        });
      });

      $scope.model.isAdd = true;
      $('#kt_modal_3').modal('hide');


    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.loadLearningPhase = function () {
    $http.get(`/course/learningPhase?technologyID=${$scope.model.selectedTechnology.technologyID}`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if(commonUtility.isEmptyList(response.data.dataList)){
        return false;
      }
      $scope.model.learningPhaseList = response.data.dataList;
      if($scope.model.learningPhaseList.length > 0){
        $scope.model.selectedLearningPhase = {
          learningPhaseID: $scope.model.learningPhaseList[0].learningPhaseID,
          learningPhaseName: $scope.model.learningPhaseList[0].learningPhaseName
        };
        $scope.loadKnowledgeList();
      }
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onLearningPhase = function(data) {
    if($scope.model.selectedLearningPhase.learningPhaseID === data.learningPhaseID){
      return false;
    }
    $scope.model.selectedLearningPhase = {
      learningPhaseID: data.learningPhaseID,
      learningPhaseName: data.learningPhaseName
    };
    $scope.loadKnowledgeList();
  };

  $scope.loadKnowledgeList = function () {
    $http.get(`/course/knowledgeList?technologyID=${$scope.model.selectedTechnology.technologyID}&learningPhaseID=${$scope.model.selectedLearningPhase.learningPhaseID}`)
        .then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      $scope.model.knowledgeList.splice(0, $scope.model.knowledgeList.length);
      response.data.knowledgeList.forEach(function (knowledge) {
        $scope.model.knowledgeList.push({
          technologyID: $scope.model.selectedTechnology.technologyID,
          technologyName: $scope.model.selectedTechnology.technologyName,
          technologyThumbnail: $scope.model.selectedTechnology.technologyThumbnail,
          learningPhaseID: $scope.model.selectedLearningPhase.learningPhaseID,
          learningPhaseName: $scope.model.selectedLearningPhase.learningPhaseName,
          knowledgeID: knowledge.knowledgeID,
          knowledgeName: knowledge.knowledgeName
        });
      });
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onChooseKnowledge = function(knowledge, event) {
    let checkbox = event.target;
    if(checkbox.checked){
      $scope.model.courseKnowledgeList.push(knowledge);
    }else{
      let index = -1;
      $scope.model.courseKnowledgeList.forEach(function (courseKnowledge,i) {
        if(courseKnowledge.knowledgeID === knowledge.knowledgeID){
          index = i;
        }
      });
      $scope.model.courseKnowledgeList.splice(index, 1);
    }
  };

  $scope.onSetCoursePlan = function() {
    $scope.model.isAdd = true;

    let courseKnowledgeIDArray = $scope.model.courseKnowledgeList.map(obj => {return obj.knowledgeID});
    let courseKnowledgeNameArray = $scope.model.courseKnowledgeList.map(obj => {return obj.knowledgeName});

    $scope.model.coursePlanList.push({
      technologyID: $scope.model.selectedTechnology.technologyID,
      technologyName: $scope.model.selectedTechnology.technologyName,
      technologyThumbnail: $scope.model.selectedTechnology.technologyThumbnail,
      courseOrder: $scope.model.courseOrder,
      learningPhaseID: $scope.model.selectedLearningPhase.learningPhaseID,
      learningPhaseName: $scope.model.selectedLearningPhase.learningPhaseName,
      knowledgeIDArray: courseKnowledgeIDArray,
      knowledgeNameArray: courseKnowledgeNameArray
    });
    $('#kt_modal_2').modal('hide');
  };

  $scope.onRemoveCoursePlan = function(coursePlan) {
    let index = -1;
    $scope.model.coursePlanList.forEach(function (plan, i) {
      if(plan.courseOrder === coursePlan.courseOrder){
        index = i;
      }
    });
    $scope.model.coursePlanList.splice(index, 1);
  };

  //endregion

  //region step4: 预览提交
  $scope.checkCourseDate = function() {
    let dateFrom = new Date($scope.model.courseBeginDateFormat + ' 00:00:00');
    let dateTo = new Date($scope.model.courseEndDateFormat + ' 23:59:59');
    // let result = Date.compare(dateFrom, dateTo);
    if(dateFrom > dateTo){
      swal.fire({
        title: "数据校验未通过",
        text: "课程的结束时间不能小于开始时间",
        type: "error",
        confirmButtonClass: "btn btn-secondary"
      });
      return false;
    }
    return true;
  };

  $scope.onSubmit = function() {
    if(!$scope.checkCourseDate()){
      return false;
    }

    $http.get(`/course/checkCourse?universityCode=${$scope.model.loginUser.universityCode}&schoolID=${$scope.model.loginUser.schoolID}&courseName=${$scope.model.courseName}&courseTimeBegin=${$scope.model.courseBeginDateFormat}&courseTimeEnd=${$scope.model.courseEndDateFormat}`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if(response.data.result){
        swal.fire({
          title: "数据校验未通过",
          text: "该课程已经创建，请检查课程名称和授课时间",
          type: "error",
          confirmButtonClass: "btn btn-secondary"
        });
        return false;
      }
      $scope.submit();
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.submit = function() {
    let btn = $('[data-ktwizard-type="action-submit"]');
    $(btn).attr('disabled',true);
    KTApp.progress(btn);

    let courseScheduleEntityList = [];
    let coursePlanEntityList = [];
    $scope.model.courseScheduleList.forEach(function (courseSchedule) {
      courseSchedule.schedule.forEach(function (classSchedule) {
        courseScheduleEntityList.push({
          weekday: courseSchedule.weekday.day,
          weekdayClass: classSchedule.order,
          weekdayClassTime: classSchedule.time
        })
      });
    });

    $scope.model.coursePlanList.forEach(function (coursePlan) {
      coursePlan.knowledgeIDArray.forEach(function (knowledgeID) {
        coursePlanEntityList.push({
          courseClass: coursePlan.courseOrder,
          technologyID: $scope.model.selectedTechnology.technologyID,
          learningPhaseID: coursePlan.learningPhaseID,
          knowledgeID: knowledgeID
        })
      })
    });

    $http.post('/course', {
      universityCode: $scope.model.loginUser.universityCode,
      schoolID: $scope.model.loginUser.schoolID,
      technologyID: $scope.model.selectedTechnology.technologyID,
      courseName: $scope.model.courseName,
      teacherID: $scope.model.loginUser.customerID,
      courseTimeBegin: $scope.model.courseBeginDateFormat,
      courseTimeEnd: $scope.model.courseEndDateFormat,
      courseIntroduction: $scope.model.courseIntroduction,
      courseScheduleJson: JSON.stringify(courseScheduleEntityList),
      coursePlanJson: JSON.stringify(coursePlanEntityList),
      loginUser: $scope.model.loginUser.customerID
    }).then(function successCallback(response) {
      if(response.data.err) {
        bizLogger.logInfo(
            $scope.model.bizLog.pageName,
            $scope.model.bizLog.operationName.SAVE_COURSE,
            bizLogger.OPERATION_TYPE.INSERT,
            bizLogger.OPERATION_RESULT.FAILED);
        KTApp.unprogress(btn);
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      $scope.model.isSubmitSuccess = true;
      bizLogger.logInfo(
          $scope.model.bizLog.pageName,
          $scope.model.bizLog.operationName.SAVE_COURSE,
          bizLogger.OPERATION_TYPE.INSERT,
          bizLogger.OPERATION_RESULT.SUCCESS);
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };
  //endregion

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);