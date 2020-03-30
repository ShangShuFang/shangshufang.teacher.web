let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
	$scope.model = {
		cellphone: '',
		password: '',
		isLoginSuccess: false,
		loginMessage: ''
	};

	$scope.onLogin = function(){
		$http.post('/login', {
			cellphone: $scope.model.cellphone,
			password: $scope.model.password
		}).then(function successCallback(response) {
			if(response.data.err){
				bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
				return false;
			}
			if(response.data.teacherInfo === null){
				bootbox.alert(localMessage.NO_ACCOUNT);
				return false;
			}
			switch (response.data.teacherInfo.dataStatus) {
				case Constants.ACCOUNT_STATUS.ACTIVE:
					break;
				case Constants.ACCOUNT_STATUS.WAITING:
					bootbox.alert(localMessage.ACCOUNT_WAITING);
					return false;
				case Constants.ACCOUNT_STATUS.NO_PASS:
					bootbox.alert(localMessage.ACCOUNT_NO_PASS);
					return false;
				case Constants.ACCOUNT_STATUS.DISABLED:
					bootbox.alert(localMessage.ACCOUNT_DISABLED);
					return false;
				default:
					return false;
			}

			let backUrl = $('#hidden_backUrl').val();
			//记录Cookie
			commonUtility.setCookie(Constants.COOKIE_LOGIN_USER, JSON.stringify(response.data.teacherInfo));
			if(commonUtility.isEmpty(backUrl)){
				location.href = '/index';
				return false;
			}
			location.href = backUrl;

		}, function errorCallback(response) {
			bootbox.alert(localMessage.NETWORK_ERROR);
		});
	};
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);