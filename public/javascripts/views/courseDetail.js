let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    //region 课程基本信息
    universityCode: 0,
    schoolID: 0,
    courseID: 0,
    courseStatus: 'A',
    courseInfo: null,
    courseBaseInfo: {},
    courseBeginDateFormat: '',
    courseEndDateFormat: '',
    isLogin: false,
    loginUser: null,
    //endregion

    //region 课程表信息
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

    //region 授课计划
    coursePlanList: [],
    courseOrder: 0,
    selectedTechnology: null,
    learningPhaseList: [],
    selectedLearningPhase: {learningPhaseID: 0, learningPhaseName: '请选择学习阶段'},
    knowledgeList: [],
    courseKnowledgeList: [],
    isClickAdd: false,
    noFinishClassCount: 0,
    //endregion

    //region 编程练习
    exercisesList: [],
    exercisesCourseClass: 0,
    courseExercisesList: [],
    courseExercisesFilterList: [],
    //endregion

    //region 报名学生
    fromIndex4SignUp: 0,
    toIndex4SignUp: 0,
    pageNumber4SignUp: 1,
    totalCount4SignUp: 0,
    maxPageNumber4SignUp: 0,
    dataList4SignUp: [],
    paginationArray4SignUp: [],
    prePageNum4SignUp: -1,
    nextPageNum4SignUp: -1,
    //endregion

    //region 批改练习
    filterStatus: 'NULL',
    fromIndex4Exercises: 0,
    toIndex4Exercises: 0,
    pageNumber4Exercises: 1,
    totalCount4Exercises: 0,
    maxPageNumber4Exercises: 0,
    dataList4Exercises: [],
    paginationArray4Exercises: [],
    prePageNum4Exercises: -1,
    nextPageNum4Exercises: -1,
    //endregion

  };

  //region 页面初始化
  $scope.initPage = function(){
    if(!$scope.loadParameter()){
      return false;
    }

    $scope.loadCourseInfo();
    $scope.loadCourseExercises();
    $scope.loadCourseStudent();
    $scope.loadCourseStudentExercises();
    $scope.loadCourseQuestion();
  };

  $scope.loadParameter = function(){
    let courseInfoJson = localStorage.getItem(Constants.KEY_INFO_COURSE_IDENTIFY);
    if(commonUtility.isEmpty(courseInfoJson)){
      bootbox.alert(localMessage.PARAMETER_ERROR);
      return false;
    }
    let courseInfo = JSON.parse(courseInfoJson);
    $scope.model.universityCode = courseInfo.universityCode;
    $scope.model.schoolID = courseInfo.schoolID;
    $scope.model.courseID = courseInfo.courseID;
    $scope.model.isLogin = commonUtility.isLogin();
    $scope.model.loginUser = commonUtility.getLoginUser();
    return true;
  };
  //endregion

  //region 课程基本信息
  $scope.loadCourseInfo = function(){
    $http.get(`/course/info?universityCode=${$scope.model.universityCode}&schoolID=${$scope.model.schoolID}&courseID=${$scope.model.courseID}&dataStatus=${$scope.model.courseStatus}`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if(response.data.totalCount === 0){
        layer.msg(localMessage.COURSE_NOT_FOUND);
        return false;
      }
      $scope.model.courseInfo = response.data.courseDetail;
      if(!commonUtility.isEmptyList(response.data.courseDetail.coursePlanList)){
        $scope.model.courseOrder = response.data.courseDetail.coursePlanList[response.data.courseDetail.coursePlanList.length - 1].courseClass + 1;
      }

      $scope.loadCourseBaseInfo();
      $scope.loadCourseSchedule();
      $scope.loadCoursePlan();
      $scope.loadLearningPhase();
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.loadCourseBaseInfo = function() {
    $scope.model.courseBaseInfo.courseID = $scope.model.courseInfo.courseID;
    $scope.model.courseBaseInfo.courseName = $scope.model.courseInfo.courseName;
    $scope.model.courseBaseInfo.courseTimeBegin = new Date($scope.model.courseInfo.courseTimeBegin);
    $scope.model.courseBaseInfo.courseBeginDateFormat = $scope.model.courseInfo.courseTimeBegin;
    $scope.model.courseBaseInfo.courseTimeEnd = new Date($scope.model.courseInfo.courseTimeEnd);
    $scope.model.courseBaseInfo.courseEndDateFormat = $scope.model.courseInfo.courseTimeEnd;
    $scope.model.courseBaseInfo.courseIntroduction = $scope.model.courseInfo.courseIntroduction;
  };

  $scope.onBeginDateChange = function(beginDate) {
    $http.get(`/common/dateFormat?utcDate=${beginDate}`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      $scope.model.courseBaseInfo.courseBeginDateFormat = response.data.formatDate;
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
      $scope.model.courseBaseInfo.courseEndDateFormat = response.data.formatDate;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onOpenTechnologyInfo = function(technologyID) {
    window.open(`/technology?technology=${technologyID}`);
  };

  $scope.onDeleteCourse = function() {
    bootbox.confirm({
      message: `您确认要删除该课程吗？`,
      buttons: {
        confirm: {
          label: '确认',
          className: 'btn-danger'
        },
        cancel: {
          label: '取消',
          className: 'btn-secondary'
        }
      },
      callback: function (result) {
        if(result) {
          let btn = $('#btnDeleteCourse');
          $(btn).attr('disabled',true);
          KTApp.progress(btn);

          $http.put('/course/detail/delete', {
            universityCode: $scope.model.courseInfo.universityCode,
            schoolID: $scope.model.courseInfo.schoolID,
            teacherID: $scope.model.courseInfo.teacherID,
            courseID: $scope.model.courseInfo.courseID,
            loginUser: $scope.model.loginUser.customerID
          }).then(function successCallback(response) {
            if(response.data.err) {
              bizLogger.logInfo('courseDetail', 'delete course failed', `customer: ${$scope.model.loginUser.customerID}`);
              KTApp.unprogress(btn);
              bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
              return false;
            }
            bizLogger.logInfo('courseDetail', 'delete course info success', `customer: ${$scope.model.loginUser.customerID}`);
            location.href = '/index';
          }, function errorCallback(response) {
            bootbox.alert(localMessage.NETWORK_ERROR);
          });
        }
      }
    });
  };

  $scope.onSaveCourseInfo = function(){
    bootbox.confirm({
      message: `您确认要修改课程的基本信息吗？`,
      buttons: {
        confirm: {
          label: '确认',
          className: 'btn-primary'
        },
        cancel: {
          label: '取消',
          className: 'btn-secondary'
        }
      },
      callback: function (result) {
        if(result) {
          let btn = $('#btnSaveCourseInfo');
          $(btn).attr('disabled',true);
          KTApp.progress(btn);

          $http.put('/course/detail/courseBaseInfo', {
            courseID: $scope.model.courseInfo.courseID,
            universityCode: $scope.model.courseInfo.universityCode,
            schoolID: $scope.model.courseInfo.schoolID,
            technologyID: $scope.model.courseInfo.technologyID,
            courseName: $scope.model.courseBaseInfo.courseName,
            teacherID: $scope.model.courseInfo.teacherID,
            courseTimeBegin: $scope.model.courseBaseInfo.courseBeginDateFormat,
            courseTimeEnd: $scope.model.courseBaseInfo.courseEndDateFormat,
            courseIntroduction: $scope.model.courseBaseInfo.courseIntroduction,
            loginUser: $scope.model.loginUser.customerID
          }).then(function successCallback(response) {
            if(response.data.err) {
              bizLogger.logInfo('courseDetail', 'change course info failed', `customer: ${$scope.model.loginUser.customerID}`);
              KTApp.unprogress(btn);
              bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
              return false;
            }
            $scope.model.courseInfo.courseName = $scope.model.courseBaseInfo.courseName;
            $scope.model.courseInfo.courseTimeBegin = $scope.model.courseBaseInfo.courseBeginDateFormat;
            $scope.model.courseInfo.courseTimeEnd = $scope.model.courseBaseInfo.courseEndDateFormat;
            $scope.model.courseInfo.courseIntroduction = $scope.model.courseBaseInfo.courseIntroduction;
            layer.msg(localMessage.SAVE_SUCCESS);
            KTApp.unprogress(btn);
            $(btn).removeAttr('disabled');
            bizLogger.logInfo('courseDetail', 'change course info success', `customer: ${$scope.model.loginUser.customerID}`);
          }, function errorCallback(response) {
            bootbox.alert(localMessage.NETWORK_ERROR);
          });
        }
      }
    });
  };
  //endregion

  //region 公用方法
  $scope.convertNumberToCh = function(num) {
    if(isNaN(num) || num > 10){
      return '';
    }
    let chArr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    return chArr[num];
  };
  //endregion

  //region 课程表
  $scope.getWeekdayObject = function(day) {
    let mapWeekDay = null;
    $scope.model.weeklyDayList.forEach(function (obj) {
      if(obj.day === day){
        mapWeekDay = obj;
      }
    });
    return mapWeekDay;
  };

  $scope.getCourseArray = function(courseOrder, arr) {
    let mapCourse = null;
    $scope.model.courseList.forEach(function (obj) {
      if(obj.order === courseOrder){
        mapCourse = obj;
      }
    });
    arr.push(mapCourse);
    return arr;
  };

  $scope.loadCourseSchedule = function() {
    if(commonUtility.isEmptyList($scope.model.courseInfo.courseScheduleList)){
      return false;
    }
    let courseScheduleArr = [];
    $scope.model.courseInfo.courseScheduleList.forEach(function (schedule) {
      if($scope.model.courseScheduleList.length === 0) {
        $scope.model.courseScheduleList.push({
          weekday: $scope.getWeekdayObject(schedule.weekday),
          schedule: $scope.getCourseArray(schedule.weekdayClass, courseScheduleArr),
        });
      }else {
        let currentWeekday = schedule.weekday;
        let isExistCurrentWeekday = false;
        let isExistCurrentWeekdayIndex = -1;
        $scope.model.courseScheduleList.forEach(function (s,i) {
          if(s.weekday.day === currentWeekday){
            isExistCurrentWeekday = true;
            isExistCurrentWeekdayIndex = i;
          }
        });

        if(isExistCurrentWeekday) {
          $scope.model.courseScheduleList[isExistCurrentWeekdayIndex].schedule = $scope.getCourseArray(schedule.weekdayClass, courseScheduleArr)
        }else{
          courseScheduleArr = [];
          $scope.model.courseScheduleList.push({
            weekday: $scope.getWeekdayObject(schedule.weekday),
            schedule: $scope.getCourseArray(schedule.weekdayClass, courseScheduleArr),
          });
        }
      }
    });
  };

  $scope.onShowCourseScheduleModal = function() {
    $scope.model.selectWeekday = null;
    $scope.model.selectCourseList.splice(0, $scope.model.selectCourseList.length);
    $('input[name="weekday"]').prop('checked',false);
    $('input[name="courseTime"]').prop('checked',false);
    $('#kt_modal_1').modal('show');
  };

  $scope.onCancelSchedule = function(index) {
    $scope.model.courseScheduleList.splice(index, 1);
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

  $scope.onSaveCourseSchedule = function() {
    bootbox.confirm({
      message: `您确认要修改课程表吗？`,
      buttons: {
        confirm: {
          label: '确认',
          className: 'btn-primary'
        },
        cancel: {
          label: '取消',
          className: 'btn-secondary'
        }
      },
      callback: function (result) {
        if(result) {
          let btn = $('#btnSaveCourseSchedule');
          $(btn).attr('disabled',true);
          KTApp.progress(btn);

          let courseScheduleEntityList = [];
          $scope.model.courseScheduleList.forEach(function (courseSchedule) {
            courseSchedule.schedule.forEach(function (classSchedule) {
              courseScheduleEntityList.push({
                weekday: courseSchedule.weekday.day,
                weekdayClass: classSchedule.order,
                weekdayClassTime: classSchedule.time
              })
            });
          });

          $http.put('/course/detail/courseSchedule', {
            courseID: $scope.model.courseInfo.courseID,
            universityCode: $scope.model.courseInfo.universityCode,
            schoolID: $scope.model.courseInfo.schoolID,
            courseScheduleJson: JSON.stringify(courseScheduleEntityList),
            loginUser: $scope.model.loginUser.customerID
          }).then(function successCallback(response) {
            if(response.data.err) {
              bizLogger.logInfo('courseDetail', 'change course schedule failed', `customer: ${$scope.model.loginUser.customerID}`);
              KTApp.unprogress(btn);
              bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
              return false;
            }
            layer.msg(localMessage.SAVE_SUCCESS);
            KTApp.unprogress(btn);
            $(btn).removeAttr('disabled');
            bizLogger.logInfo('courseDetail', 'change course schedule success', `customer: ${$scope.model.loginUser.customerID}`);
          }, function errorCallback(response) {
            bootbox.alert(localMessage.NETWORK_ERROR);
          });
        }
      }
    });
  };
  //endregion

  //region 授课计划
  $scope.loadCoursePlan = function(){
    let courseKnowledgeIDArray = [];
    let courseKnowledgeNameArray = [];

    $scope.model.courseInfo.coursePlanList.forEach(function (plan) {
      if($scope.model.coursePlanList.length === 0) {
        courseKnowledgeIDArray.push(plan.knowledgeID);
        courseKnowledgeNameArray.push(plan.knowledgeName);
        $scope.model.coursePlanList.push({
          technologyID: $scope.model.courseInfo.technologyID,
          technologyName: $scope.model.courseInfo.technologyName,
          technologyThumbnail: $scope.model.courseInfo.technologyThumbnail,
          courseOrder: plan.courseClass,
          learningPhaseID: plan.learningPhaseID,
          learningPhaseName: plan.learningPhaseName,
          knowledgeIDArray: courseKnowledgeIDArray,
          knowledgeNameArray: courseKnowledgeNameArray,
          dataStatus: plan.dataStatus,
          dataStatusText: plan.dataStatusText
        });
      }else {
        let currentCourseClass = plan.courseClass;
        let isExistCurrentCourseClass = false;
        let isExistCurrentCourseClassIndex = -1;
        $scope.model.coursePlanList.forEach(function (p,i) {
          if(p.courseOrder === currentCourseClass){
            isExistCurrentCourseClass = true;
            isExistCurrentCourseClassIndex = i;
          }
        });

        if(isExistCurrentCourseClass){
          courseKnowledgeIDArray.push(plan.knowledgeID);
          courseKnowledgeNameArray.push(plan.knowledgeName);
          $scope.model.coursePlanList[isExistCurrentCourseClassIndex].knowledgeIDArray = courseKnowledgeIDArray;
          $scope.model.coursePlanList[isExistCurrentCourseClassIndex].knowledgeNameArray = courseKnowledgeNameArray;
        }else{
          courseKnowledgeIDArray = [];
          courseKnowledgeNameArray = [];
          courseKnowledgeIDArray.push(plan.knowledgeID);
          courseKnowledgeNameArray.push(plan.knowledgeName);
          $scope.model.coursePlanList.push({
            technologyID: $scope.model.courseInfo.technologyID,
            technologyName: $scope.model.courseInfo.technologyName,
            technologyThumbnail: $scope.model.courseInfo.technologyThumbnail,
            courseOrder: plan.courseClass,
            learningPhaseID: plan.learningPhaseID,
            learningPhaseName: plan.learningPhaseName,
            knowledgeIDArray: courseKnowledgeIDArray,
            knowledgeNameArray: courseKnowledgeNameArray,
            dataStatus: plan.dataStatus,
            dataStatusText: plan.dataStatusText
          });
        }
      }
    });
    $scope.model.noFinishClassCount = $scope.model.coursePlanList.filter((obj) => {return obj.dataStatus !== 'F'}).length;
  };

  $scope.onShowCoursePlanModal = function(){
    if($scope.model.isClickAdd){
      $scope.model.courseOrder++;
    }
    $('input[name="technologyKnowledge"]').prop('checked',false);
    $scope.model.courseKnowledgeList.splice(0, $scope.model.courseKnowledgeList.length);
    $('#kt_modal_2').modal('show');
  };

  $scope.loadLearningPhase = function () {
    $http.get(`/course/learningPhase?technologyID=${$scope.model.courseInfo.technologyID}`).then(function successCallback (response) {
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
    $http.get(`/course/knowledgeList?technologyID=${$scope.model.courseInfo.technologyID}&learningPhaseID=${$scope.model.selectedLearningPhase.learningPhaseID}`)
        .then(function successCallback (response) {
          if(response.data.err){
            bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
            return false;
          }
          $scope.model.knowledgeList.splice(0, $scope.model.knowledgeList.length);
          response.data.knowledgeList.forEach(function (knowledge) {
            $scope.model.knowledgeList.push({
              technologyID: $scope.model.courseInfo.technologyID,
              technologyName: $scope.model.courseInfo.technologyName,
              technologyThumbnail: $scope.model.courseInfo.technologyThumbnail,
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
    $scope.model.isClickAdd = true;

    let courseKnowledgeIDArray = $scope.model.courseKnowledgeList.map(obj => {return obj.knowledgeID});
    let courseKnowledgeNameArray = $scope.model.courseKnowledgeList.map(obj => {return obj.knowledgeName});

    let index = -1;
    let dataStatus = '';
    let courseOrder = 0;
    for(let i = 0; i < $scope.model.coursePlanList.length; i++){
      if($scope.model.coursePlanList[i].courseOrder === $scope.model.courseOrder) {
        index = i;
        dataStatus = $scope.model.coursePlanList[i].dataStatus;
        courseOrder = $scope.model.coursePlanList[i].courseOrder;
        break;
      }
    }

    if(index === -1) {
      $scope.model.coursePlanList.push({
        technologyID: $scope.model.courseInfo.technologyID,
        technologyName: $scope.model.courseInfo.technologyName,
        technologyThumbnail: $scope.model.courseInfo.technologyThumbnail,
        courseOrder: $scope.model.courseOrder,
        learningPhaseID: $scope.model.selectedLearningPhase.learningPhaseID,
        learningPhaseName: $scope.model.selectedLearningPhase.learningPhaseName,
        knowledgeIDArray: courseKnowledgeIDArray,
        knowledgeName: courseKnowledgeNameArray.join(' | '),
        dataStatus: ''
      });
      $scope.model.noFinishClassCount = $scope.model.coursePlanList.filter((obj) => {return obj.dataStatus !== 'F'}).length;
      $('#kt_modal_2').modal('hide');
      return false;
    }

    if(index >= 0 && dataStatus === 'F'){

      $('#kt_modal_2').modal('hide');
      bootbox.alert(`第${courseOrder}节课已经授课完成，不能修改课程内容。`);
      return false;
    }

    bootbox.confirm({
      message: `第${$scope.model.courseOrder}节课的内容已存在，您确认要修改原计划的内容吗？`,
      buttons: {
        confirm: {
          label: '确认',
          className: 'btn-primary'
        },
        cancel: {
          label: '取消',
          className: 'btn-secondary'
        }
      },
      callback: function (result) {
        if(result) {
          $scope.model.coursePlanList[index].knowledgeIDArray = courseKnowledgeIDArray;
          $scope.model.coursePlanList[index].knowledgeName = courseKnowledgeNameArray.join(' | ');
          $scope.$apply();
          $('#kt_modal_2').modal('hide');
        }
      }
    });
  };

  $scope.onCancelPlan = function(index) {
    $scope.model.coursePlanList.splice(index, 1);
  };

  $scope.onSaveCoursePlan = function() {
    bootbox.confirm({
      message: `您确认要修改课程授课计划吗？`,
      buttons: {
        confirm: {
          label: '确认',
          className: 'btn-primary'
        },
        cancel: {
          label: '取消',
          className: 'btn-secondary'
        }
      },
      callback: function (result) {
        if(result) {
          let btn = $('#btnSaveCoursePlan');
          $(btn).attr('disabled',true);
          KTApp.progress(btn);

          let coursePlanEntityList = [];
          $scope.model.coursePlanList.forEach(function (coursePlan) {
            coursePlan.knowledgeIDArray.forEach(function (knowledgeID) {
              coursePlanEntityList.push({
                courseClass: coursePlan.courseOrder,
                technologyID: $scope.model.courseInfo.technologyID,
                learningPhaseID: coursePlan.learningPhaseID,
                knowledgeID: knowledgeID,
                dataStatus: coursePlan.dataStatus
              })
            })
          });

          $http.put('/course/detail/coursePlan', {
            courseID: $scope.model.courseInfo.courseID,
            universityCode: $scope.model.courseInfo.universityCode,
            schoolID: $scope.model.courseInfo.schoolID,
            coursePlanJson: JSON.stringify(coursePlanEntityList),
            loginUser: $scope.model.loginUser.customerID
          }).then(function successCallback(response) {
            if(response.data.err) {
              bizLogger.logInfo('courseDetail', 'change course plan failed', `customer: ${$scope.model.loginUser.customerID}`);
              $scope.model.isClickAdd = false;
              KTApp.unprogress(btn);
              bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
              return false;
            }
            $scope.model.coursePlanList.forEach(function (coursePlan) {
              if(coursePlan.dataStatus === ''){
                coursePlan.dataStatus = 'P';
                coursePlan.dataStatusText = '未开始';
              }
            });
            $scope.model.isClickAdd = true;
            layer.msg(localMessage.SAVE_SUCCESS);
            KTApp.unprogress(btn);
            $(btn).removeAttr('disabled');
            bizLogger.logInfo('courseDetail', 'change course plan success', `customer: ${$scope.model.loginUser.customerID}`);
          }, function errorCallback(response) {
            bootbox.alert(localMessage.NETWORK_ERROR);
          });
        }
      }
    });
  };

  //endregion

  //region 编程练习
  $scope.loadCourseExercises = function(){
    let knowledgeArray = [];
    let exercisesArray = [];
    let exercisesDocumentArray = [];

    $http.get(`/course/detail/exercises?universityCode=${$scope.model.universityCode}&schoolID=${$scope.model.schoolID}&courseID=${$scope.model.courseID}`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if(response.data.totalCount === 0){
        return false;
      }
      response.data.exercisesList.forEach(function (exercises) {
        if(exercises.documentList.length > 0){
          $scope.model.courseExercisesList.push({
            courseClass: exercises.courseClass,
            exercisesName: exercises.exercisesName,
            knowledgeID: exercises.knowledgeID,
            knowledgeName: exercises.knowledgeName,
            documentList: exercises.documentList
          });
        }

        if($scope.model.exercisesList.length === 0) {
          knowledgeArray.push({knowledgeID: exercises.knowledgeID, knowledgeName: exercises.knowledgeName});
          if(exercises.exercisesID !== 0){
            exercisesArray.push({exercisesID: exercises.exercisesID, exercisesName: exercises.exercisesName,});
          }

          if(exercises.documentList.length > 0){
            exercises.documentList.forEach(function (document) {
              exercisesDocumentArray.push(document);
            });
          }

          $scope.model.exercisesList.push({
            courseClass: exercises.courseClass,
            technologyID: exercises.technologyID,
            technologyName: exercises.technologyName,
            exercisesID: exercises.exercisesID,
            exercisesName: exercises.exercisesName,
            knowledgeArray: knowledgeArray,
            exercisesArray: exercisesArray,
            documentList: exercisesDocumentArray,
            dataStatus: exercises.dataStatus
          });
        }else {
          let currentCourseClass = exercises.courseClass;
          let isExistCurrentCourseClass = false;
          let isExistCurrentCourseClassIndex = -1;
          $scope.model.exercisesList.forEach(function (e,i) {
            if(e.courseClass === currentCourseClass){
              isExistCurrentCourseClass = true;
              isExistCurrentCourseClassIndex = i;
            }
          });

          if(isExistCurrentCourseClass){
            knowledgeArray.push({knowledgeID: exercises.knowledgeID, knowledgeName: exercises.knowledgeName});

            if(exercises.exercisesID !== 0){
              exercisesArray.push({exercisesID: exercises.exercisesID, exercisesName: exercises.exercisesName,});
            }

            if(exercises.documentList.length > 0){
              exercises.documentList.forEach(function (document) {
                exercisesDocumentArray.push(document);
              });
            }

            $scope.model.exercisesList[isExistCurrentCourseClassIndex].knowledgeArray = knowledgeArray;
            $scope.model.exercisesList[isExistCurrentCourseClassIndex].exercisesArray = exercisesArray;
            $scope.model.exercisesList[isExistCurrentCourseClassIndex].documentList = exercisesDocumentArray;
          }else{
            knowledgeArray = [];
            exercisesArray = [];
            exercisesDocumentArray = [];
            knowledgeArray.push({knowledgeID: exercises.knowledgeID, knowledgeName: exercises.knowledgeName});
            if(exercises.exercisesID !== 0){
              exercisesArray.push({exercisesID: exercises.exercisesID, exercisesName: exercises.exercisesName,});
            }

            if(exercises.documentList.length > 0){
              exercises.documentList.forEach(function (document) {
                exercisesDocumentArray.push(document);
              });
            }
            $scope.model.exercisesList.push({
              courseClass: exercises.courseClass,
              technologyID: exercises.technologyID,
              technologyName: exercises.technologyName,
              exercisesID: exercises.exercisesID,
              exercisesName: exercises.exercisesName,
              knowledgeArray: knowledgeArray,
              exercisesArray: exercisesArray,
              documentList: exercisesDocumentArray,
              dataStatus: exercises.dataStatus
            });
          }
        }
      });
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onShowExercisesModal = function(courseClass) {
    $scope.model.exercisesCourseClass = courseClass;
    $scope.model.courseExercisesFilterList = $scope.model.courseExercisesList.filter((obj) => {return obj.courseClass === courseClass});
    $('#kt_modal_3').modal('show');
  };

  $scope.onFinishClass = function(exercises, flag) {
    let message = `您确认第${exercises.courseClass}节课已结束？`;
    bootbox.confirm({
      message: message,
      buttons: {
        confirm: {
          label: '确认',
          className: 'btn-primary'
        },
        cancel: {
          label: '取消',
          className: 'btn-secondary'
        }
      },
      callback: function (result) {
        if(result) {
          $http.put('/course/detail/finishClass', {
            universityCode: $scope.model.courseInfo.universityCode,
            schoolID: $scope.model.courseInfo.schoolID,
            courseID: $scope.model.courseInfo.courseID,
            courseClass: exercises.courseClass,
            loginUser: $scope.model.loginUser.customerID
          }).then(function successCallback(response) {
            if(response.data.err) {
              bizLogger.logInfo('courseDetail', 'change course info failed', `customer: ${$scope.model.loginUser.customerID}`);
              bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
              return false;
            }

            for (let i = 0; i < $scope.model.coursePlanList.length ; i++) {
              if($scope.model.coursePlanList[i].courseOrder === exercises.courseClass){
                $scope.model.coursePlanList[i].dataStatus = 'F';
                $scope.model.coursePlanList[i].dataStatusText = '已结束';
                break;
              }
            }

            for (let i = 0; i < $scope.model.exercisesList.length ; i++) {
              if($scope.model.exercisesList[i].courseClass === exercises.courseClass){
                $scope.model.exercisesList[i].dataStatus = 'F';
                break;
              }
            }

            $scope.model.noFinishClassCount = $scope.model.coursePlanList.filter((obj) => {return obj.dataStatus !== 'F'}).length;
            bizLogger.logInfo('courseDetail', 'finish course class success', `customer: ${$scope.model.loginUser.customerID}`);
          }, function errorCallback(response) {
            bootbox.alert(localMessage.NETWORK_ERROR);
          });
        }
      }
    });
  };

  $scope.onAssignExercises = function(exercises) {
    let message = `您确认第${exercises.courseClass}节课已结束并下发练习吗？`;
    bootbox.confirm({
      message: message,
      buttons: {
        confirm: {
          label: '确认',
          className: 'btn-primary'
        },
        cancel: {
          label: '取消',
          className: 'btn-secondary'
        }
      },
      callback: function (result) {
        if(result) {
          let btn = $(`#btnAssignExercises${exercises.courseClass}`);
          $(btn).attr('disabled',true);
          KTApp.progress(btn);

          $http.post('/course/detail/classExercises', {
            universityCode: $scope.model.courseInfo.universityCode,
            schoolID: $scope.model.courseInfo.schoolID,
            courseID: $scope.model.courseInfo.courseID,
            courseClass: exercises.courseClass,
            assignCount: 3,
            loginUser: $scope.model.loginUser.customerID
          }).then(function successCallback(response) {
            if(response.data.err) {
              bizLogger.logInfo('courseDetail', 'assign course exercises failed', `customer: ${$scope.model.loginUser.customerID}`);
              KTApp.unprogress(btn);
              $(btn).removeAttr('disabled');
              bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
              return false;
            }

            for (let i = 0; i < $scope.model.coursePlanList.length ; i++) {
              if($scope.model.coursePlanList[i].courseOrder === exercises.courseClass){
                $scope.model.coursePlanList[i].dataStatus = 'F';
                $scope.model.coursePlanList[i].dataStatusText = '已结束';
                break;
              }
            }

            for (let i = 0; i < $scope.model.exercisesList.length ; i++) {
              if($scope.model.exercisesList[i].courseClass === exercises.courseClass){
                $scope.model.exercisesList[i].dataStatus = 'F';
                break;
              }
            }

            KTApp.unprogress(btn);
            $(btn).removeAttr('disabled');
            $scope.model.noFinishClassCount = $scope.model.coursePlanList.filter((obj) => {return obj.dataStatus !== 'F'}).length;
            bizLogger.logInfo('courseDetail', 'assign course exercises success', `customer: ${$scope.model.loginUser.customerID}`);
          }, function errorCallback(response) {
            bootbox.alert(localMessage.NETWORK_ERROR);
          });
        }
      }
    });
  };
  //endregion

  //region 报名学生
  $scope.loadCourseStudent = function(){
    $http.get(`/course/detail/courseSignUp?pageNumber=${$scope.model.pageNumber4SignUp}&universityCode=${$scope.model.universityCode}&schoolID=${$scope.model.schoolID}&courseID=${$scope.model.courseID}`)
        .then(function successCallback (response) {
          if(response.data.err){
            bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
            return false;
          }
          if(response.data.dataContent === null){
            return false;
          }
          if(response.data.dataContent.dataList !== null && response.data.dataContent.dataList.length === 0 && $scope.model.pageNumber4SignUp > 1){
            $scope.model.pageNumber4SignUp--;
            $scope.loadCourseStudent();
            return false;
          }
          $scope.model.totalCount4SignUp = response.data.dataContent.totalCount;
          $scope.model.dataList4SignUp = response.data.dataContent.dataList;
          $scope.model.pageNumber4SignUp = response.data.dataContent.currentPageNum;
          $scope.model.maxPageNumber4SignUp = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);
          $scope.model.paginationArray4SignUp = response.data.dataContent.paginationArray;
          $scope.model.prePageNum4SignUp = response.data.dataContent.prePageNum === undefined ? -1 : response.data.dataContent.prePageNum;
          $scope.model.nextPageNum4SignUp = response.data.dataContent.nextPageNum === undefined ? -1 : response.data.dataContent.nextPageNum;
          $scope.model.fromIndex4SignUp = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber4SignUp - 1) * Constants.PAGE_SIZE + 1;
          $scope.model.toIndex4SignUp = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber4SignUp - 1) * Constants.PAGE_SIZE + $scope.model.dataList4SignUp.length;
        }, function errorCallback(response) {
          bootbox.alert(localMessage.NETWORK_ERROR);
        });
  };

  $scope.onFirstPage4SignUp = function() {
    $scope.model.pageNumber4SignUp = 1;
    $scope.loadCourseStudent();
  };

  $scope.onPrePage4SignUp = function(){
    if($scope.model.pageNumber4SignUp === 1){
      return false;
    }
    $scope.model.pageNumber4SignUp--;
    $scope.loadCourseStudent();
  };

  $scope.onPagination4SignUp = function(pageNumber){
    if($scope.model.pageNumber4SignUp === pageNumber){
      return false;
    }
    $scope.model.pageNumber4SignUp = pageNumber;
    $scope.loadCourseStudent();
  };

  $scope.onNextPage4SignUp = function(){
    if($scope.model.pageNumber4SignUp === $scope.model.maxPageNumber4SignUp){
      return false;
    }
    $scope.model.pageNumber4SignUp++;
    $scope.loadCourseStudent();
  };

  $scope.onLastPage4SignUp = function() {
    $scope.model.pageNumber4SignUp = $scope.model.maxPageNumber4SignUp;
    $scope.loadCourseStudent();
  };
  //endregion

  //region 批改练习
  $scope.loadCourseStudentExercises = function(){
    $http.get(`/course/detail/courseStudentExercises?pageNumber=${$scope.model.pageNumber4Exercises}&universityCode=${$scope.model.universityCode}&schoolID=${$scope.model.schoolID}&courseID=${$scope.model.courseID}&dataStatus=${$scope.model.filterStatus}`)
        .then(function successCallback (response) {
          if(response.data.err){
            bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
            return false;
          }
          if(response.data.dataContent === null){
            return false;
          }
          if(response.data.dataContent.dataList !== null && response.data.dataContent.dataList.length === 0 && $scope.model.pageNumber4Exercises > 1){
            $scope.model.pageNumber4Exercises--;
            $scope.loadCourseStudent();
            return false;
          }
          $scope.model.totalCount4Exercises = response.data.dataContent.totalCount;
          $scope.model.dataList4Exercises = response.data.dataContent.dataList;
          $scope.model.pageNumber4Exercises = response.data.dataContent.currentPageNum;
          $scope.model.maxPageNumber4Exercises = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);
          $scope.model.paginationArray4Exercises = response.data.dataContent.paginationArray;
          $scope.model.prePageNum4Exercises = response.data.dataContent.prePageNum === undefined ? -1 : response.data.dataContent.prePageNum;
          $scope.model.nextPageNum4Exercises = response.data.dataContent.nextPageNum === undefined ? -1 : response.data.dataContent.nextPageNum;
          $scope.model.fromIndex4Exercises = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber4Exercises - 1) * Constants.PAGE_SIZE + 1;
          $scope.model.toIndex4Exercises = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber4Exercises - 1) * Constants.PAGE_SIZE + $scope.model.dataList4Exercises.length;
        }, function errorCallback(response) {
          bootbox.alert(localMessage.NETWORK_ERROR);
        });
  };

  $scope.onFirstPage4Exercises = function() {
    $scope.model.pageNumber4Exercises = 1;
    $scope.loadCourseStudentExercises();
  };

  $scope.onPrePage4Exercises = function(){
    if($scope.model.pageNumber4Exercises === 1){
      return false;
    }
    $scope.model.pageNumber4Exercises--;
    $scope.loadCourseStudentExercises();
  };

  $scope.onPagination4Exercises = function(pageNumber){
    if($scope.model.pageNumber4Exercises === pageNumber){
      return false;
    }
    $scope.model.pageNumber4Exercises = pageNumber;
    $scope.loadCourseStudentExercises();
  };

  $scope.onNextPage4Exercises = function(){
    if($scope.model.pageNumber4Exercises === $scope.model.maxPageNumber4Exercises){
      return false;
    }
    $scope.model.pageNumber4Exercises++;
    $scope.loadCourseStudentExercises();
  };

  $scope.onLastPage4Exercises = function() {
    $scope.model.pageNumber4Exercises = $scope.model.maxPageNumber4Exercises;
    $scope.loadCourseStudentExercises();
  };

  $scope.onFilterCourseStudentExercises = function(filterStatus) {
    $scope.model.filterStatus = filterStatus;
    $scope.loadCourseStudentExercises();
  };
  //endregion
  $scope.loadCourseQuestion = function(){

  };



  $scope.initPage();
});