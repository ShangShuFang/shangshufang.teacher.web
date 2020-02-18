let globalApp = angular.module('myApp', []);
globalApp.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    loginUser: '',
    isLogin: false
  };

  $scope.initGlobalData = function () {
    $scope.model.isLogin = commonUtility.isLogin();
    $scope.model.loginUser = commonUtility.getLoginUser();
  };

  $scope.onSignOut = function () {
    commonUtility.delCookie(Constants.COOKIE_LOGIN_USER);
    location.href = '/';
  };

  $scope.initGlobalData();
});

