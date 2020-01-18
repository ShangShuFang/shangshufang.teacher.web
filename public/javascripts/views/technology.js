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
    isShowLoadCompleteMessage: false
  };

  $scope.initPage = function () {
    $scope.setParameter();
    $scope.loadTechnologyInfo();
    $scope.loadKnowledgeList();
    $scope.loadDevelopmentDirectionList();
    $scope.loadCourseOfUniversityList();
    $scope.loadCourseOfOtherUniversityList();
    $scope.loadStudentList();
  };

  $scope.setParameter = function () {
    $scope.model.technologyID = $('#hidden_technologyID').val();
    if(commonUtility.isEmpty($scope.model.technologyID) || Number.isNaN($scope.model.technologyID)){
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

  $scope.loadCourseOfUniversityList = function () {};

  $scope.loadCourseOfOtherUniversityList = function () {};

  $scope.loadStudentList = function () {};

  $scope.onLoadMoreKnowledge = function() {
    $scope.model.knowledgePageNumber++;
    $scope.model.isShowLoadCompleteMessage = true;
    $scope.loadKnowledgeList();
  };

  $scope.onCreateCourse = function(){
    if($scope.model.technologyID !== 0){
      localStorage.setItem(Constants.KEY_NEW_COURSE_TECHNOLOGY, $scope.model.technologyID);
    }
    location.href = '/course';
  };

  $scope.initPage();
});