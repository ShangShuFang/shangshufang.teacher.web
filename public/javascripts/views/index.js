let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    logPageName: 'index',
    logOperation: '',
    logMemo: '',
    pageNumber: 1,
    technologyTotalCount: 0,
    technologyList: [],
    courseProcessingTotalCount: 0,
    courseProcessingList: [],
    isLogin: false,
    loginUser: null
  };

  $scope.initPage = function () {
    $scope.model.isLogin = commonUtility.isLogin();
    $scope.model.loginUser = commonUtility.getLoginUser();
    if($scope.model.isLogin){
      bizLogger.logInfo('index', 'load page', `customer: ${$scope.model.loginUser.customerID}`);
    }else{
      bizLogger.logInfo('index', 'load page', `customer: guest`);
    }

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
    let courseTimeBegin = dateUtils.addDateYear(currentDateString, -1) + ' 00:00:00';
    let dataStatus = 'A';
    $http.get(`/course/list?pageNumber=${$scope.model.pageNumber}&pageSize=99&universityCode=${universityCode}&schoolID=${schoolID}&teacherID=${teacherID}&technologyID=0&courseTimeBegin=${courseTimeBegin}&dataStatus=${dataStatus}&isSelf=true`).then(function successCallback (response) {
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

  $scope.onCreateCourse = function(technologyID) {
    bizLogger.logInfo('index', 'add course', `technologyID: ${technologyID}`);
    if(technologyID !== undefined){
      localStorage.setItem(Constants.KEY_NEW_COURSE_TECHNOLOGY, technologyID);
    }
    if(!commonUtility.isLogin()){
      location.href = '/login?backUrl=/course';
    }else{
      location.href = '/course';
    }
  };

  $scope.onOpenCourseDetail = function(course, option) {
    let courseParam = JSON.stringify({
      universityCode: course.universityCode,
      schoolID: course.schoolID,
      courseID: course.courseID
    });
    bizLogger.logInfo('index', 'open course detail', `option: ${option}, courseParam: ${courseParam}`);
    localStorage.setItem(Constants.KEY_INFO_COURSE_IDENTIFY, courseParam);
    window.open('/course/detail');
  };

  $scope.onOpenTechnologyInfo = function(technologyID) {
    window.open(`/technology?technology=${technologyID}`);
  };

  $scope.initPage();
});