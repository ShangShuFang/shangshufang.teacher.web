let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function($scope, $http) {
    $scope.model = {
        pageNumber: 1,
        totalCount: 0,
        maxPageNumber: 0,
        companyList: [],

        companyModalTitle: '',
        technologyList: []
    };

    $scope.initPage = function() {
      tracking.view(trackingSetting.view.jobEvaluation);
      $scope.setMenuActive();
      $scope.loadCompany();
    };

    $scope.setMenuActive = function() {
        $('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
        $('ul.kt-menu__nav li:nth-child(5)').addClass('kt-menu__item--here');
    };

    $scope.loadCompany = function() {
        $http.get(`/company/list?pageNumber=${$scope.model.pageNumber}`)
            .then(function successCallback(response) {
                if (response.data.err) {
                    bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
                    return false;
                }
                if (response.data.dataList === null) {
                    return false;
                }

                $scope.model.totalCount = response.data.dataContent.totalCount;
                $scope.model.pageNumber = parseInt(response.data.dataContent.currentPageNum);
                $scope.model.maxPageNumber = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);
                $scope.model.companyList = response.data.dataContent.dataList;
                $scope.model.paginationArray = response.data.dataContent.paginationArray;
                $scope.model.prePageNum = response.data.dataContent.prePageNum === undefined ? -1 : response.data.dataContent.prePageNum;
                $scope.model.nextPageNum = response.data.dataContent.nextPageNum === undefined ? -1 : response.data.dataContent.nextPageNum;
                $scope.model.fromIndex = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber - 1) * response.data.dataContent.pageSize + 1;
                $scope.model.toIndex = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber - 1) * response.data.dataContent.pageSize + response.data.dataContent.dataList.length;

            }, function errorCallback(response) {
                bootbox.alert(localMessage.NETWORK_ERROR);
            });
    };

    $scope.onFirstPage = function() {
        if ($scope.model.pageNumber === 1) {
            return false;
        }
        $scope.model.pageNumber = 1;
        $scope.loadCompany();
    };
    $scope.onPrePage = function() {
        if ($scope.model.pageNumber === 1) {
            return false;
        }
        $scope.model.pageNumber--;
        $scope.loadCompany();
    };
    $scope.onPagination = function(pageNumber) {
        if ($scope.model.pageNumber === pageNumber) {
            return false;
        }
        $scope.model.pageNumber = pageNumber;
        $scope.loadCompany();
    };
    $scope.onNextPage = function() {
        if ($scope.model.pageNumber === $scope.model.maxPageNumber) {
            return false;
        }
        $scope.model.pageNumber++;
        $scope.loadCompany();
    };
    $scope.onLastPage = function() {
        if ($scope.model.pageNumber === $scope.model.maxPageNumber) {
            return false;
        }
        $scope.model.pageNumber = $scope.model.maxPageNumber;
        $scope.loadCompany();
    };

    $scope.onShowDetail = function(company) {
        $scope.model.companyModalTitle = company.companyAbbreviation;
        $http.get(`/company/technology/using?companyID=${company.companyID}`)
            .then(function successCallback(response) {
                if (response.data.err) {
                    bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
                    return false;
                }
                if (response.data.dataList === null) {
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