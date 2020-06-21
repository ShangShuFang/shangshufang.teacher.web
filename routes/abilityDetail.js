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
  let studentUniversityCode = req.query.studentUniversityCode;
  let studentSchoolID = req.query.studentSchoolID;
  let studentID = req.query.studentID;
  let parameter = `${studentUniversityCode}/${studentSchoolID}/${studentID}`;

  service.queryWithParameter(parameter,  (result) => {
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
  let service = new commonService.commonInvoke('studentLearningTechnologyAbilityResultSummary');
  let studentUniversityCode = req.query.studentUniversityCode;
  let studentSchoolID = req.query.studentSchoolID;
  let studentID = req.query.studentID;
  let parameter = `${studentUniversityCode}/${studentSchoolID}/${studentID}`;

  service.queryWithParameter(parameter,  (result) => {
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

  service.queryWithParameter(parameter,  (result) => {
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
  let studentUniversityCode = req.query.studentUniversityCode;
  let studentSchoolID = req.query.studentSchoolID;
  let studentID = req.query.studentID;
  let technologyID = req.query.technologyID;
  let parameter = `${studentUniversityCode}/${studentSchoolID}/${studentID}/${technologyID}`;

  service.queryWithParameter(parameter,  (result) => {
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
  let studentUniversityCode = req.query.studentUniversityCode;
  let studentSchoolID = req.query.studentSchoolID;
  let studentID = req.query.studentID;
  let languageID = req.query.languageID;
  let parameter = `${studentUniversityCode}/${studentSchoolID}/${studentID}/${languageID}`;

  service.queryWithParameter(parameter,  (result) => {
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

  service.queryWithParameter(parameter,  (result) => {
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

  service.queryWithParameter(parameter,  (result) => {
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
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let studentID = req.query.studentID;
  let technologyID = req.query.technologyID;
  let parameter = `${pageNumber}/${pageSize}/${universityCode}/${schoolID}/${studentID}/${technologyID}`;

  service.queryWithParameter(parameter,  (result) => {
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

router.get('/knowledge/learning', (req, res, next) => {
  let service = new commonService.commonInvoke('learningKnowledgeList');
  let pageNumber = req.query.pageNumber;
  let pageSize = sysConfig.pageSize.all;
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let studentID = req.query.studentID;
  let technologyID = req.query.technologyID;
  let parameter = `${pageNumber}/${pageSize}/${universityCode}/${schoolID}/${studentID}/${technologyID}`;

  service.queryWithParameter(parameter,  (result) => {
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
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let studentID = req.query.studentID;
  let technologyID = req.query.technologyID;
  let parameter = `${pageNumber}/${pageSize}/${universityCode}/${schoolID}/${studentID}/${technologyID}`;

  service.queryWithParameter(parameter,  (result) => {
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
  let service = new commonService.commonInvoke('weakKnowledgeList');
  let pageNumber = req.query.pageNumber;
  let pageSize = sysConfig.pageSize.all;
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let studentID = req.query.studentID;
  let technologyID = req.query.technologyID;
  let parameter = `${pageNumber}/${pageSize}/${universityCode}/${schoolID}/${studentID}/${technologyID}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('薄弱知识点列表', pageNumber, pageSize, result);
      res.json({
        err: false,
        code: result.code,
        msg: result.msg,
        totalCount: result.content.totalCount,
        dataContent: dataContent
      });
    }
  });
});

router.get('/exercise/list', (req, res, next) => {
  let service = new commonService.commonInvoke('studentExercisesList');
  let pageNumber = req.query.pageNumber;
  let pageSize = sysConfig.pageSize.ten;
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let studentID = req.query.studentID;
  let technologyID = req.query.technologyID;
  let dataStatus = req.query.dataStatus;
  let parameter = `${pageNumber}/${pageSize}/${universityCode}/${schoolID}/${studentID}/${technologyID}/${dataStatus}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('学生所有练习', pageNumber, pageSize, result);
      res.json({
        err: false,
        code: result.code,
        msg: result.msg,
        dataContent: dataContent
      });
    }
  });
});

module.exports = router;
