let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    bizLog: {
      pageName: 'index',
      operationName: {
        PAGE_LOAD: 'PL',
        TECHNOLOGY_IMAGE_LINK:'TIL',
        TECHNOLOGY_TEXT_LINK: 'TTL',
        TECHNOLOGY_STUDENT_TOP: 'TST',
        TECHNOLOGY_CREATE_COURSE: 'TCC',
        CREATE_COURSE_LINK: 'CCL',
        COURSE_IMAGE_LINK: 'CIL',
        COURSE_TEXT_LINK: 'CTL',
        COURSE_REDIRECT_INFO: 'CRI',
        COURSE_REDIRECT_REVIEW: 'CRR',
        COURSE_CHANGE_FINISH: 'CCF',
      },
      logMemo: '',
    },
    pageNumber: 1,
    technologyTotalCount: 0,
    technologyList: [],
    courseProcessingTotalCount: 0,
    courseProcessingList: [],
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
    $scope.loadTechnologyList();
    $scope.loadCourseList();
  };

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
        $scope.model.technologyList.push(data);
      });

      $scope.model.technologyTotalCount = response.data.dataContent.totalCount;
      $scope.model.pageNumber = response.data.dataContent.currentPageNum;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.loadCourseList = function () {
    if(!$scope.model.isLogin){
      return false;
    }
    let currentDateString = dateUtils.getCurrentDate();
    let universityCode = $scope.model.loginUser.universityCode;
    let schoolID = $scope.model.loginUser.schoolID;
    let teacherID = $scope.model.loginUser.customerID;
    // let courseTimeBegin = dateUtils.addDateYear(currentDateString, -1) + ' 00:00:00';
    let courseTimeBegin = `${currentDateString} 00:00:00`;
    let dataStatus = 'A';
    $http.get(`/course/list?pageNumber=${$scope.model.pageNumber}&pageSize=99&universityCode=${universityCode}&schoolID=${schoolID}&teacherID=${teacherID}&technologyID=0&courseTimeBegin=${courseTimeBegin}&dataStatus=${dataStatus}&isSelf=true&searchType=S`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }

      if(response.data.dataContent.dataList === null || response.data.dataContent.dataList.length === 0){
        if($scope.model.pageNumber > 1){
          $scope.model.pageNumber--;
          layer.msg(localMessage.NO_TECHNOLOGY_DATA);
        }
        return false;
      }

      $scope.model.courseProcessingList = response.data.dataContent.dataList;
      $scope.model.courseProcessingTotalCount = response.data.dataContent.totalCount;
      $scope.model.pageNumber = response.data.dataContent.currentPageNum;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onLoadMoreTechnology = function (){
    $scope.model.pageNumber++;
    $scope.loadTechnologyList();
  };

  $scope.onCreateCourse = function(technologyID, optionFlag) {
    let operationName = '';
    if (optionFlag === 0) {
      operationName = $scope.model.bizLog.operationName.TECHNOLOGY_CREATE_COURSE;
    } else {
      operationName = $scope.model.bizLog.operationName.CREATE_COURSE_LINK;
    }
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        operationName,
        bizLogger.OPERATION_TYPE.REDIRECT,
        bizLogger.OPERATION_RESULT.SUCCESS);

    if(technologyID !== 0){
      localStorage.setItem(Constants.KEY_NEW_COURSE_TECHNOLOGY, technologyID);
    }
    if(!commonUtility.isLogin()){
      location.href = '/login?backUrl=/course';
    }else{
      location.href = '/course';
    }
  };

  $scope.onOpenCourseDetail = function(course, optionFlag, tabIndex) {
    let operationName = '';
    switch (optionFlag) {
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

  $scope.onOpenTechnologyInfo = function(technologyID, optionFlag) {
    let operationName = '';
    switch (optionFlag) {
      case 0:
        operationName = $scope.model.bizLog.operationName.TECHNOLOGY_IMAGE_LINK;
        break;
      case 1:
        operationName = $scope.model.bizLog.operationName.TECHNOLOGY_TEXT_LINK;
        break;
      default:
        operationName = $scope.model.bizLog.operationName.COURSE_IMAGE_LINK;
        break;
    }
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        operationName,
        bizLogger.OPERATION_TYPE.REDIRECT,
        bizLogger.OPERATION_RESULT.SUCCESS);

    window.open(`/technology?technology=${technologyID}`);
  };

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);