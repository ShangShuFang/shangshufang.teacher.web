let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let markdownService = require('../service/markdownService');
let commonService = require('../service/commonService');

router.get('/', function (req, res, next) {
	res.render('knowledgeExercises4Student', {
		title: '学生随堂练习',
		courseExercisesID: req.query.courseExercisesID
	});
});

router.get('/data', function (req, res, next) {
	let service = new commonService.commonInvoke('studentCourseExercises');
	let courseExercisesID = req.query.courseExercisesID;

	service.queryWithParameter(courseExercisesID, function (result) {
		if (result.err) {
			res.json({
				err: true,
				code: result.code,
				msg: result.msg
			});
		} else {
			if (result.content.responseData !== null) {
				result.content.responseData.singleChoiceExercisesList.forEach((data) => {
					data.exercisesTitleHtml = markdownService.convertToHtml(data.exercisesTitle);
				});
				result.content.responseData.multipleChoiceExercisesList.forEach((data) => {
					data.exercisesTitleHtml = markdownService.convertToHtml(data.exercisesTitle);
				});
				result.content.responseData.blankExercisesList.forEach((data) => {
					data.exercisesTitleHtml = markdownService.convertToHtml(data.exercisesTitle);
				});
				result.content.responseData.programExercisesList.forEach((data) => {
					data.sourceCodeUrl = data.submitSourceCodeUrl
					data.originalSourceCodeUrl = data.submitSourceCodeUrl;
					if (data.exercisesSourceType === 0) {
						data.exercisesDocUri = data.exercisesTitle;
						data.exercisesTitle = data.exercisesTitle.substr(data.exercisesTitle.lastIndexOf('/') + 1);
					} else {
						data.exercisesTitleHtml = markdownService.convertToHtml(data.exercisesTitle);
					}
				});
			}
			res.json({
				err: false,
				code: result.code,
				msg: result.msg,
				courseExercises: result.content.responseData
			});
		}
	});
});

module.exports = router;