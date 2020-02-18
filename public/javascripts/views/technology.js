let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    technologyID: 0,
    technologyInfo: null,
    knowledgePageNumber: 1,
    knowledgeTotalCount: 0,
    knowledgeList: [],
    knowledgeList1: [],
    knowledgeList2: [],
    directionTotalCount: 0,
    directionList: [],
    isShowLoadCompleteMessage: false,

    courseProcessingTotalCount: 0,

    courseProcessing4UniversityPageNumber: 1,
    courseProcessing4UniversityTotalCount: 0,
    courseProcessing4UniversityList: [],

    courseProcessing4OtherUniversityPageNumber: 1,
    courseProcessing4OtherUniversityTotalCount: 0,
    courseProcessing4OtherUniversityList: [],

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

    isLogin: false,
    loginUser: null
  };

  $scope.initPage = function () {
    $scope.setParameter();
    $scope.loadTechnologyInfo();
    $scope.loadKnowledgeList();
    $scope.loadDevelopmentDirectionList();
    $scope.loadCourseOfUniversityList();
    $scope.loadCourseOfOtherUniversityList();
    $scope.loadCourseStudent();
  };

  $scope.setParameter = function () {
    $scope.model.isLogin = commonUtility.isLogin();
    $scope.model.loginUser = commonUtility.getLoginUser();
    $scope.model.technologyID = $('#hidden_technologyID').val();
    if($scope.model.isLogin){
      bizLogger.logInfo('technology', 'load page', `customer: ${$scope.model.loginUser.customerID}`);
    }else{
      bizLogger.logInfo('technology', 'load page', `customer: guest`);
    }
    if(commonUtility.isEmpty($scope.model.technologyID) || Number.isNaN($scope.model.technologyID)){
      bizLogger.logInfo('technology', 'load page', `parameter error:  technologyID: ${$scope.model.technologyID}`);
      bootbox.alert(localMessage.NO_TECHNOLOGY_INFO);
      return false;
    }
  };

  $scope.loadTechnologyInfo = function () {
    $http.get(`/technology/technologyInfo?technologyID=${$scope.model.technologyID}`)
      .then(function successCallback (response) {
        if(response.data.err){
          bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
          return false;
        }
        if(response.data.technologyInfo === null){
          bootbox.alert(localMessage.NO_TECHNOLOGY_INFO);
          return false;
        }
        $scope.model.technologyInfo = response.data.technologyInfo;
      }, function errorCallback(response) {
        bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.loadKnowledgeList = function () {
    $http.get(`/technology/knowledgeList?pageNumber=${$scope.model.knowledgePageNumber}&technologyID=${$scope.model.technologyID}`)
      .then(function successCallback (response) {
        if(response.data.err){
          bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
          return false;
        }
        if(response.data.knowledgeList === null || response.data.knowledgeList.length === 0) {
          return false;
        }
        $scope.model.knowledgeTotalCount = response.data.totalCount;

        response.data.knowledgeList.forEach(function (knowledge) {
          $scope.model.knowledgeList.push(knowledge);
        });

        if($scope.model.knowledgeList.length === 1){
          $scope.model.knowledgeList1 = $scope.model.knowledgeList;
          return false;
        }
        if($scope.model.knowledgeList.length >= 2){
          let toIndex = Math.ceil($scope.model.knowledgeList.length / 2);
          let startIndex = Math.ceil($scope.model.knowledgeList.length / 2);
          $scope.model.knowledgeList1 = $scope.model.knowledgeList.slice(0, toIndex);
          $scope.model.knowledgeList2 = $scope.model.knowledgeList.slice(startIndex, $scope.model.knowledgeList.length);
        }
        if($scope.model.isShowLoadCompleteMessage && $scope.model.knowledgeList.length === $scope.model.knowledgeTotalCount){
          layer.msg(localMessage.LOADED_ALL_KNOWLEDGE);
        }
      }, function errorCallback(response) {
        bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.loadDevelopmentDirectionList = function () {
    $http.get(`/technology/developmentDirections?technologyID=${$scope.model.technologyID}`)
      .then(function successCallback (response) {
        if(response.data.err){
          bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
          return false;
        }
        if(response.data.directionList === null || response.data.directionList.length === 0) {
          return false;
        }
        $scope.model.directionTotalCount = response.data.directionList.length;
        $scope.model.directionList = response.data.directionList;
      }, function errorCallback(response) {
        bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.loadCourseOfUniversityList = function () {
    if(!$scope.model.isLogin){
      return false;
    }
    let currentDateString = dateUtils.getCurrentDate();
    let universityCode = $scope.model.loginUser.universityCode;
    let courseTimeBegin = dateUtils.addDateYear(currentDateString, -1) + ' 00:00:00';
    let dataStatus = 'A';
    $http.get(`/course/list?pageNumber=${$scope.model.courseProcessing4UniversityPageNumber}&pageSize=6&universityCode=${universityCode}&schoolID=0&teacherID=0&technologyID=${$scope.model.technologyID}&courseTimeBegin=${courseTimeBegin}&dataStatus=${dataStatus}&isSelf=true`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }

      if(response.data.dataContent.dataList === null || response.data.dataContent.dataList.length === 0){
        if($scope.model.courseProcessing4UniversityPageNumber > 1){
          $scope.model.courseProcessing4UniversityPageNumber--;
          layer.msg(localMessage.NO_TECHNOLOGY_DATA);
        }
        return false;
      }

      response.data.dataContent.dataList.forEach(function (data) {
        $scope.model.courseProcessing4UniversityList.push(data);
      });
      //$scope.model.courseProcessing4UniversityList = response.data.dataContent.dataList;
      $scope.model.courseProcessing4UniversityTotalCount = response.data.dataContent.totalCount;
      $scope.model.courseProcessing4UniversityPageNumber = response.data.dataContent.currentPageNum;
      $scope.model.courseProcessingTotalCount = $scope.model.courseProcessing4UniversityTotalCount + $scope.model.courseProcessing4OtherUniversityTotalCount;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.loadCourseOfOtherUniversityList = function () {
    if(!$scope.model.isLogin){
      return false;
    }
    let currentDateString = dateUtils.getCurrentDate();
    let universityCode = $scope.model.loginUser.universityCode;
    let courseTimeBegin = dateUtils.addDateYear(currentDateString, -1) + ' 00:00:00';
    let dataStatus = 'A';
    $http.get(`/course/list?pageNumber=${$scope.model.courseProcessing4OtherUniversityPageNumber}&pageSize=6&universityCode=${universityCode}&schoolID=0&teacherID=0&technologyID=${$scope.model.technologyID}&courseTimeBegin=${courseTimeBegin}&dataStatus=${dataStatus}&isSelf=false`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }

      if(response.data.dataContent.dataList === null || response.data.dataContent.dataList.length === 0){
        if($scope.model.courseProcessing4OtherUniversityPageNumber > 1){
          $scope.model.courseProcessing4OtherUniversityPageNumber--;
          layer.msg(localMessage.NO_TECHNOLOGY_DATA);
        }
        return false;
      }

      response.data.dataContent.dataList.forEach(function (data) {
        $scope.model.courseProcessing4OtherUniversityList.push(data);
      });

      //$scope.model.courseProcessing4OtherUniversityList = response.data.dataContent.dataList;
      $scope.model.courseProcessing4OtherUniversityTotalCount = response.data.dataContent.totalCount;
      $scope.model.courseProcessing4OtherUniversityPageNumber = response.data.dataContent.currentPageNum;
      $scope.model.courseProcessingTotalCount = $scope.model.courseProcessing4UniversityTotalCount + $scope.model.courseProcessing4OtherUniversityTotalCount;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  //region 报名学生
  $scope.loadCourseStudent = function(){
    $http.get(`/technology/courseSignUp?pageNumber=${$scope.model.pageNumber4SignUp}&technologyID=${$scope.model.technologyID}`)
      .then(function successCallback (response) {
        if(response.data.err){
          bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
          return false;
        }
        if(response.data.dataContent === null){
          return false;
        }
        if(response.data.dataContent.dataList !== null && response.data.dataContent.dataList.length === 0 && $scope.model.pageNumber > 1){
          $scope.model.pageNumber--;
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

  $scope.onLoadMoreKnowledge = function() {
    $scope.model.knowledgePageNumber++;
    $scope.model.isShowLoadCompleteMessage = true;
    $scope.loadKnowledgeList();
  };

  $scope.onCreateCourse = function(){
    if($scope.model.technologyID !== 0){
      localStorage.setItem(Constants.KEY_NEW_COURSE_TECHNOLOGY, $scope.model.technologyID);
    }
    bizLogger.logInfo('technology', 'create course', `technologyID = ${$scope.model.technologyID}`);
    location.href = '/course';
  };

  $scope.onLoadMoreCourseSelfUniversity = function() {
    $scope.model.courseProcessing4UniversityPageNumber++;
    $scope.loadCourseOfUniversityList();
  };

  $scope.onLoadMoreCourseOtherUniversity = function() {
    $scope.model.courseProcessing4OtherUniversityPageNumber++;
    $scope.loadCourseOfOtherUniversityList();
  };

  $scope.onOpenCourseDetail = function(course, option) {
    let courseParam = JSON.stringify({
      universityCode: course.universityCode,
      schoolID: course.schoolID,
      courseID: course.courseID
    });
    bizLogger.logInfo('technology', 'open course detail', `option: ${option}, courseParam: ${courseParam}`);
    localStorage.setItem(Constants.KEY_INFO_COURSE_IDENTIFY, courseParam);
    window.open('/course/detail');
  };

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);