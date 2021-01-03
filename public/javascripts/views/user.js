let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    bizLog: {
      pageName: 'user',
      operationName: {
        PAGE_LOAD: 'PL',
        CHANGE_USER_INFO: 'CUI',
      },
      logMemo: '',
    },
    customerPhoto: '',
    customerNameTitle: '',
    customerName: '',
    customerUniversity: '',
    customerSchool: '',
    customerSex: '',
    customerBirth: '',
    customerCellphone: '',
    customerCellphoneTitle: '',
    isCellphoneInvalid: Constants.CHECK_INVALID.DEFAULT,
    checkCellphoneAlterMessage: '',

    customerEmail: '',
    customerEmailTitle: '',
    isEmailInvalid: Constants.CHECK_INVALID.DEFAULT,
    checkEmailAlterMessage: '',

    isLogin: false,
    loginUser: null
  };

  $scope.initPage = function () {
    tracking.view(trackingSetting.view.userInfo);
    $scope.model.isLogin = commonUtility.isLogin();
    $scope.model.loginUser = commonUtility.getLoginUser();
    if(!$scope.model.isLogin){
      location.href = '/';
      return false;
    }
    $scope.initUploadPlugin();
    $scope.loadCustomerInfo();
  };

  $scope.initUploadPlugin = function () {
    let uploadImageDir = {"dir1": "university", "dir2": $scope.model.loginUser.universityCode, "dir3": "teacher", "dir4": $scope.model.loginUser.customerID};
    let uploadImageServerUrl = commonUtility.buildSystemRemoteUri(Constants.UPLOAD_SERVICE_URI, uploadImageDir);

    uploadUtils.initUploadPlugin('#file-upload-image', uploadImageServerUrl, ['png','jpg', 'jpeg'], false, function (opt,data) {
      $scope.model.customerPhoto = data.fileUrlList[0];
      $scope.$apply();
      $('#kt_modal_image').modal('hide');
    });
  };

  $scope.loadCustomerInfo = function () {
    $scope.model.customerPhoto = $scope.model.loginUser.photo;
    $scope.model.customerNameTitle = $scope.model.loginUser.customerName;
    $scope.model.customerName = $scope.model.loginUser.customerName;
    $scope.model.customerUniversity = $scope.model.loginUser.universityName;
    $scope.model.customerSchool = $scope.model.loginUser.schoolName;
    $scope.model.customerSex = $scope.model.loginUser.sex;
    $scope.model.customerCellphoneTitle = $scope.model.loginUser.cellphone;
    $scope.model.customerCellphone = $scope.model.loginUser.cellphone;
    $scope.model.isCellphoneInvalid = Constants.CHECK_INVALID.VALID;
    $scope.model.customerEmailTitle = $scope.model.loginUser.email;
    $scope.model.customerEmail = $scope.model.loginUser.email;
    $scope.model.isEmailInvalid = Constants.CHECK_INVALID.DEFAULT;
  };

  $scope.onCellphoneBlur = function() {
    if(commonUtility.isEmpty($scope.model.customerCellphone)
        || $scope.model.customerCellphone === $scope.model.customerCellphoneTitle){
      return false;
    }
    if(!commonUtility.isCellphoneNumber($scope.model.customerCellphone)){
      $scope.model.isCellphoneInvalid = Constants.CHECK_INVALID.INVALID;
      $scope.model.checkCellphoneAlterMessage = localMessage.CELLPHONE_INVALID;
      return false;
    }

    $http.get('/register/checkCellphone?cellphone=' + $scope.model.customerCellphone).then(function successCallback (response) {
      if(response.data.err) {
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

  $scope.onEmailBlur = function() {
    if($scope.model.customerEmail === '' || $scope.model.customerEmail === $scope.model.customerEmailTitle){
      $scope.model.isEmailInvalid = Constants.CHECK_INVALID.DEFAULT;
      $scope.model.checkEmailAlterMessage = '';
      return false;
    }

    if($scope.model.customerEmail === undefined || $scope.model.customerEmail === $scope.model.customerEmailTitle){
      $scope.model.isEmailInvalid = Constants.CHECK_INVALID.INVALID;
      $scope.model.checkEmailAlterMessage = localMessage.EMAIL_ERROR;
      return false;
    }
    if(!commonUtility.isEmail($scope.model.customerEmail)){
      $scope.model.isEmailInvalid = Constants.CHECK_INVALID.INVALID;
      $scope.model.checkEmailAlterMessage = localMessage.EMAIL_INVALID;
      return false;
    }

    $http.get('/register/checkEmail?email=' + $scope.model.customerEmail).then(function successCallback (response) {
      if(response.data.err) {
        $scope.model.isEmailInvalid = Constants.CHECK_INVALID.DEFAULT;
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }

      $scope.model.isEmailInvalid =
          response.data.result ?
              Constants.CHECK_INVALID.INVALID
              : Constants.CHECK_INVALID.VALID;

      $scope.model.checkEmailAlterMessage =
          response.data.result ?
              localMessage.EMAIL_REGISTERED
              : '';

    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onShowUploadImageModal = function(){
    $('#kt_modal_image').modal('show');
  };

  $scope.onSubmit = function(){
    $scope.model.loginUser.customerName = $scope.model.customerName;
    $scope.model.loginUser.sex = $scope.model.customerSex;
    $scope.model.loginUser.cellphone = $scope.model.customerCellphone;
    $scope.model.loginUser.email = $scope.model.customerEmail;
    $scope.model.loginUser.photo = $scope.model.customerPhoto;
    $http.put('/user', {
      universityCode: $scope.model.loginUser.universityCode,
      schoolID: $scope.model.loginUser.schoolID,
      customerID: $scope.model.loginUser.customerID,
      accountID: $scope.model.loginUser.accountID,
      fullName: $scope.model.customerName,
      sex: $scope.model.customerSex,
      birth: $scope.model.customerBirth,
      cellphone: $scope.model.customerCellphone,
      email: $scope.model.customerEmail,
      photo: $scope.model.customerPhoto,
      loginUser: $scope.model.loginUser.customerID
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      commonUtility.setCookie(Constants.COOKIE_LOGIN_USER, JSON.stringify($scope.model.loginUser));
      layer.msg(localMessage.SAVE_SUCCESS);
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);