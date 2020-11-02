let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $sce, $http) {
	$scope.model = {
		title: '',
		studentName: '',
		exercisesStatus: '',
		exercisesStatusText: '',
		createTime: '',
		submitTime: '',
		choiceList: [],
		blankList: [],
		programList: []
	};
	$scope.initPage = function () {
		$scope.setMenuActive();
		$scope.loadExercises();
	};

	$scope.setMenuActive = function () {
		$('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
		$('ul.kt-menu__nav li:nth-child(3)').addClass('kt-menu__item--here');
	};

	$scope.loadExercises = function () {
		let courseExercisesID = $('#hidden_courseExercisesID').val();

		$http.get('/exercises/knowledge/student/data'
			.concat(`?courseExercisesID=${courseExercisesID}`))
			.then(function successCallback(response) {
				if (response.data.err) {
					bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
					return false;
				}

				$scope.model.title = `${response.data.courseExercises.courseName}（第${response.data.courseExercises.courseClass}节）`; 
				$scope.model.studentName = response.data.courseExercises.studentName;
				$scope.model.createTime = response.data.courseExercises.createTime;
				$scope.model.exercisesStatus = response.data.courseExercises.dataStatus;
				$scope.model.exercisesStatusText = response.data.courseExercises.dataStatusText;
				if (response.data.courseExercises.createTime !== response.data.courseExercises.updateTime) {
					$scope.model.submitTime = response.data.courseExercises.updateTime;
				}
				response.data.courseExercises.choiceExercisesList.forEach((data) => {
					data.exercisesTitleHtml = $sce.trustAsHtml(data.exercisesTitleHtml);
				});
				response.data.courseExercises.blankExercisesList.forEach((data) => {
					data.exercisesTitleHtml = $sce.trustAsHtml(data.exercisesTitleHtml);
				});
				response.data.courseExercises.programExercisesList.forEach((data) => {
					if (data.exercisesSourceType === 1) {
						data.exercisesTitleHtml = $sce.trustAsHtml(data.exercisesTitleHtml);
					}
				});

				$scope.model.choiceList = response.data.courseExercises.choiceExercisesList;
				$scope.model.blankList = response.data.courseExercises.blankExercisesList;
				$scope.model.programList = response.data.courseExercises.programExercisesList;
			}, function errorCallback(response) {
				bootbox.alert(localMessage.NETWORK_ERROR);
			});
	};

	$scope.initPage();
});
angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);