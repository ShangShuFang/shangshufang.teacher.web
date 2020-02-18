let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http, $timeout) {
  $scope.model = {
    universityList: [],
    selectedUniversity: {universityCode: 0, universityName: '请所择所在高校'},
    schoolList: [],
    selectedSchool: {schoolID: 0, schoolName: '请所择所在二级学院'},
    fullName: '',
    cellphone: '',
    isCellphoneInvalid: Constants.CHECK_INVALID.DEFAULT,
    checkCellphoneAlterMessage: '',
    sendCodeCellphone: '',
    verificationCode: '',
    isCodeInvalid: Constants.CHECK_INVALID.DEFAULT,
    verificationCodeAlertMessage: '',
    isSending: false,
    countdown: 60,
    password: '',
    confirmPassword: '',
    isPasswordInvalid: Constants.CHECK_INVALID.DEFAULT,
    isRegisterSuccess: false
  };

  $scope.initPage = function(){
    $scope.loadUniversityList();
  };

  $scope.loadUniversityList = function(){
    $http.get('/common/university').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if(response.data.dataList === null){
        return false;
      }
      $scope.model.universityList = response.data.dataList;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onUniversityChange = function(universityCode, universityName){
    $scope.model.selectedUniversity = {universityCode: universityCode, universityName: universityName};
    $scope.loadSchoolList();
  };

  $scope.loadSchoolList = function (){
    if($scope.model.selectedUniversity.universityCode === 0){
      $scope.model.selectedSchool = {schoolID: 0, schoolName: '所有二级学院'};
      $scope.model.schoolList.splice(0, $scope.model.schoolList.length);
      return false;
    }
    $http.get(`/common/school?universityCode=${$scope.model.selectedUniversity.universityCode}`)
        .then(function successCallback (response) {
          if(response.data.err){
            bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
            return false;
          }
          if(response.data.dataList === null){
            $scope.model.selectedSchool = {schoolID: 0, schoolName: '请所择所在二级学院'};
            $scope.model.schoolList.splice(0, $scope.model.schoolList.length);
            return false;
          }
          $scope.model.selectedSchool = {schoolID: 0, schoolName: '请所择所在二级学院'};
          $scope.model.schoolList = response.data.dataList;
        }, function errorCallback(response) {
          bootbox.alert(localMessage.NETWORK_ERROR);
        });
  };

  $scope.onSchoolChange = function (schoolID, schoolName){
    $scope.model.selectedSchool = {schoolID: schoolID, schoolName: schoolName};
  };

  $scope.onCellphoneBlur = function(){
    if($scope.model.cellphone === undefined || $scope.model.cellphone.length === 0){
      $scope.model.isCellphoneInvalid = Constants.CHECK_INVALID.DEFAULT;
      return false;
    }
    if(!commonUtility.isCellphoneNumber($scope.model.cellphone)){
      $scope.model.isCellphoneInvalid = Constants.CHECK_INVALID.INVALID;
      $scope.model.checkCellphoneAlterMessage = localMessage.CELLPHONE_INVALID;
      return false;
    }

    $http.get('/register/checkCellphone?cellphone=' + $scope.model.cellphone).then(function successCallback (response) {
      if(response.data.err){
        $scope.model.isCellphoneInvalid = Constants.CHECK_INVALID.DEFAULT;
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }

      $scope.model.isCellphoneInvalid =
          response.data.result ?
              Constants.CHECK_INVALID.INVALID
              : Constants.CHECK_INVALID.VALID;

      $scope.model.checkCellphoneAlterMessage =
          response.data.result ?
              localMessage.CELLPHONE_REGISTERED
              : '';

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
        systemFunction: 'register',
        cellphone: $scope.model.cellphone,
        verificationCode: verificationCode,
      }).then(function successCallback(response) {
        if(response.data.err){
          bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
          return false;
        }
        $scope.model.sendCodeCellphone = $scope.model.cellphone;
        $scope.sendVerificationCodeComplete();
      }, function errorCallback(response) {
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

  $scope.checkSmsVerificationCode = function(callback){
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
      callback();
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.register = function(){
    $http.post('/register', {
      universityCode: $scope.model.selectedUniversity.universityCode,
      schoolID: $scope.model.selectedSchool.schoolID,
      fullName: $scope.model.fullName,
      cellphone: $scope.model.cellphone,
      password: $scope.model.password
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        $scope.model.isRegisterSuccess = false;
        return false;
      }
      $scope.model.isRegisterSuccess = true;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onRegister = function(){
    $scope.checkSmsVerificationCode($scope.register);
  };

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);