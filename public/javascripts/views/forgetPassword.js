let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http, $timeout) {
  $scope.model = {
    cellphone: '',
    isCellphoneInvalid: Constants.CHECK_INVALID.DEFAULT,
    checkCellphoneAlterMessage: '',

    verificationCode: '',
    isCodeInvalid: Constants.CHECK_INVALID.DEFAULT,
    verificationCodeAlertMessage: '',

    isSending: false,
    countdown: 60,

    password: '',
    confirmPassword: '',
    isPasswordInvalid: Constants.CHECK_INVALID.DEFAULT,

    isChangeSuccess: false,

    stepPage: 1
  };

  // region step1 账户验证
  $scope.onCellphoneBlur = function(){
    if(commonUtility.isEmpty($scope.model.cellphone)){
      $scope.model.isCellphoneInvalid = Constants.CHECK_INVALID.DEFAULT;
      return false;
    }
    if(!commonUtility.isCellphoneNumber($scope.model.cellphone)){
      $scope.model.isCellphoneInvalid = Constants.CHECK_INVALID.INVALID;
      $scope.model.checkCellphoneAlterMessage = localMessage.CELLPHONE_INVALID;
      return false;
    }

    $http.get('/forgetPassword/checkCellphone?cellphone=' + $scope.model.cellphone).then(function successCallback (response) {
      if(response.data.err){
        $scope.model.isCellphoneInvalid = Constants.CHECK_INVALID.DEFAULT;
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }

      $scope.model.isCellphoneInvalid =
          response.data.result ?
              Constants.CHECK_INVALID.VALID
              : Constants.CHECK_INVALID.INVALID;

      $scope.model.checkCellphoneAlterMessage = response.data.result ? '' : localMessage.CELLPHONE_NOT_FOUND;

    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onSendVerificationCode = function(){
    //step1: 获取验证码
    $http.get('/common/verificationCode/generate').then(function successCallback (response) {
      let verificationCode = response.data.code;
      //step2: 发送验证码
      $http.post('/common/verificationCode/send', {
        systemFunction: 'forgetPassword',
        cellphone: $scope.model.cellphone,
        verificationCode: verificationCode,
      }).then((response) => {
        if(response.data.err) {
          bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
          return false;
        }
        $scope.sendVerificationCodeComplete();
      }, (response) => {
        bootbox.alert(localMessage.NETWORK_ERROR);
      });

    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.sendVerificationCodeComplete = function(){
    if ($scope.model.countdown === 0) {
      $scope.model.isSendButtonDisabled = false;
      $scope.model.isSending = false;
      $scope.model.countdown = 60;//60秒过后button上的文字初始化,计时器初始化;
      return;
    } else {
      $scope.model.isSendButtonDisabled = true;
      $scope.model.isSending = true;
      $scope.model.countdown--;
    }
    $timeout(function() {
      $scope.sendVerificationCodeComplete()
    },1000) //每1000毫秒执行一次
  };

  $scope.onNext = function(){
    //校验手机验证码
    $http.get(`/common/verificationCode/check?cellphone=${$scope.model.cellphone}&code=${$scope.model.verificationCode}`).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if(response.data.result === false){
        $scope.model.isCodeInvalid = Constants.CHECK_INVALID.INVALID;
        $scope.model.verificationCodeAlertMessage = response.data.msg;
        return false;
      }
      $scope.model.isCodeInvalid = Constants.CHECK_INVALID.VALID;
      $scope.model.verificationCodeAlertMessage = '';
      $scope.model.stepPage = 2;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };
  //endregion

  // region step2 重置密码
  $scope.onConfirmPasswordBlur = function(){
    if(commonUtility.isEmpty($scope.model.password) || commonUtility.isEmpty($scope.model.confirmPassword)){
      $scope.model.isPasswordInvalid = Constants.CHECK_INVALID.DEFAULT;
      return false;
    }
    if($scope.model.password !== $scope.model.confirmPassword){
      $scope.model.isPasswordInvalid = Constants.CHECK_INVALID.INVALID;
      return false;
    }
    $scope.model.isPasswordInvalid = Constants.CHECK_INVALID.VALID;
  };

  $scope.onPreStep = function(){
    $scope.model.stepPage = 1;
  };

  $scope.onChangePassword = function(){
    $http.put('/forgetPassword/changePassword', {
      cellphone: $scope.model.cellphone,
      password: $scope.model.password
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      $scope.model.stepPage = 3;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  //endregion
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);