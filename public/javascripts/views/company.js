let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    companyList: [],

    companyModalTitle: '',
    technologyList: []
  };

  $scope.initPage = function() {
    $scope.setMenuActive();
    $scope.loadCompany();
  };

  $scope.setMenuActive = function () {
    $('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
    $('ul.kt-menu__nav li:nth-child(6)').addClass('kt-menu__item--here');
  };

  $scope.loadCompany = function(){
    $http.get(`/company/list?pageNumber=${$scope.model.pageNumber}`)
        .then(function successCallback (response) {
          if(response.data.err){
            bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
            return false;
          }
          if(response.data.dataList === null) {
            return false;
          }

          $scope.model.totalCount = response.data.dataContent.totalCount;
          $scope.model.pageNumber = parseInt(response.data.dataContent.currentPageNum);
          $scope.model.maxPageNumber = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);
          response.data.dataContent.dataList.forEach((data) => {
            $scope.model.companyList.push(data);
          });
        }, function errorCallback(response) {
          bootbox.alert(localMessage.NETWORK_ERROR);
        });
  };

  $scope.onLoadMore = function(){
    $scope.model.pageNumber++;
    $scope.loadCompany();
  };

  $scope.onShowDetail = function (company) {
    $scope.model.companyModalTitle = company.companyAbbreviation;
    $http.get(`/company/technology/using?companyID=${company.companyID}`)
        .then(function successCallback (response) {
          if(response.data.err){
            bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
            return false;
          }
          if(response.data.dataList === null) {
            return false;
          }
          $scope.model.technologyList = response.data.dataList
          $('#modal_using_technology').modal('show');
        }, function errorCallback(response) {
          bootbox.alert(localMessage.NETWORK_ERROR);
        });
  };

  $scope.initPage();

});
angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);