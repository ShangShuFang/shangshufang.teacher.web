let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('courseDetail', { title: '课程明细' });
});

router.get('/exercises', function(req, res, next) {
  let service = new commonService.commonInvoke('exercises');
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let courseID = req.query.courseID;

  let parameter = `${universityCode}/${schoolID}/${courseID}`;

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
        exercisesList: result.content.responseData
      });
    }
  });
});

router.get('/courseSignUp', function(req, res, next) {
  let service = new commonService.commonInvoke('courseSignUp');
  let pageNumber = parseInt(req.query.pageNumber);
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let courseID = req.query.courseID;

  let parameter = `${pageNumber}/${sysConfig.pageSize}/${universityCode}/${schoolID}/${courseID}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('报名学生', pageNumber, result);
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
  let service = new commonService.commonInvoke('courseStudentSignUp');
  let pageNumber = parseInt(req.query.pageNumber);
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let studentID = req.query.studentID;

  let parameter = `${pageNumber}/${sysConfig.pageSize}/${universityCode}/${schoolID}/${studentID}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('报名课程', pageNumber, result);
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
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let courseID = req.query.courseID;
  let dataStatus = req.query.dataStatus;

  let parameter = `${pageNumber}/${sysConfig.pageSize}/${universityCode}/${schoolID}/${courseID}/${dataStatus}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('学生练习', pageNumber, result);
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

router.put('/delete', (req, res, next) => {
  let service = new commonService.commonInvoke('changeCourseStatus');
  let data = {
    universityCode: req.body.universityCode,
    schoolID: req.body.schoolID,
    teacherID: req.body.teacherID,
    courseID: req.body.courseID,
    dataStatus: 'D',
    loginUser: req.body.loginUser
  };

  service.change(data, (result) => {
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

router.post('/classExercises', (req, res, next) => {
  let service = new commonService.commonInvoke('classExercisesAssign');
  let data = {
    courseUniversityCode: req.body.universityCode,
    courseSchoolID: req.body.schoolID,
    courseID: req.body.courseID,
    courseClass: req.body.courseClass,
    assignCount: req.body.assignCount,
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
