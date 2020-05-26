let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    bizLog: {
      pageName: 'technology',
      operationName: {
        PAGE_LOAD: 'PL',
        TECHNOLOGY_CREATE_COURSE: 'TCC',
        LOAD_MORE_KNOWLEDGE: 'LMK',
        LOAD_MORE_SELF_COURSE: 'LMS',
        LOAD_MORE_OTHER_COURSE: 'LMO',
        SELF_COURSE_REDIRECT: 'SCR',
        OTHER_COURSE_REDIRECT: 'OCR',
      },
      logMemo: '',
    },
    technologyID: 0,
    technologyInfo: null,
    knowledgePageNumber: 1,
    knowledgeTotalCount: 0,
    knowledgeList: [],
    knowledgeList1: [],
    knowledgeList2: [],
    companyTotalCount: 0,
    companyList: [],
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
    $scope.setMenuActive();
    $scope.setParameter();
    $scope.loadTechnologyInfo();
    $scope.loadCompanyList();
    $scope.loadKnowledgeList();
    $scope.loadCourseOfUniversityList();
    $scope.loadCourseOfOtherUniversityList();
    $scope.loadCourseStudent();
    // $('.carousel').carousel();
  };

  $scope.setMenuActive = function () {
    $('ul.kt-menu__nav li:nth-child(2)').addClass('kt-menu__item--here');
  };

  $scope.setParameter = function () {
    $scope.model.isLogin = commonUtility.isLogin();
    $scope.model.loginUser = commonUtility.getLoginUser();
    $scope.model.technologyID = $('#hidden_technologyID').val();
    if(commonUtility.isEmpty($scope.model.technologyID) || Number.isNaN($scope.model.technologyID)){
      $scope.model.bizLog.logMemo = `${localMessage.PARAMETER_ERROR}, technologyID: ${$scope.model.technologyID}`;
      bizLogger.logInfo(
          $scope.model.bizLog.pageName,
          $scope.model.bizLog.operationName.PAGE_LOAD,
          bizLogger.OPERATION_TYPE.LOAD,
          bizLogger.OPERATION_RESULT.FAILED,
          $scope.model.bizLog.logMemo);
      bootbox.alert(localMessage.PARAMETER_ERROR);
      return false;
    }
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.PAGE_LOAD,
        bizLogger.OPERATION_TYPE.LOAD,
        bizLogger.OPERATION_RESULT.SUCCESS);
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

  $scope.loadCompanyList = function () {
    $http.get(`/common/company?maxCount=12`)
      .then(function successCallback (response) {
        if(response.data.err){
          bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
          return false;
        }
        if(commonUtility.isEmptyList(response.data.dataList)) {
          return false;
        }
        $scope.model.companyTotalCount = response.data.totalCount;
        $scope.model.companyList = response.data.dataList;
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
    let dataStatus = '1';
    $http.get(`/course/list?pageNumber=${$scope.model.courseProcessing4UniversityPageNumber}&pageSize=6&universityCode=${universityCode}&schoolID=0&teacherID=0&directionID=0&categoryID=0&technologyID=${$scope.model.technologyID}&courseTimeBegin=${courseTimeBegin}&dataStatus=${dataStatus}&isSelf=true`).then(function successCallback (response) {
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
    let dataStatus = '1';
    $http.get(`/course/list?pageNumber=${$scope.model.courseProcessing4OtherUniversityPageNumber}&pageSize=6&universityCode=${universityCode}&schoolID=0&directionID=0&categoryID=0&teacherID=0&technologyID=${$scope.model.technologyID}&courseTimeBegin=${courseTimeBegin}&dataStatus=${dataStatus}&isSelf=false`).then(function successCallback (response) {
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
  $scope.loadCourseStudent = function () {
    $http.get(`/technology/courseSignUp?pageNumber=${$scope.model.pageNumber4SignUp}&technologyID=${$scope.model.technologyID}`)
        .then(function successCallback(response) {
          if (response.data.err) {
            bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
            return false;
          }
          if (response.data.dataContent === null) {
            return false;
          }
          if (response.data.dataContent.dataList !== null && response.data.dataContent.dataList.length === 0 && $scope.model.pageNumber > 1) {
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
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.LOAD_MORE_KNOWLEDGE,
        bizLogger.OPERATION_TYPE.LOAD,
        bizLogger.OPERATION_RESULT.SUCCESS);
  };

  $scope.onCreateCourse = function(){
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.TECHNOLOGY_CREATE_COURSE,
        bizLogger.OPERATION_TYPE.REDIRECT,
        bizLogger.OPERATION_RESULT.SUCCESS);

    const newCourseTechnology = {
      technologyID: $scope.model.technologyInfo.technologyID,
      technologyName: $scope.model.technologyInfo.technologyName,
      directionID: $scope.model.technologyInfo.directionID,
      directionName: $scope.model.technologyInfo.directionName,
      categoryID: $scope.model.technologyInfo.categoryID,
      categoryName: $scope.model.technologyInfo.categoryName
    };
    localStorage.setItem(Constants.KEY_NEW_COURSE_TECHNOLOGY, JSON.stringify(newCourseTechnology));

    location.href = '/course';
  };

  $scope.onLoadMoreCourseSelfUniversity = function() {
    $scope.model.courseProcessing4UniversityPageNumber++;
    $scope.loadCourseOfUniversityList();
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.LOAD_MORE_SELF_COURSE,
        bizLogger.OPERATION_TYPE.LOAD,
        bizLogger.OPERATION_RESULT.SUCCESS);
  };

  $scope.onLoadMoreCourseOtherUniversity = function() {
    $scope.model.courseProcessing4OtherUniversityPageNumber++;
    $scope.loadCourseOfOtherUniversityList();
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.LOAD_MORE_OTHER_COURSE,
        bizLogger.OPERATION_TYPE.LOAD,
        bizLogger.OPERATION_RESULT.SUCCESS);
  };

  $scope.onOpenCourseDetail = function(course, flag) {
    let courseParam = JSON.stringify({
      universityCode: course.universityCode,
      schoolID: course.schoolID,
      courseID: course.courseID
    });
    let operationName = flag === 0 ?
        $scope.model.bizLog.operationName.SELF_COURSE_REDIRECT :
        $scope.model.bizLog.operationName.OTHER_COURSE_REDIRECT;
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        operationName,
        bizLogger.OPERATION_TYPE.LOAD,
        bizLogger.OPERATION_RESULT.SUCCESS);
    localStorage.setItem(Constants.KEY_INFO_COURSE_IDENTIFY, courseParam);
    window.open('/course/detail');
  };

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);