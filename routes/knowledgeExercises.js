let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let markdownService = require('../service/markdownService');
let commonService = require('../service/commonService');

router.get('/', function (req, res, next) {
	res.render('knowledgeExercises', {
		title: '知识点随堂练习',
		technologyID: req.query.technologyID,
		knowledgeID: req.query.knowledgeID
	});
});

//#region 企业题库
router.get('/choice/list', function (req, res, next) {
	let service = new commonService.commonInvoke('storeKnowledgeChoiceExercisesList');
	let pageNumber = req.query.pageNumber;
	let pageSize = sysConfig.pageSize.ten;
	let technologyID = req.query.technologyID;
	let knowledgeID = req.query.knowledgeID;
	let dataStatus = 'A';
	let parameter = `${pageNumber}/${pageSize}/${technologyID}/${knowledgeID}/${dataStatus}`;

	service.queryWithParameter(parameter, function (result) {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			let dataContent = commonService.buildRenderData('合作企业', pageNumber, pageSize, result);
			res.json({
				err: false,
				code: result.code,
				msg: result.msg,
				dataContent: dataContent
			});
		}
	});
});

router.get('/blank/list', function (req, res, next) {
	let service = new commonService.commonInvoke('storeKnowledgeBlankExercisesList');
	let pageNumber = req.query.pageNumber;
	let pageSize = sysConfig.pageSize.ten;
	let technologyID = req.query.technologyID;
	let knowledgeID = req.query.knowledgeID;
	let dataStatus = 'A';
	let parameter = `${pageNumber}/${pageSize}/${technologyID}/${knowledgeID}/${dataStatus}`;

	service.queryWithParameter(parameter, function (result) {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			let dataContent = commonService.buildRenderData('知识点练习（填空题）', pageNumber, pageSize, result);
			res.json({
				err: false,
				code: result.code,
				msg: result.msg,
				dataContent: dataContent
			});
		}
	});
});

router.get('/program/list', function (req, res, next) {
	let service = new commonService.commonInvoke('storeKnowledgeProgramExercisesList');
	let pageNumber = req.query.pageNumber;
	let pageSize = sysConfig.pageSize.all;
	let technologyID = req.query.technologyID;
	let knowledgeID = req.query.knowledgeID;
	let parameter = `${pageNumber}/${pageSize}/${technologyID}/${knowledgeID}`;

	service.queryWithParameter(parameter, function (result) {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			let dataContent = commonService.buildRenderData('知识点练习（编程题）', pageNumber, pageSize, result);
			res.json({
				err: false,
				code: result.code,
				msg: result.msg,
				dataContent: dataContent
			});
		}
	});
});
//#endregion

//#region 自定义题库（选择题）
router.get('/custom/choice/list', function (req, res, next) {
	let service = new commonService.commonInvoke('customKnowledgeChoiceExercisesList');
	let pageNumber = req.query.pageNumber;
	let pageSize = sysConfig.pageSize.ten;
	let technologyID = req.query.technologyID;
	let knowledgeID = req.query.knowledgeID;
	let teacherID = req.query.teacherID;
	let parameter = `${pageNumber}/${pageSize}/${technologyID}/${knowledgeID}/${teacherID}`;

	service.queryWithParameter(parameter, function (result) {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			if (result.content.totalCount > 0 && Array.isArray(result.content.responseData)) {
				result.content.responseData.forEach((data) => {
					data.exercisesTitleHtml = markdownService.convertToHtml(data.exercisesTitle);
				});
			}
			let dataContent = commonService.buildRenderData('知识点练习（选择题）', pageNumber, pageSize, result);
			res.json({
				err: false,
				code: result.code,
				msg: result.msg,
				dataContent: dataContent
			});
		}
	});
});

router.post('/custom/choice/add', function (req, res, next) {
	let service = new commonService.commonInvoke('addCustomKnowledgeChoiceExercises');
	let data = {
		universityCode: req.body.universityCode,
		schoolID: req.body.schoolID,
		teacherID: req.body.teacherID,
		technologyID: req.body.technologyID,
		knowledgeID: req.body.knowledgeID,
		exercisesTitle: req.body.exercisesTitle,
		exercisesType: req.body.exercisesType,
		choiceOptionsJson: req.body.choiceOptionsJson,
		loginUser: req.body.loginUser
	};

	service.create(data, (result) => {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			res.json({
				err: false,
				code: result.code,
				msg: result.msg,
				exercisesID: result.content.responseData
			});
		}
	});
});

router.put('/custom/choice/change', function (req, res, next) {
	let service = new commonService.commonInvoke('changeCustomKnowledgeChoiceExercises');
	let data = {
		exercisesID: req.body.exercisesID,
		universityCode: req.body.universityCode,
		schoolID: req.body.schoolID,
		teacherID: req.body.teacherID,
		technologyID: req.body.technologyID,
		knowledgeID: req.body.knowledgeID,
		exercisesTitle: req.body.exercisesTitle,
		exercisesType: req.body.exercisesType,
		choiceOptionsJson: req.body.choiceOptionsJson,
		loginUser: req.body.loginUser
	};

	service.change(data, (result) => {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			res.json({
				err: false,
				code: result.code,
				msg: result.msg
			});
		}
	});
});

router.delete('/custom/choice/delete', function(req, res, next) {
	let service = new commonService.commonInvoke('deleteCustomKnowledgeChoiceExercises');
	let technologyID = req.query.technologyID;
	let knowledgeID = req.query.knowledgeID;
	let exercisesID = req.query.exercisesID;
	let teacherID = req.query.teacherID;
	let parameter = `${technologyID}/${knowledgeID}/${exercisesID}/${teacherID}`;

	service.delete(parameter, function(result) {
			if (result.err) {
					res.json({
							err: true,
							code: result.code,
							msg: result.msg
					});
			} else {
					res.json({
							err: false,
							code: result.code,
							msg: result.msg
					});
			}
	});
});
//#endregion

//#region 自定义题库（填空题）

router.get('/custom/blank/list', function (req, res, next) {
	let service = new commonService.commonInvoke('customKnowledgeBlankExercisesList');
	let pageNumber = req.query.pageNumber;
	let pageSize = sysConfig.pageSize.ten;
	let technologyID = req.query.technologyID;
	let knowledgeID = req.query.knowledgeID;
	let teacherID = req.query.teacherID;
	let parameter = `${pageNumber}/${pageSize}/${technologyID}/${knowledgeID}/${teacherID}`;

	service.queryWithParameter(parameter, function (result) {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			if (result.content.totalCount > 0 && Array.isArray(result.content.responseData)) {
				result.content.responseData.forEach((data) => {
					data.exercisesTitleHtml = markdownService.convertToHtml(data.exercisesTitle);
				});
			}
			let dataContent = commonService.buildRenderData('知识点练习（填空题）', pageNumber, pageSize, result);
			res.json({
				err: false,
				code: result.code,
				msg: result.msg,
				dataContent: dataContent
			});
		}
	});
});

router.post('/custom/blank/add', function (req, res, next) {
	let service = new commonService.commonInvoke('addCustomKnowledgeBlankExercises');
	let data = {
		universityCode: req.body.universityCode,
		schoolID: req.body.schoolID,
		teacherID: req.body.teacherID,
		technologyID: req.body.technologyID,
		knowledgeID: req.body.knowledgeID,
		exercisesTitle: req.body.exercisesTitle,
		rightAnswer: req.body.rightAnswer,
		loginUser: req.body.loginUser
	};

	service.create(data, (result) => {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			res.json({
				err: false,
				code: result.code,
				msg: result.msg,
				exercisesID: result.content.responseData
			});
		}
	});
});

router.put('/custom/blank/change', function (req, res, next) {
	let service = new commonService.commonInvoke('changeCustomKnowledgeBlankExercises');
	let data = {
		exercisesID: req.body.exercisesID,
		universityCode: req.body.universityCode,
		schoolID: req.body.schoolID,
		teacherID: req.body.teacherID,
		technologyID: req.body.technologyID,
		knowledgeID: req.body.knowledgeID,
		exercisesTitle: req.body.exercisesTitle,
		rightAnswer: req.body.rightAnswer,
		loginUser: req.body.loginUser
	};

	service.change(data, (result) => {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			res.json({
				err: false,
				code: result.code,
				msg: result.msg
			});
		}
	});
});

router.delete('/custom/blank/delete', function(req, res, next) {
	let service = new commonService.commonInvoke('deleteCustomKnowledgeBlankExercises');
	let technologyID = req.query.technologyID;
	let knowledgeID = req.query.knowledgeID;
	let exercisesID = req.query.exercisesID;
	let teacherID = req.query.teacherID;
	let parameter = `${technologyID}/${knowledgeID}/${exercisesID}/${teacherID}`;

	service.delete(parameter, function(result) {
			if (result.err) {
					res.json({
							err: true,
							code: result.code,
							msg: result.msg
					});
			} else {
					res.json({
							err: false,
							code: result.code,
							msg: result.msg
					});
			}
	});
});

//#endregion

//#region 自定义题库（编程题）
router.get('/custom/program/list', function (req, res, next) {
	let service = new commonService.commonInvoke('customKnowledgeProgramExercisesList');
	let pageNumber = req.query.pageNumber;
	let pageSize = sysConfig.pageSize.ten;
	let technologyID = req.query.technologyID;
	let knowledgeID = req.query.knowledgeID;
	let teacherID = req.query.teacherID;
	let parameter = `${pageNumber}/${pageSize}/${technologyID}/${knowledgeID}/${teacherID}`;

	service.queryWithParameter(parameter, function (result) {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			if (result.content.totalCount > 0 && Array.isArray(result.content.responseData)) {
				result.content.responseData.forEach((data) => {
					data.exercisesTitleHtml = markdownService.convertToHtml(data.exercisesTitle);
				});
			}
			let dataContent = commonService.buildRenderData('知识点练习（编程题）', pageNumber, pageSize, result);
			res.json({
				err: false,
				code: result.code,
				msg: result.msg,
				dataContent: dataContent
			});
		}
	});
});

router.post('/custom/program/add', function (req, res, next) {
	let service = new commonService.commonInvoke('addCustomKnowledgeProgramExercises');
	let data = {
		universityCode: req.body.universityCode,
		schoolID: req.body.schoolID,
		teacherID: req.body.teacherID,
		technologyID: req.body.technologyID,
		knowledgeID: req.body.knowledgeID,
		exercisesTitle: req.body.exercisesTitle,
		rightAnswer: req.body.rightAnswer,
		loginUser: req.body.loginUser
	};

	service.create(data, (result) => {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			res.json({
				err: false,
				code: result.code,
				msg: result.msg,
				exercisesID: result.content.responseData
			});
		}
	});
});

router.put('/custom/program/change', function (req, res, next) {
	let service = new commonService.commonInvoke('changeCustomKnowledgeProgramExercises');
	let data = {
		exercisesID: req.body.exercisesID,
		universityCode: req.body.universityCode,
		schoolID: req.body.schoolID,
		teacherID: req.body.teacherID,
		technologyID: req.body.technologyID,
		knowledgeID: req.body.knowledgeID,
		exercisesTitle: req.body.exercisesTitle,
		rightAnswer: req.body.rightAnswer,
		loginUser: req.body.loginUser
	};

	service.change(data, (result) => {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			res.json({
				err: false,
				code: result.code,
				msg: result.msg
			});
		}
	});
});

router.delete('/custom/program/delete', function(req, res, next) {
	let service = new commonService.commonInvoke('deleteCustomKnowledgeProgramExercises');
	let technologyID = req.query.technologyID;
	let knowledgeID = req.query.knowledgeID;
	let exercisesID = req.query.exercisesID;
	let teacherID = req.query.teacherID;
	let parameter = `${technologyID}/${knowledgeID}/${exercisesID}/${teacherID}`;

	service.delete(parameter, function(result) {
			if (result.err) {
					res.json({
							err: true,
							code: result.code,
							msg: result.msg
					});
			} else {
					res.json({
							err: false,
							code: result.code,
							msg: result.msg
					});
			}
	});
});

//#endregion

//#region 
router.get('/info', function (req, res, next) {
	let service = new commonService.commonInvoke('searchKnowledgeById');
	let technologyID = req.query.technologyID;
	let knowledgeID = req.query.knowledgeID;
	let parameter = `${technologyID}/${knowledgeID}`;

	service.queryWithParameter(parameter, function (result) {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			res.json({
				err: false,
				code: result.code,
				msg: result.msg,
				knowledgeInfo: result.content.responseData
			});
		}
	});
});
//#endregion
module.exports = router;