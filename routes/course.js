let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let Constants = require('../constant/Constants');
let parameterUtils = require('../common/parameterUtils');

router.get('/', function(req, res, next) {
  res.render('course', { title: '创建课程' });
});

router.get('/learningPhase', (req, res, next) => {
  let service = new commonService.commonInvoke('usingLearningPhase');
  let technologyID = req.query.technologyID;

  service.queryWithParameter(technologyID,  (result) => {
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

router.get('/list', (req, res, next) => {
  let service = new commonService.commonInvoke('course');

  let pageNumber = req.query.pageNumber;
  let pageSize = parameterUtils.processNumberParameter(req.query.pageSize, sysConfig.pageSize);
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let teacherID = req.query.teacherID;
  let courseTimeBegin = req.query.courseTimeBegin;
  let dataStatus = req.query.dataStatus;

  let parameter = `${pageNumber}/${pageSize}/${universityCode}/${schoolID}/${teacherID}/${courseTimeBegin}/${dataStatus}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('课程列表', pageNumber, result);
      res.json({
        err: false,
        code: result.code,
        msg: result.msg,
        dataContent: dataContent
      });
    }
  });
});

router.get('/knowledgeList', (req, res, next) => {
  let service = new commonService.commonInvoke('knowledge');
  let technologyID = parameterUtils.processNumberParameter(req.query.technologyID, Constants.TECHNOLOGY_DEFAULT_ID);
  let learningPhaseID = parameterUtils.processNumberParameter(req.query.learningPhaseID, Constants.LEARNING_PHASE);

  let parameter = `1/9999/${technologyID}/${learningPhaseID}/${Constants.DATA_ACTIVE}`;

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
        knowledgeList: result.content.responseData
      });
    }
  });
});

router.get('/teacherList', (req, res, next) => {
  let service = new commonService.commonInvoke('teachers');
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let fullName = req.query.fullName;

  let parameter = `${universityCode}/${schoolID}/T/${fullName}`;

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
        teacherList: result.content.responseData
      });
    }
  });
});

router.get('/checkCourse', (req, res, next) => {
  let service = new commonService.commonInvoke('checkCourse');
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let courseName = req.query.courseName;
  let courseTimeBegin = req.query.courseTimeBegin;
  let courseTimeEnd = req.query.courseTimeEnd;

  let parameter = `${universityCode}/${schoolID}/${courseName}/${courseTimeBegin}/${courseTimeEnd}`;

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
        result: result.content.responseData
      });
    }
  });
});

router.post('/', (req, res, next) => {
  let service = new commonService.commonInvoke('course');
  let data = {
    universityCode: req.body.universityCode,
    schoolID: req.body.schoolID,
    technologyID: req.body.technologyID,
    courseName: req.body.courseName,
    teacherID: req.body.teacherID,
    courseTimeBegin: req.body.courseTimeBegin,
    courseTimeEnd: req.body.courseTimeEnd,
    courseIntroduction: req.body.courseIntroduction,
    courseScheduleJson: req.body.courseScheduleJson,
    coursePlanJson: req.body.coursePlanJson,
    loginUser: req.body.loginUser
  };

  service.create(data, (result) => {
    if(result.err){
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    }else{
      res.json({
        err: false,
        code: result.code,
        msg: result.msg
      });
    }
  });
});

module.exports = router;
