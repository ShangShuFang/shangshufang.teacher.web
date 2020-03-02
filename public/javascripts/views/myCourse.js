let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    bizLog: {
      pageName: 'myCourse',
      operationName: {
        PAGE_LOAD: 'PL',
        FILTER_COURSE_YEAR:'FCY',
        FILTER_COURSE_STATUS:'FCS',

        LOAD_MORE_COURSE:'LMC',
        COURSE_IMAGE_LINK: 'CIL',
        COURSE_TEXT_LINK: 'CTL',
        COURSE_REDIRECT_INFO: 'CRI',
        COURSE_REDIRECT_REVIEW: 'CRR',
        COURSE_CHANGE_FINISH: 'CCF',
      },
      logMemo: '',
    },
    selectedTime: {},
    timeList: [],
    selectedDataStatus: {},
    dataStatusList: [],

    pageNumber: 1,
    courseTotalCount: 0,
    courseList: [],
    isLogin: false,
    loginUser: null
  };

  $scope.initPage = function () {
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.PAGE_LOAD,
        bizLogger.OPERATION_TYPE.LOAD,
        bizLogger.OPERATION_RESULT.SUCCESS);
    $scope.model.isLogin = commonUtility.isLogin();
    $scope.model.loginUser = commonUtility.getLoginUser();
    $scope.setMenuActive();
    $scope.setDropdownList();
    $scope.loadCourseList();
  };

  $scope.setMenuActive = function () {
    $('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
    $('ul.kt-menu__nav li:nth-child(2)').addClass('kt-menu__item--here');
  };

  $scope.setDropdownList = function () {
    $scope.model.timeList.push({timeCode: -1, timeText: '近一年'});
    $scope.model.timeList.push({timeCode: -2, timeText: '近两半'});
    $scope.model.timeList.push({timeCode: -3, timeText: '近三年'});
    $scope.model.timeList.push({timeCode: 0, timeText: '全部'});

    $scope.model.dataStatusList.push({statusCode: 'NULL', statusText: '全部'});
    $scope.model.dataStatusList.push({statusCode: 'P', statusText: '未开始'});
    $scope.model.dataStatusList.push({statusCode: 'A', statusText: '进行中'});
    // $scope.model.dataStatusList.push({statusCode: 'S', statusText: '暂停'});
    $scope.model.dataStatusList.push({statusCode: 'F', statusText: '已结束'});

    $scope.model.selectedTime = $scope.model.timeList[0];
    $scope.model.selectedDataStatus = $scope.model.dataStatusList[0];
  };

  $scope.loadCourseList = function () {
    if(!$scope.model.isLogin){
      return false;
    }
    let currentDateString = dateUtils.getCurrentDate();
    let universityCode = $scope.model.loginUser.universityCode;
    let schoolID = $scope.model.loginUser.schoolID;
    let teacherID = $scope.model.loginUser.customerID;
    let courseTimeBegin = '';
    if($scope.model.selectedTime.timeCode === 0){
      courseTimeBegin = 'NULL';
    }else{
      courseTimeBegin = dateUtils.addDateYear(currentDateString, $scope.model.selectedTime.timeCode) + ' 00:00:00';
    }
    let dataStatus = $scope.model.selectedDataStatus.statusCode;
    $http.get(`/course/list?pageNumber=${$scope.model.pageNumber}&universityCode=${universityCode}&schoolID=${schoolID}&teacherID=${teacherID}&technologyID=0&courseTimeBegin=${courseTimeBegin}&dataStatus=${dataStatus}&isSelf=true`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }

      if(response.data.dataContent.dataList === null || response.data.dataContent.dataList.length === 0){
        $scope.model.courseList.splice(0,  $scope.model.courseList.length);
        $scope.model.courseTotalCount = 0;
        if($scope.model.pageNumber > 1){
          $scope.model.pageNumber--;
          layer.msg(localMessage.NO_TECHNOLOGY_DATA);
        }
        return false;
      }

      $scope.model.courseList = response.data.dataContent.dataList;
      $scope.model.courseTotalCount = response.data.dataContent.totalCount;
      $scope.model.pageNumber = response.data.dataContent.currentPageNum;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onSelectedTime = function(data) {
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.FILTER_COURSE_YEAR,
        bizLogger.OPERATION_TYPE.SEARCH,
        bizLogger.OPERATION_RESULT.SUCCESS);
    $scope.model.selectedTime = data;
    $scope.loadCourseList();
  };

  $scope.onSelectDataStatus = function(data) {
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.FILTER_COURSE_STATUS,
        bizLogger.OPERATION_TYPE.SEARCH,
        bizLogger.OPERATION_RESULT.SUCCESS);
    $scope.model.selectedDataStatus = data;
    $scope.loadCourseList();
  };

  $scope.onLoadMoreCourse = function() {
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.LOAD_MORE_COURSE,
        bizLogger.OPERATION_TYPE.SEARCH,
        bizLogger.OPERATION_RESULT.SUCCESS);
    $scope.model.pageNumber++;
    $scope.loadCourseList();
  };

  $scope.onOpenTechnologyInfo = function(technologyID){
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.COURSE_IMAGE_LINK,
        bizLogger.OPERATION_TYPE.REDIRECT,
        bizLogger.OPERATION_RESULT.SUCCESS);

    window.open(`/technology?technology=${technologyID}`);
  };

  $scope.onOpenCourseDetail = function(course, flag, tabIndex) {
    let operationName = '';
    switch (flag) {
      case 0:
        operationName = $scope.model.bizLog.operationName.COURSE_TEXT_LINK;
        break;
      case 1:
        operationName = $scope.model.bizLog.operationName.COURSE_REDIRECT_INFO;
        break;
      default:
        operationName = $scope.model.bizLog.operationName.COURSE_REDIRECT_REVIEW;
        break;
    }

    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        operationName,
        bizLogger.OPERATION_TYPE.REDIRECT,
        bizLogger.OPERATION_RESULT.SUCCESS);

    let courseParam = JSON.stringify({
      universityCode: course.universityCode,
      schoolID: course.schoolID,
      courseID: course.courseID
    });

    localStorage.setItem(Constants.KEY_INFO_COURSE_IDENTIFY, courseParam);
    if(tabIndex !== undefined){
      window.open(`/course/detail?tabIndex=${tabIndex}`);

    }
    window.open('/course/detail');
  };

  $scope.onFinishCourse = function(course) {
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.COURSE_CHANGE_FINISH,
        bizLogger.OPERATION_TYPE.UPDATE,
        bizLogger.OPERATION_RESULT.SUCCESS);
  };

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);