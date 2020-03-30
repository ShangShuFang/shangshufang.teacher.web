let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    abilityLevelList1: [],
    abilityLevelList2: [],
    companyList: [],
    companyModalTitle: '',
    technologyList: []
  };

  $scope.initPage = function() {
    $scope.setMenuActive();
    $scope.loadData();
  };

  $scope.setMenuActive = function () {
    $('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
    $('ul.kt-menu__nav li:nth-child(4)').addClass('kt-menu__item--here');
  };

  $scope.loadData = function(){
    $http.get(`/company/list`)
        .then(function successCallback (response) {
          if(response.data.err){
            bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
            return false;
          }
          if(response.data.dataList === null) {
            return false;
          }
          $scope.model.companyList = response.data.dataList;
        }, function errorCallback(response) {
          bootbox.alert(localMessage.NETWORK_ERROR);
        });
  };

  $scope.onShowCompanyTechnology = function (company) {
    $scope.model.companyModalTitle = company.companyName;
    $http.get(`/company/technology?companyID=${company.companyID}`)
        .then(function successCallback (response) {
          if(response.data.err){
            bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
            return false;
          }
          if(response.data.dataList === null) {
            return false;
          }
          $scope.model.technologyList = [];

          response.data.dataList.forEach(function (data) {
            $scope.model.technologyList.push({
              companyID: data.companyID,
              technologyID: data.technologyID,
              technologyName: data.technologyName,
              knowledgeList: [],
              isOpen: false
            });
          });
          $('#kt_modal_company_technology').modal('show');
        }, function errorCallback(response) {
          bootbox.alert(localMessage.NETWORK_ERROR);
        });
  };

  $scope.onTreeNodeClick = function(technology){
    let obj = $scope.model.technologyList.find((data) => {
      if(data.technologyID === technology.technologyID) {
        return data;
      }
    });

    if(obj.isOpen){
      obj.isOpen = false;
      return false;
    }

    if(obj.knowledgeList.length === 0){
      $http.get(`/company/knowledge?companyID=${technology.companyID}&technologyID=${technology.technologyID}`)
          .then(function successCallback (response) {
            if(response.data.err){
              bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
              return false;
            }
            if(response.data.dataList === null) {
              return false;
            }
            obj.knowledgeList = response.data.dataList;
            obj.isOpen = true;
          }, function errorCallback(response) {
            bootbox.alert(localMessage.NETWORK_ERROR);
          });
      return false;
    }
    obj.isOpen = true;
  };

  $scope.initPage();

});
angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);