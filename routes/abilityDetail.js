let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
    res.render('abilityDetail', {
        title: '学生专业能力分析',
        universityCode: req.query.universityCode,
        schoolID: req.query.schoolID,
        studentID: req.query.studentID,
    });
});

router.get('/studentInfo', (req, res, next) => {
    let service = new commonService.commonInvoke('studentAbilityResultSummary');
    let studentID = req.query.studentID;

    service.queryWithParameter(studentID, (result) => {
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
                studentInfo: result.content.responseData
            });
        }
    });
});

router.get('/learningTechnology', (req, res, next) => {
    let service = new commonService.commonInvoke('studentLearningTechnology');
    let studentID = req.query.studentID;

    service.queryWithParameter(studentID, (result) => {
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
                list: result.content.responseData
            });
        }
    });
});

router.get('/technologyAnalysis', (req, res, next) => {
    let service = new commonService.commonInvoke('studentAbility4Technology');
    let studentUniversityCode = req.query.studentUniversityCode;
    let studentSchoolID = req.query.studentSchoolID;
    let studentID = req.query.studentID;
    let technologyID = req.query.technologyID;
    let parameter = `${studentUniversityCode}/${studentSchoolID}/${studentID}/${technologyID}`;

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
                data: result.content.responseData
            });
        }
    });
});

router.get('/knowledgeAnalysis', (req, res, next) => {
    let service = new commonService.commonInvoke('studentAbility4knowledge');
    let studentID = req.query.studentID;
    let technologyID = req.query.technologyID;
    let parameter = `${studentID}/${technologyID}`;

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
                data: result.content.responseData
            });
        }
    });
});

router.get('/codeStandardAnalysis', (req, res, next) => {
    let service = new commonService.commonInvoke('studentAbility4codeStandard');
    let studentID = req.query.studentID;
    let languageID = req.query.languageID;
    let parameter = `${studentID}/${languageID}`;

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

router.get('/exerciseAnalysis', (req, res, next) => {
    let service = new commonService.commonInvoke('exerciseAnalysis');
    let studentUniversityCode = req.query.studentUniversityCode;
    let studentSchoolID = req.query.studentSchoolID;
    let studentID = req.query.studentID;
    let technologyID = req.query.technologyID;
    let parameter = `${studentUniversityCode}/${studentSchoolID}/${studentID}/${technologyID}`;

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

router.get('/exercisePercentAnalysis', (req, res, next) => {
    let service = new commonService.commonInvoke('exercisePercentAnalysis');
    let studentUniversityCode = req.query.studentUniversityCode;
    let studentSchoolID = req.query.studentSchoolID;
    let studentID = req.query.studentID;
    let technologyID = req.query.technologyID;
    let parameter = `${studentUniversityCode}/${studentSchoolID}/${studentID}/${technologyID}`;

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

router.get('/knowledge/finish', (req, res, next) => {
    let service = new commonService.commonInvoke('finishKnowledgeList');
    let pageNumber = req.query.pageNumber;
    let pageSize = sysConfig.pageSize.all;
    let studentID = req.query.studentID;
    let technologyID = req.query.technologyID;
    let parameter = `${pageNumber}/${pageSize}/${studentID}/${technologyID}`;

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
                list: result.content.responseData
            });
        }
    });
});

router.get('/knowledge/noLearning', (req, res, next) => {
    let service = new commonService.commonInvoke('noLearningKnowledgeList');
    let pageNumber = req.query.pageNumber;
    let pageSize = sysConfig.pageSize.all;
    let studentID = req.query.studentID;
    let technologyID = req.query.technologyID;
    let parameter = `${pageNumber}/${pageSize}/${studentID}/${technologyID}`;

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
                list: result.content.responseData
            });
        }
    });
});

router.get('/knowledge/weak', (req, res, next) => {
    let service = new commonService.commonInvoke('weaknessKnowledgeList');
    let pageNumber = req.query.pageNumber;
    let pageSize = sysConfig.pageSize.all;
    let studentID = req.query.studentID;
    let technologyID = req.query.technologyID;
    let parameter = `${pageNumber}/${pageSize}/${studentID}/${technologyID}`;

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
                list: result.content.responseData
            });
        }
    });
});

module.exports = router;