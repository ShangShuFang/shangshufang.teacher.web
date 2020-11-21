let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
    res.render('courseDetail', { title: '课程明细', tabIndex: req.query.tabIndex });
});

router.get('/knowledgeExercises', function(req, res, next) {
    let service = new commonService.commonInvoke('knowledgeExercises');
    let universityCode = req.query.universityCode;
    let schoolID = req.query.schoolID;
    let courseID = req.query.courseID;

    let parameter = `${universityCode}/${schoolID}/${courseID}`;

    service.queryWithParameter(parameter, (result) => {
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
                totalCount: result.content.totalCount,
                courseExercisesList: result.content.responseData
            });
        }
    });
});

router.get('/courseSignUp', function(req, res, next) {
    let service = new commonService.commonInvoke('signUp4Student');
    let pageNumber = parseInt(req.query.pageNumber);
    let universityCode = req.query.universityCode;
    let schoolID = req.query.schoolID;
    let courseID = req.query.courseID;

    let parameter = `${pageNumber}/${sysConfig.pageSize.ten}/${universityCode}/${schoolID}/${courseID}`;

    service.queryWithParameter(parameter, (result) => {
        if (result.err) {
            res.json({
                err: true,
                code: result.code,
                msg: result.msg
            });
        } else {
            let dataContent = commonService.buildRenderData('报名学生', pageNumber, sysConfig.pageSize.ten, result);
            res.json({
                err: false,
                code: result.code,
                msg: result.msg,
                dataContent: dataContent
            });
        }
    });
});

router.get('/courseStudentSignUp', function(req, res, next) {
    let service = new commonService.commonInvoke('signUp4Course');
    let pageNumber = parseInt(req.query.pageNumber);
    let universityCode = req.query.universityCode;
    let schoolID = req.query.schoolID;
    let studentID = req.query.studentID;

    let parameter = `${pageNumber}/${sysConfig.pageSize.ten}/${universityCode}/${schoolID}/${studentID}`;

    service.queryWithParameter(parameter, (result) => {
        if (result.err) {
            res.json({
                err: true,
                code: result.code,
                msg: result.msg
            });
        } else {
            let dataContent = commonService.buildRenderData('报名课程', pageNumber, sysConfig.pageSize.ten, result);
            res.json({
                err: false,
                code: result.code,
                msg: result.msg,
                dataContent: dataContent
            });
        }
    });
});

router.get('/courseStudentExercises', function(req, res, next) {
    let service = new commonService.commonInvoke('classExercises');
    let pageNumber = parseInt(req.query.pageNumber);
    let courseID = req.query.courseID;
    let dataStatus = req.query.dataStatus;
    let studentName = req.query.studentName;

    let parameter = `${pageNumber}/${sysConfig.pageSize.ten}/${courseID}/${dataStatus}/${studentName}`;

    service.queryWithParameter(parameter, (result) => {
        if (result.err) {
            res.json({
                err: true,
                code: result.code,
                msg: result.msg
            });
        } else {
            let dataContent = commonService.buildRenderData('学生练习', pageNumber, sysConfig.pageSize.ten, result);
            res.json({
                err: false,
                code: result.code,
                msg: result.msg,
                dataContent: dataContent
            });
        }
    });
});

router.get('/knowledgeAnalyse', function(req, res, next) {
    let service = new commonService.commonInvoke('courseKnowledgeLearnAnalyse');
    let pageNumber = parseInt(req.query.pageNumber);
    let pageSize = sysConfig.pageSize.ten;
    let universityCode = req.query.universityCode;
    let schoolID = req.query.schoolID;
    let courseID = req.query.courseID;

    let parameter = `${pageNumber}/${pageSize}/${universityCode}/${schoolID}/${courseID}`;

    service.queryWithParameter(parameter, (result) => {
        if (result.err) {
            res.json({
                err: true,
                code: result.code,
                msg: result.msg
            });
        } else {
            let dataContent = commonService.buildRenderData('知识点掌握情况分析', pageNumber, pageSize, result);
            res.json({
                err: false,
                code: result.code,
                msg: result.msg,
                dataContent: dataContent
            });
        }
    });
});


router.get('/courseStudentExercisesReview', function(req, res, next) {
    let service = new commonService.commonInvoke('classExercisesReviewList');
    let pageNumber = parseInt(req.query.pageNumber);
    let studentExercisesID = req.query.studentExercisesID;

    let parameter = `${pageNumber}/${sysConfig.pageSize.ten}/${studentExercisesID}`;

    service.queryWithParameter(parameter, (result) => {
        if (result.err) {
            res.json({
                err: true,
                code: result.code,
                msg: result.msg
            });
        } else {
            let dataContent = commonService.buildRenderData('学生练习批改', pageNumber, sysConfig.pageSize.ten, result);
            res.json({
                err: false,
                code: result.code,
                msg: result.msg,
                dataContent: dataContent
            });
        }
    });
});

router.get('/exercisesReviewHistory', function(req, res, next) {
    let service = new commonService.commonInvoke('classExercisesReviewList');
    let pageNumber = parseInt(req.query.pageNumber);
    let studentExercisesID = req.query.studentExercisesID;

    let parameter = `${pageNumber}/${sysConfig.pageSize.five}/${studentExercisesID}`;

    service.queryWithParameter(parameter, (result) => {
        if (result.err) {
            res.json({
                err: true,
                code: result.code,
                msg: result.msg
            });
        } else {
            let dataContent = commonService.buildRenderData('批改历史', pageNumber, sysConfig.pageSize.five, result);
            res.json({
                err: false,
                code: result.code,
                msg: result.msg,
                dataContent: dataContent
            });
        }
    });
});

router.get('/codeStandard', function(req, res, next) {
    let service = new commonService.commonInvoke('codeStandard');
    let languageID = req.query.languageID;

    let parameter = `1/999/${languageID}`;

    service.queryWithParameter(parameter, (result) => {
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
                dataList: result.content.responseData
            });
        }
    });
});

router.get('/courseQuestion', function(req, res, next) {
    let service = new commonService.commonInvoke('courseQuestionList');
    let pageNumber = parseInt(req.query.pageNumber);

    let courseUniversityCode = req.query.courseUniversityCode;
    let courseSchoolID = req.query.courseSchoolID;
    let courseID = req.query.courseID;

    let parameter = `${pageNumber}/${sysConfig.pageSize.ten}/${courseUniversityCode}/${courseSchoolID}/${courseID}`;

    service.queryWithParameter(parameter, (result) => {
        if (result.err) {
            res.json({
                err: true,
                code: result.code,
                msg: result.msg
            });
        } else {
            let dataContent = commonService.buildRenderData('课程问题列表', pageNumber, sysConfig.pageSize.ten, result);
            res.json({
                err: false,
                code: result.code,
                msg: result.msg,
                dataContent: dataContent
            });
        }
    });
});

router.put('/courseBaseInfo', (req, res, next) => {
    let service = new commonService.commonInvoke('changeCourseBaseInfo');
    let data = {
        courseID: req.body.courseID,
        universityCode: req.body.universityCode,
        schoolID: req.body.schoolID,
        technologyID: req.body.technologyID,
        courseName: req.body.courseName,
        teacherID: req.body.teacherID,
        courseTimeBegin: req.body.courseTimeBegin,
        courseTimeEnd: req.body.courseTimeEnd,
        courseIntroduction: req.body.courseIntroduction,
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

router.put('/courseSchedule', (req, res, next) => {
    let service = new commonService.commonInvoke('changeCourseSchedule');
    let data = {
        courseID: req.body.courseID,
        universityCode: req.body.universityCode,
        schoolID: req.body.schoolID,
        courseScheduleJson: req.body.courseScheduleJson,
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

router.put('/coursePlan', (req, res, next) => {
    let service = new commonService.commonInvoke('changeCoursePlan');
    let data = {
        courseID: req.body.courseID,
        universityCode: req.body.universityCode,
        schoolID: req.body.schoolID,
        coursePlanJson: req.body.coursePlanJson,
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

router.put('/finish', (req, res, next) => {
    let service = new commonService.commonInvoke('changeCourseStatus');
    let data = {
        universityCode: req.body.universityCode,
        schoolID: req.body.schoolID,
        teacherID: req.body.teacherID,
        courseID: req.body.courseID,
        dataStatus: '2',
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

router.post('/classExercises', (req, res, next) => {
    let service = new commonService.commonInvoke('assignClassExercises');
    let data = {
        courseUniversityCode: req.body.universityCode,
        courseSchoolID: req.body.schoolID,
        courseID: req.body.courseID,
				courseClass: req.body.courseClass,
				teacherID: req.body.teacherID,
				containCompanyExercises: req.body.containCompanyExercises,
				containSelfExercises: req.body.containSelfExercises,
				containOtherExercises: req.body.containOtherExercises,
				maxChoiceCount: req.body.maxChoiceCount,
				maxBlankCount: req.body.maxBlankCount,
				maxProgramCount: req.body.maxProgramCount,
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
                msg: result.msg
            });
        }
    });
});

router.post('/exercisesReview', (req, res, next) => {
    let service = new commonService.commonInvoke('addClassExercisesReview');
    let data = {
        courseUniversityCode: req.body.courseUniversityCode,
        courseSchoolID: req.body.courseSchoolID,
        courseID: req.body.courseID,
        courseClass: req.body.courseClass,
        studentExercisesID: req.body.studentExercisesID,
        reviewerID: req.body.reviewerID,
        reviewerUniversityCode: req.body.reviewerUniversityCode,
        reviewerSchoolID: req.body.reviewerSchoolID,
        reviewerType: req.body.reviewerType,
        compilationResult: req.body.compilationResult,
        runResult: req.body.runResult,
        codeStandardResult: req.body.codeStandardResult,
        codeStandardErrorListJson: req.body.codeStandardErrorListJson,
        reviewResult: req.body.reviewResult,
        reviewMemo: req.body.reviewMemo,
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
                msg: result.msg
            });
        }
    });
});

router.post('/leaveMessage', (req, res, next) => {
    let service = new commonService.commonInvoke('addCourseQuestionLeaveMessage');
    let data = {
        questionID: req.body.questionID,
        commenterUniversityCode: req.body.commenterUniversityCode,
        commenterSchoolID: req.body.commenterSchoolID,
        commenterID: req.body.commenterID,
        commenterType: req.body.commenterType,
        messageContent: req.body.messageContent,
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
                msg: result.msg
            });
        }
    });
});

router.put('/finishClass', (req, res, next) => {
    let service = new commonService.commonInvoke('finishClass');
    let data = {
        universityCode: req.body.universityCode,
        schoolID: req.body.schoolID,
        courseID: req.body.courseID,
        courseClass: req.body.courseClass,
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

router.put('/exercisesReview', (req, res, next) => {
    let service = new commonService.commonInvoke('changeClassExercisesReview');
    let data = {
        reviewID: req.body.reviewID,
        reviewerID: req.body.reviewerID,
        reviewerUniversityCode: req.body.reviewerUniversityCode,
        reviewerSchoolID: req.body.reviewerSchoolID,
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

router.put('/changeAssistant', (req, res, next) => {
    let service = new commonService.commonInvoke('changeAssistant');
    let data = {
        studentID: req.body.studentID,
        courseUniversityCode: req.body.courseUniversityCode,
        courseSchoolID: req.body.courseSchoolID,
        courseID: req.body.courseID,
        assistant: req.body.assistant,
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

module.exports = router;