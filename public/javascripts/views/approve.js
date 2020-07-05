let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function($scope, $http) {
    $scope.model = {
        filterStatus: 'P',
        fromIndex: 0,
        toIndex: 0,
        pageNumber: 1,
        totalCount: 0,
        maxPageNumber: 0,
        dataList: [],
        paginationArray: [],
        prePageNum: -1,
        nextPageNum: -1,

        approveModalTitle: '',
        loginUser: null,
    };

    $scope.initPage = function() {
        $scope.model.loginUser = commonUtility.getLoginUser();
        if ($scope.model.loginUser == null || $scope.model.loginUser.accountRole !== 'A') {
            //location.href = '/';
            return false;
        }
        $scope.setMenuActive();
        $scope.loadData();
    };

    $scope.setMenuActive = function() {
        $('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
    };

    $scope.onFilterData = function(status) {
        $scope.model.filterStatus = status;
        $scope.loadData();
    };

    $scope.loadData = function() {
        $http.get(`/approve/List?pageNumber=${$scope.model.pageNumber}&universityCode=${$scope.model.loginUser.universityCode}&schoolID=${$scope.model.loginUser.schoolID}&accountID=${$scope.model.loginUser.accountID}&dataStatus=${$scope.model.filterStatus}`)
            .then(function successCallback(response) {
                if (response.data.err) {
                    bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
                    return false;
                }
                if (response.data.dataContent === null || commonUtility.isEmptyList(response.data.dataContent.dataList)) {
                    $scope.model.totalCount = 0;
                    $scope.model.dataList = [];
                    $scope.model.pageNumber = 1;
                    $scope.model.maxPageNumber = 0;
                    $scope.model.paginationArray = [];
                    $scope.model.prePageNum = -1;
                    $scope.model.nextPageNum = -1;
                    $scope.model.fromIndex = 0;
                    $scope.model.toIndex = 0;
                    return false;
                }
                $scope.model.totalCount = response.data.dataContent.totalCount;
                $scope.model.dataList = response.data.dataContent.dataList;
                $scope.model.pageNumber = response.data.dataContent.currentPageNum;
                $scope.model.maxPageNumber = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);
                $scope.model.paginationArray = response.data.dataContent.paginationArray;
                $scope.model.prePageNum = response.data.dataContent.prePageNum === undefined ? -1 : response.data.dataContent.prePageNum;
                $scope.model.nextPageNum = response.data.dataContent.nextPageNum === undefined ? -1 : response.data.dataContent.nextPageNum;
                $scope.model.fromIndex = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber - 1) * Constants.PAGE_SIZE + 1;
                $scope.model.toIndex = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber - 1) * Constants.PAGE_SIZE + $scope.model.dataList.length;
            }, function errorCallback(response) {
                bootbox.alert(localMessage.NETWORK_ERROR);
            });
    };

    $scope.onFirstPage = function() {
        if (parseInt($scope.model.pageNumber) === 1) {
            return false;
        }
        $scope.model.pageNumber = 1;
        $scope.loadData();
    };

    $scope.onPrePage = function() {
        if (parseInt($scope.model.pageNumber) === 1) {
            return false;
        }
        $scope.model.pageNumber--;
        $scope.loadData();
    };

    $scope.onPagination = function(pageNumber) {
        if (parseInt($scope.model.pageNumber) === pageNumber) {
            return false;
        }
        $scope.model.pageNumber = pageNumber;
        $scope.loadData();
    };

    $scope.onNextPage = function() {
        if (parseInt($scope.model.pageNumber) === $scope.model.maxPageNumber) {
            return false;
        }
        $scope.model.pageNumber++;
        $scope.loadData();
    };

    $scope.onLastPage = function() {
        if (parseInt($scope.model.pageNumber) === $scope.model.maxPageNumber) {
            return false;
        }
        $scope.model.pageNumber = $scope.model.maxPageNumber;
        $scope.loadData();
    };

    $scope.onChangeStatus = function(data, status) {
        $http.put('/approve/status', {
            universityCode: data.universityCode,
            schoolID: data.schoolID,
            accountID: data.accountID,
            customerID: data.customerID,
            studentID: data.customerID,
            accountRole: data.accountRole,
            status: status,
            loginUser: $scope.model.loginUser.customerID
        }).then(function successCallback(response) {
            if (response.data.err) {
                bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
                return false;
            }
            $scope.loadData();
        }, function errorCallback(response) {
            bootbox.alert(localMessage.NETWORK_ERROR);
        });
    };

    $scope.initPage();

});
angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);