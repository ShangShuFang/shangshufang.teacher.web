let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
	$scope.model = {
		technologyID: 0,
		knowledgeID: 0,
		loginUser: commonUtility.getLoginUser(),
		// C: 企业题库  M: 我院题库
		questionSource: 'C',
		// C: 选择题  B: 填空  P: 编程题
		questionType: 'C',
		choiceQuestion: {
			dataList: [],
			pageNumber: 1,
			totalCount: 0,
			maxPageNumber: 0,
			filterTeacher: 0
		},
		blankQuestion: {
			dataList: [],
			pageNumber: 1,
			totalCount: 0,
			maxPageNumber: 0
		},
		programeQuestion: {
			dataList: [],
			pageNumber: 1,
			totalCount: 0,
			maxPageNumber: 0
		},
	};

	//#region 企业题库
	$scope.loadChoiceQuestionFromCompany = function () {
		$http.get('/exercises/knowledge/choice/list?'
			.concat(`pageNumber=${$scope.model.choiceQuestion.pageNumber}`)
			.concat(`&technologyID=${$scope.model.technologyID}`)
			.concat(`&knowledgeID=${$scope.model.knowledgeID}`))
			.then(function successCallback(response) {
				if (response.data.err) {
					bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
					return false;
				}

				$scope.model.choiceQuestion.totalCount = response.data.dataContent.totalCount;
				$scope.model.choiceQuestion.maxPageNumber = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);
				if (response.data.dataContent.totalCount === 0) {
					$scope.model.choiceQuestion.dataList = [];
					return false;
				}
				response.data.dataContent.dataList.forEach((data) => {
					$scope.model.choiceQuestion.dataList.push(data);
				});
			}, function errorCallback(response) {
				bootbox.alert(localMessage.NETWORK_ERROR);
			});
	};

	$scope.loadBlankQuestionFromCompany = function () {
		$http.get('/exercises/knowledge/blank/list?'
			.concat(`pageNumber=${$scope.model.blankQuestion.pageNumber}`)
			.concat(`&technologyID=${$scope.model.technologyID}`)
			.concat(`&knowledgeID=${$scope.model.knowledgeID}`))
			.then(function successCallback(response) {
				if (response.data.err) {
					bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
					return false;
				}

				$scope.model.blankQuestion.totalCount = response.data.dataContent.totalCount;
				$scope.model.blankQuestion.maxPageNumber = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);
				if (response.data.dataContent.totalCount === 0) {
					$scope.model.blankQuestion.dataList = [];
					return false;
				}
				response.data.dataContent.dataList.forEach((data) => {
					$scope.model.blankQuestion.dataList.push(data);
				});
			}, function errorCallback(response) {
				bootbox.alert(localMessage.NETWORK_ERROR);
			});
	};

	$scope.loadprogrameQuestionFromCompany = function () {
		$http.get('/exercises/knowledge/program/list?'
			.concat(`pageNumber=${$scope.model.programeQuestion.pageNumber}`)
			.concat(`&technologyID=${$scope.model.technologyID}`)
			.concat(`&knowledgeID=${$scope.model.knowledgeID}`))
			.then(function successCallback(response) {
				if (response.data.err) {
					bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
					return false;
				}

				$scope.model.programeQuestion.totalCount = response.data.dataContent.totalCount;
				$scope.model.programeQuestion.maxPageNumber = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);
				if (response.data.dataContent.totalCount === 0) {
					$scope.model.programeQuestion.dataList = [];
					return false;
				}
				response.data.dataContent.dataList.forEach((data) => {
					$scope.model.programeQuestion.dataList.push(data);
				});
			}, function errorCallback(response) {
				bootbox.alert(localMessage.NETWORK_ERROR);
			});
	};
	//#endregion

	//#region 自定义题库

	//#region 选择题
	$scope.onFilterChoiceQuestion = function (filter) {
		$scope.model.choiceQuestion.filterTeacher = filter === 'M' 
		? $scope.model.loginUser.customerID : 0;
		$scope.clearChoiceQuestion();
		$scope.loadChoiceQuestionFromMyUniversity();
	};

	$scope.loadChoiceQuestionFromMyUniversity = function () {
		$http.get('/exercises/knowledge/custom/choice/list?'
			.concat(`pageNumber=${$scope.model.choiceQuestion.pageNumber}`)
			.concat(`&technologyID=${$scope.model.technologyID}`)
			.concat(`&knowledgeID=${$scope.model.knowledgeID}`)
			.concat(`&teacherID=${$scope.model.choiceQuestion.filterTeacher}`))
			.then(function successCallback(response) {
				if (response.data.err) {
					bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
					return false;
				}

				$scope.model.choiceQuestion.totalCount = response.data.dataContent.totalCount;
				$scope.model.choiceQuestion.maxPageNumber = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);

				if (response.data.dataContent.totalCount > 0) {
					response.data.dataContent.dataList.forEach((data) => {
						data.isNew = false;
						data.isShowEdit = false;
						$scope.model.choiceQuestion.dataList.push(data);
					});
					return false;
				}
				$scope.model.choiceQuestion.dataList = [];
			}, function errorCallback(response) {
				bootbox.alert(localMessage.NETWORK_ERROR);
			});
	};

	$scope.onLoadMoreCustomChoiceExercises = function () {
		$scope.model.choiceQuestion.pageNumber++;
		$scope.loadChoiceQuestionFromMyUniversity();
	};

	$scope.buildChoiceQuestion = function () {
		let choiceQuestion = {};
		choiceQuestion.exercisesID = 0;
		choiceQuestion.universityCode = 0;
		choiceQuestion.universityName = '';
		choiceQuestion.schoolID = 0;
		choiceQuestion.schoolName = '';
		choiceQuestion.teacherID = 0;
		choiceQuestion.teacherName = '';
		choiceQuestion.exercisesTitle = '';
		choiceQuestion.exercisesSource = '';
		choiceQuestion.exercisesType = 'S'; //默认为单项选择
		choiceQuestion.isNew = true;

		choiceQuestion.createTime = '';
		choiceQuestion.updateTime = '';
		choiceQuestion.choiceOptions = [
			{
				optionText: '',
				rightAnswer: false
			},
			{
				optionText: '',
				rightAnswer: false
			},
			{
				optionText: '',
				rightAnswer: false
			},
			{
				optionText: '',
				rightAnswer: false
			}
		];
		choiceQuestion.isShowEdit = false;
		return choiceQuestion;
	};

	$scope.onCreateChoiceQuestion = function () {
		//判断当前用户是否登录
		if (commonUtility.isEmpty($scope.model.loginUser)) {
			layer.msg("您还没登录，登录系统后就可以添加习题啦！");
			return false;
		}
		$scope.model.choiceQuestion.dataList.push($scope.buildChoiceQuestion());
	};

	$scope.toggleChoiceQuestionEdit = function (choiceQuestion, isShow) {
		choiceQuestion.isShowEdit = isShow;
	};

	$scope.onSetAnswer = function (choiceQuestion, option, event) {
		if (choiceQuestion.exercisesType === 'S') {
			choiceQuestion.choiceOptions.forEach(function (option) {
				option.rightAnswer = false;
			});
		}
		option.rightAnswer = event.target.checked;
	};

	$scope.onCreateChoiceOption = function (choiceQuestion) {
		choiceQuestion.choiceOptions.push({
			optionText: '',
			rightAnswer: false
		});
	};

	$scope.onRemoveOption = function (choiceQuestion, op) {
		let removeIndex = -1;
		choiceQuestion.choiceOptions.forEach(function (option, index) {
			if (option === op) {
				removeIndex = index;
			}
		});
		if (removeIndex >= 0) {
			choiceQuestion.choiceOptions.splice(removeIndex, 1);
		}
	};

	$scope.saveChoiceQuestion = function (choiceQuestion) {
		//数据校验
		if (!$scope.checkChoiceData(choiceQuestion)) {
			return false;
		}

		if (choiceQuestion.isNew) {
			$scope.addChoiceQuestion(choiceQuestion);
			return false;
		}
		$scope.changeChoiceQuestion(choiceQuestion);
	};

	$scope.checkChoiceData = function (choiceQuestion) {
		let answerCount = 0;
		if (choiceQuestion.exercisesTitle.length === 0) {
			layer.msg('请填写题目标题！');
			return false;
		}
		for (let i = 0; i <= choiceQuestion.choiceOptions.length - 1; i++) {
			if (choiceQuestion.choiceOptions[i].optionText.length === 0) {
				layer.msg('不能有内容为空的选项内容！');
				return false;
			}
		}

		for (let i = 0; i <= choiceQuestion.choiceOptions.length - 1; i++) {
			if (choiceQuestion.choiceOptions[i].rightAnswer) {
				answerCount++;
			}
		}
		if (answerCount === 0) {
			layer.msg('请设置正确选项！');
			return false;
		}
		if (choiceQuestion.exercisesType === 'S' && answerCount > 1) {
			layer.msg('单项选择题只能有一个正确选项！');
			return false;
		}
		if (choiceQuestion.exercisesType === 'M' && answerCount < 2) {
			layer.msg('多项选择题至少应有不少于两个正确选项！');
			return false;
		}
		return true;
	};

	$scope.addChoiceQuestion = function (choiceQuestion) {
		let optionsJson = JSON.stringify(choiceQuestion.choiceOptions);
		//数据保存，并提示保存结果
		$http.post('/exercises/knowledge/custom/choice/add', {
			universityCode: $scope.model.loginUser.universityCode,
			schoolID: $scope.model.loginUser.schoolID,
			teacherID: $scope.model.loginUser.customerID,
			technologyID: $scope.model.technologyID,
			knowledgeID: $scope.model.knowledgeID,
			exercisesTitle: choiceQuestion.exercisesTitle,
			exercisesType: choiceQuestion.exercisesType,
			choiceOptionsJson: optionsJson,
			loginUser: $scope.model.loginUser.customerID
		}).then(function successCallback(response) {
			if (response.data.err) {
				bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
				return false;
			}

			let currentTime = new Date().toLocaleString('chinese', { hour12: false });
			choiceQuestion.isNew = false;
			choiceQuestion.exercisesID = response.data.exercisesID;
			choiceQuestion.universityID = $scope.model.loginUser.universityID;
			choiceQuestion.universityName = $scope.model.loginUser.universityName;
			choiceQuestion.schoolID = $scope.model.loginUser.schoolID;
			choiceQuestion.schoolName = $scope.model.loginUser.schoolName;
			choiceQuestion.teacherID = $scope.model.loginUser.customerID;
			choiceQuestion.createUser = $scope.model.loginUser.customerName;
			choiceQuestion.createTime = currentTime.replaceAll('/', '-');
			choiceQuestion.updateUser = $scope.model.loginUser.customerName;
			choiceQuestion.updateTime = currentTime.replaceAll('/', '-');

			//隐藏编辑区
			$scope.toggleChoiceQuestionEdit(choiceQuestion, false);
			layer.msg('保存成功！');
		}, function errorCallback(response) {
			bootbox.alert(localMessage.NETWORK_ERROR);
		});
	};

	$scope.changeChoiceQuestion = function (choiceQuestion) {
		let optionsJson = JSON.stringify(choiceQuestion.choiceOptions);
		//数据保存，并提示保存结果
		$http.put('/exercises/knowledge/custom/choice/change', {
			exercisesID: choiceQuestion.exercisesID,
			universityCode: $scope.model.loginUser.universityCode,
			schoolID: $scope.model.loginUser.schoolID,
			teacherID: $scope.model.loginUser.customerID,
			technologyID: choiceQuestion.technologyID,
			knowledgeID: choiceQuestion.knowledgeID,
			exercisesTitle: choiceQuestion.exercisesTitle,
			exercisesSource: choiceQuestion.exercisesSource,
			exercisesType: choiceQuestion.exercisesType,
			choiceOptionsJson: optionsJson,
			loginUser: $scope.model.loginUser.customerID
		}).then(function successCallback(response) {
			if (response.data.err) {
				bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
				return false;
			}
			let currentTime = new Date().toLocaleString('chinese', { hour12: false });
			choiceQuestion.isNew = false;
			choiceQuestion.updateUser = $scope.model.loginUser.adminName;
			choiceQuestion.updateTime = currentTime.replaceAll('/', '-');
			//隐藏编辑区
			$scope.toggleChoiceQuestionEdit(choiceQuestion, false);
			layer.msg('保存成功！');
		}, function errorCallback(response) {
			bootbox.alert(localMessage.NETWORK_ERROR);
		});
	};

	$scope.onRemoveChoiceQuestion = function (choiceQuestion) {
		if (choiceQuestion.isNew) {
			$scope.removeChoiceQuestion(choiceQuestion);
			return false;
		}
		bootbox.confirm({
			message: `您确定要删除选择题【${choiceQuestion.exercisesTitle}】吗？`,
			buttons: {
				confirm: {
					label: '删除',
					className: 'btn-danger'
				},
				cancel: {
					label: '取消',
					className: 'btn-secondary'
				}
			},
			callback: function (result) {
				if (result) {
					$scope.deleteChoiceQuestion(choiceQuestion);
				}
			}
		});
	};

	$scope.deleteChoiceQuestion = function (choiceQuestion) {
		$http.delete('/exercises/knowledge/custom/choice/delete'
			.concat(`?technologyID=${choiceQuestion.technologyID}`)
			.concat(`&knowledgeID=${choiceQuestion.knowledgeID}`)
			.concat(`&exercisesID=${choiceQuestion.exercisesID}`)
			.concat(`&teacherID=${$scope.model.loginUser.customerID}`))
			.then(function successCallback(response) {
				if (response.data.err) {
					bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
					return false;
				}
				$scope.removeChoiceQuestion(choiceQuestion);
				layer.msg('删除成功！');
			}, function errorCallback(response) {
				bootbox.alert(localMessage.NETWORK_ERROR);
			});
	};

	$scope.removeChoiceQuestion = function (question) {
		let removeIndex = -1;
		$scope.model.choiceQuestion.dataList.forEach(function (choiceQuestion, index) {
			if (choiceQuestion === question) {
				removeIndex = index;
			}
		});
		if (removeIndex >= 0) {
			$scope.model.choiceQuestion.dataList.splice(removeIndex, 1);
		}
	}

	//#endregion

	//#region 填空题
	$scope.loadBlankQuestionFromMyUniversity = function () { };

	//#endregion

	//#region 编程题
	$scope.loadprogrameQuestionFromMyUniversity = function () { };

	//#endregion

	//#endregion

	//#region 他校题库
	$scope.loadChoiceQuestionFromOtherUniversity = function () { };

	$scope.loadBlankQuestionFromOtherUniversity = function () { };

	$scope.loadprogrameQuestionFromOtherUniversity = function () { };
	//#endregion

	//#region 公共方法

	//#endregion

	//#region 页面初始化
	$scope.clearExercisesDataList = function () {
		$scope.clearChoiceQuestion();
		$scope.clearBlankQuestion();
		$scope.clearProgramQuestion();
	};

	$scope.clearChoiceQuestion = function () {
		$scope.model.choiceQuestion.dataList = [];
		$scope.model.choiceQuestion.pageNumber = 1;
		$scope.model.choiceQuestion.totalCount = 0;
		$scope.model.choiceQuestion.maxPageNumber = 0;
	};

	$scope.clearBlankQuestion = function () {
		$scope.model.blankQuestion.dataList = [];
		$scope.model.blankQuestion.pageNumber = 1;
		$scope.model.blankQuestion.totalCount = 0;
		$scope.model.blankQuestion.maxPageNumber = 0;
	};
	$scope.clearProgramQuestion = function () {
		$scope.model.programeQuestion.dataList = [];
		$scope.model.programeQuestion.pageNumber = 1;
		$scope.model.programeQuestion.totalCount = 0;
		$scope.model.programeQuestion.maxPageNumber = 0;
	};

	$scope.loadChoiceQuestion = function () {
		switch ($scope.model.questionSource) {
			case 'C':
				$scope.loadChoiceQuestionFromCompany();
				break;
			case 'M':
				$scope.loadChoiceQuestionFromMyUniversity();
				break;
			case 'O':
				$scope.loadChoiceQuestionFromOtherUniversity();
				break;
		}
	};

	$scope.loadBlankQuestion = function () {
		switch ($scope.model.questionSource) {
			case 'C':
				$scope.loadBlankQuestionFromCompany();
				break;
			case 'M':
				$scope.loadBlankQuestionFromMyUniversity();
				break;
			case 'O':
				$scope.loadBlankQuestionFromOtherUniversity();
				break;
		}
	};

	$scope.loadprogrameQuestion = function () {
		switch ($scope.model.questionSource) {
			case 'C':
				$scope.loadprogrameQuestionFromCompany();
				break;
			case 'M':
				$scope.loadprogrameQuestionFromMyUniversity();
				break;
			case 'O':
				$scope.loadprogrameQuestionFromOtherUniversity();
				break;
		}
	};

	$scope.onSearchBySource = function (source) {
		$scope.model.questionSource = source;
		$scope.model.questionType = 'C';
		$scope.clearExercisesDataList();
		$scope.loadExercises();
	};

	$scope.onSearchByType = function (type) {
		$scope.model.questionType = type;
	}

	$scope.setUriParameter = function () {
		$scope.model.technologyID = document.getElementById('hidden_technologyID').value;
		$scope.model.knowledgeID = document.getElementById('hidden_knowledgeID').value;
	};

	$scope.loadExercises = function () {
		$scope.loadChoiceQuestion();
		$scope.loadBlankQuestion();
		$scope.loadprogrameQuestion();
	};

	$scope.onLoadMore = function (type) {
		switch (type) {
			case "C":
				$scope.model.choiceQuestion.pageNumber++;
				$scope.loadChoiceQuestionFromCompany();
				break;
			case "B":
				$scope.model.blankQuestion.pageNumber++;
				$scope.loadBlankQuestionFromCompany()
				break;
			case "P":
				$scope.model.programeQuestion.pageNumber++;
				$scope.loadprogrameQuestionFromCompany();
				break;
		}
	};

	$scope.initPage = function () {
		$scope.setUriParameter();
		$scope.clearExercisesDataList();
		$scope.loadExercises();
	};

	$scope.initPage();

	//#endregion
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);