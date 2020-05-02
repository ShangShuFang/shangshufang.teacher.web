let globalApp = angular.module('myApp', []);
globalApp.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    loginUser: '',
    isLogin: false
  };

  $scope.initGlobalData = function () {
    $scope.model.isLogin = commonUtility.isLogin();
    $scope.model.loginUser = commonUtility.getLoginUser();
    if ($scope.model.isLogin) {
      $('#login_bar').addClass('kt-hidden');
      $('#user_bar').removeClass('kt-hidden');
    } else {
      if (!$('#user_bar').hasClass('kt-hidden')) {
        $('#login_bar').removeClass('kt-hidden');
        $('#user_bar').addClass('kt-hidden');
      }
    }
  };

  $scope.onSignOut = function () {
    commonUtility.delCookie(Constants.COOKIE_LOGIN_USER);
    location.href = '/';
  };

  $scope.initGlobalData();
});

