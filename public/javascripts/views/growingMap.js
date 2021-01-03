let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    growingList: [],
    selectedGrowing: {},
    selectedGrowingList: []
  };

  $scope.initPage = function () {
    tracking.view(trackingSetting.view.growthMap);
    commonUtility.setNavActive();
    $scope.loadGrowingList();
  };

  $scope.loadGrowingList = function () {
    $http.get(`/growing_map/list`)
    .then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if(response.data.dataList === null) {
        return false;
      }
      $scope.model.growingList = response.data.dataList;
      $scope.model.selectedGrowing = response.data.dataList.length > 0 ? response.data.dataList[0] : null;
      $scope.loadGrowingDetail();
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };
  
  $scope.loadGrowingDetail = function () {
    if (commonUtility.isEmpty($scope.model.selectedGrowing)) {
      return false;
    }
    $http.get(`/growing_map/list/detail?growingID=${$scope.model.selectedGrowing.growingID}`)
    .then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      $scope.model.selectedGrowingList = response.data.detail.growingMapDetailList;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onShowDetail = function (data) {
    $scope.model.selectedGrowing = data;
    $scope.loadGrowingDetail();
  };

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);