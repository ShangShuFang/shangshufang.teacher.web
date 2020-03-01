let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    suggestTypeList: [],
    selectedSuggestType: null,
    suggestContent: '',
    cellphone: '',
    isCellphoneInvalid: Constants.CHECK_INVALID.DEFAULT,
    loginUserID: 0,
    isSubmitSuccess: false
  };

  $scope.initPage = function() {
    if(commonUtility.isLogin()){
      $scope.model.loginUserID = commonUtility.getLoginUser().customerID;
    }
    $scope.loadSuggestTypeList();
  };

  $scope.loadSuggestTypeList = function(){
    $http.get('/suggest/suggestType').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if(response.data.dataList === null){
        return false;
      }
      $scope.model.suggestTypeList = response.data.dataList;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.onChooseSuggestType = function(selectedSuggest){
    $scope.model.selectedSuggestType = selectedSuggest;
  };

  $scope.onCellphoneBlur = function(){
    if(commonUtility.isEmpty($scope.model.cellphone)){
      $scope.model.isCellphoneInvalid = Constants.CHECK_INVALID.DEFAULT;
      return false;
    }
    if(!commonUtility.isCellphoneNumber($scope.model.cellphone)){
      $scope.model.isCellphoneInvalid = Constants.CHECK_INVALID.INVALID;
      return false;
    }
    $scope.model.isCellphoneInvalid = Constants.CHECK_INVALID.VALID;
  };

  $scope.onSubmit = function(){
    let btn = $('#btnSubmitSuggest');
    $(btn).attr('disabled',true);
    KTApp.progress(btn);
    $http.post('/suggest', {
      suggestTypeID: $scope.model.selectedSuggestType.suggestTypeID,
      suggestContent: $scope.model.suggestContent,
      cellphone: $scope.model.cellphone,
      loginUser: $scope.model.loginUserID
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        KTApp.unprogress(btn);
        $scope.model.isSubmitSuccess = false;
        return false;
      }
      $scope.model.isSubmitSuccess = true;
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);