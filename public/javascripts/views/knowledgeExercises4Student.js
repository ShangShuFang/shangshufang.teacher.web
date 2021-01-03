let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $sce, $http) {
	$scope.model = {
		courseExercisesID: 0,
		courseExercisesDetailID: 0,
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
	$scope.reviewHistoryModel = {
		title: '',
		dataList: []
	};

	$scope.initPage = function () {
		tracking.view(trackingSetting.view.studentKnowledgeExercises);
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
				if (!commonUtility.isEmptyList(response.data.courseExercises.singleChoiceExercisesList)) {
					response.data.courseExercises.singleChoiceExercisesList.forEach((data) => {
						data.exercisesTitleHtml = $sce.trustAsHtml(data.exercisesTitleHtml);
					});
				}

				if (!commonUtility.isEmptyList(response.data.courseExercises.multipleChoiceExercisesList)) {
					response.data.courseExercises.multipleChoiceExercisesList.forEach((data) => {
						data.exercisesTitleHtml = $sce.trustAsHtml(data.exercisesTitleHtml);
					});
				}

				if (!commonUtility.isEmptyList(response.data.courseExercises.blankExercisesList)) {
					response.data.courseExercises.blankExercisesList.forEach((data) => {
						data.exercisesTitleHtml = $sce.trustAsHtml(data.exercisesTitleHtml);
					});
				}

				if (!commonUtility.isEmptyList(response.data.courseExercises.programExercisesList)) {
					response.data.courseExercises.programExercisesList.forEach((data) => {
						if (data.exercisesSourceType === 1) {
							data.exercisesTitleHtml = $sce.trustAsHtml(data.exercisesTitleHtml);
						}
					});
				}

				$scope.model.singleChoiceList = response.data.courseExercises.singleChoiceExercisesList;
				$scope.model.multipleChoiceList = response.data.courseExercises.multipleChoiceExercisesList;
				$scope.model.blankList = response.data.courseExercises.blankExercisesList;
				$scope.model.programList = response.data.courseExercises.programExercisesList;
			}, function errorCallback(response) {
				bootbox.alert(localMessage.NETWORK_ERROR);
			});
	};

	//region 批改历史
	$scope.showMarkHistoryDialog = function (program) {
		$scope.model.courseExercisesID = program.courseExercisesID;
		$scope.model.courseExercisesDetailID = program.courseExercisesDetailID;
		$scope.reviewHistoryModel.title = program.exercisesTitle;
		$http.get('/exercises/knowledge/student/review/program'
				.concat(`?courseExercisesID=${$scope.model.courseExercisesID}`)
				.concat(`&courseExercisesDetailID=${$scope.model.courseExercisesDetailID}`))
				.then(function successCallback(response) {
					if (response.data.err) {
						bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
						return false;
					}
					$scope.reviewHistoryModel.dataList = response.data.dataList;
					$('#kt_modal_review_history').modal('show');
				}, function errorCallback(response) {
					bootbox.alert(localMessage.NETWORK_ERROR);
				});
	}
	//endregion

	$scope.initPage();
});
angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);