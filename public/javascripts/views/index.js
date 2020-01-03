let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    pageNumber: 1,
    technologyTotalCount: 0,
    technologyList: []
  };

  $scope.initPage = function () {
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

  };

  $scope.onLoadMoreTechnology = function (){
    $scope.model.pageNumber++;
    $scope.loadTechnologyList();
  };

  $scope.initPage();
});