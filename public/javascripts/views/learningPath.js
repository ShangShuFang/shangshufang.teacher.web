let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    bizLog: {
      pageName: 'learningPath',
      operationName: {
        PAGE_LOAD: 'PL',
      },
      logMemo: '',
    },

    directionList: [],
    selectedDirection: {directionID: 0, directionName: '全部'},

    categoryList: [],
    selectedCategory: {categoryID: 0, categoryName: '全部'},
    isLogin: false,
    loginUser: null
  };

  $scope.initPage = function () {
    bizLogger.logInfo(
        $scope.model.bizLog.pageName,
        $scope.model.bizLog.operationName.PAGE_LOAD,
        bizLogger.OPERATION_TYPE.LOAD,
        bizLogger.OPERATION_RESULT.SUCCESS);
    $scope.model.isLogin = commonUtility.isLogin();
    $scope.model.loginUser = commonUtility.getLoginUser();
    $scope.setMenuActive();
    $scope.loadDirectionList();
    $scope.loadTechnologyCategoryList();
  };

  $scope.setMenuActive = function () {
    $('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
    $('ul.kt-menu__nav li:nth-child(4)').addClass('kt-menu__item--here');
  };

  $scope.loadDirectionList = function () {
    $http.get(`/common/direction/list`).then(function successCallback(response) {
      if (response.data.err) {
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      $scope.model.directionList = response.data.dataList;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.loadTechnologyCategoryList = function () {
    $http.get(`/common/technology/category/list?directionID=${$scope.model.selectedDirection.directionID}`).then(function successCallback(response) {
      if (response.data.err) {
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      $scope.model.categoryList = response.data.dataList;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onFilterByDirection = function (direction) {
    if (direction === undefined) {
      $scope.model.selectedDirection = {directionID: 0, directionName: '全部'};
      $scope.model.selectedCategory = {categoryID: 0, categoryName: '全部'};
      $scope.model.isAppendData = false;
      $scope.loadTechnologyCategoryList();
      $scope.loadCourseList();
      return false;
    }
    $scope.model.selectedDirection = {directionID: direction.directionID, directionName: direction.directionName};
    $scope.model.selectedCategory = {categoryID: 0, categoryName: '全部'};
    $scope.model.isAppendData = false;
    $scope.loadTechnologyCategoryList();
    $scope.loadCourseList();
  };

  $scope.onFilterByCategory = function (category) {
    if (category === undefined) {
      $scope.model.selectedCategory = {categoryID: 0, categoryName: '全部'};
      $scope.model.isAppendData = false;
      $scope.loadCourseList();
      return false;
    }
    $scope.model.selectedCategory = {categoryID: category.technologyCategoryID, categoryName: category.technologyCategoryName};
    $scope.model.isAppendData = false;
    $scope.loadCourseList();
  };

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);