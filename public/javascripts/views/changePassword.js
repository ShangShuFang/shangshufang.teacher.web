let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    bizLog: {
      pageName: 'changePassword',
      operationName: {
        PAGE_LOAD: 'PL',
        CHANGE_USER_PASSWORD: 'CUP',
      },
      logMemo: '',
    },
    password: '',
    isPasswordInvalid: Constants.CHECK_INVALID.DEFAULT,
    checkPasswordAlterMessage: '',

    newPassword: '',
    isNewPasswordInvalid: Constants.CHECK_INVALID.DEFAULT,
    checkNewPasswordAlterMessage: '',

    confirmPassword: '',
    isConfirmPasswordInvalid: Constants.CHECK_INVALID.DEFAULT,
    checkConfirmPasswordAlterMessage: '',

    isLogin: false,
    loginUser: null,
    isChangeSuccess: false
  };

  $scope.initPage = function () {
    tracking.view(trackingSetting.view.changePassword);
    $scope.model.isLogin = commonUtility.isLogin();
    $scope.model.loginUser = commonUtility.getLoginUser();
    if(!$scope.model.isLogin){
      location.href = '/';
      return false;
    }
  };

  $scope.onPasswordBlur = function() {
    if(commonUtility.isEmpty($scope.model.password)){
      return false;
    }

    $http.post('/login', {
      cellphone: $scope.model.loginUser.cellphone,
      password: $scope.model.password
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if(response.data.teacherInfo === null){
        $scope.model.isPasswordInvalid = Constants.CHECK_INVALID.INVALID;
        return false;
      }
      $scope.model.isPasswordInvalid = Constants.CHECK_INVALID.VALID;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onNewPasswordBlur = function() {
    if(commonUtility.isEmpty($scope.model.newPassword) || commonUtility.isEmpty($scope.model.confirmPassword)){
      return false;
    }
    if($scope.model.newPassword !== $scope.model.confirmPassword){
      $scope.model.isConfirmPasswordInvalid = Constants.CHECK_INVALID.INVALID;
      return false;
    }
    $scope.model.isNewPasswordInvalid = Constants.CHECK_INVALID.VALID;
    $scope.model.isConfirmPasswordInvalid = Constants.CHECK_INVALID.VALID;
  };

  $scope.onConfirmPasswordBlur = function() {
    if(commonUtility.isEmpty($scope.model.newPassword) || commonUtility.isEmpty($scope.model.confirmPassword)){
      return false;
    }
    if($scope.model.newPassword !== $scope.model.confirmPassword){
      $scope.model.isConfirmPasswordInvalid = Constants.CHECK_INVALID.INVALID;
      return false;
    }
    $scope.model.isNewPasswordInvalid = Constants.CHECK_INVALID.VALID;
    $scope.model.isConfirmPasswordInvalid = Constants.CHECK_INVALID.VALID;
  };

  $scope.onChangePassword = function(){
    $http.put('/forgetPassword/changePassword', {
      cellphone: $scope.model.loginUser.cellphone,
      password: $scope.model.newPassword,
      loginUser: $scope.model.loginUser.customerID
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      $scope.model.isChangeSuccess = true;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);