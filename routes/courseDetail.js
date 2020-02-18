let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('courseDetail', { title: '课程明细', tabIndex: req.query.tabIndex});
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

router.get('/courseStudentExercisesReview', function(req, res, next) {
  let service = new commonService.commonInvoke('classExercisesReview');
  let pageNumber = parseInt(req.query.pageNumber);
  let studentExercisesID = req.query.studentExercisesID;

  let parameter = `${pageNumber}/${sysConfig.pageSize}/${studentExercisesID}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('学生练习批改', pageNumber, result);
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
  let service = new commonService.commonInvoke('classExercisesReview');
  let pageNumber = parseInt(req.query.pageNumber);
  let studentExercisesID = req.query.studentExercisesID;

  let parameter = `${pageNumber}/${sysConfig.reviewHistory}/${studentExercisesID}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('批改历史', pageNumber, result);
      res.json({
        err: false,
        code: result.code,
        msg: result.msg,
        dataContent: dataContent
      });
    }
  });
});

router.get('/courseQuestion', function(req, res, next) {
  let service = new commonService.commonInvoke('courseQuestion');
  let pageNumber = parseInt(req.query.pageNumber);

  let courseUniversityCode = req.query.courseUniversityCode;
  let courseSchoolID = req.query.courseSchoolID;
  let courseID = req.query.courseID;

  let parameter = `${pageNumber}/${sysConfig.pageSize}/${courseUniversityCode}/${courseSchoolID}/${courseID}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('课程问题列表', pageNumber, result);
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

router.post('/exercisesReview', (req, res, next) => {
  let service = new commonService.commonInvoke('classExercisesReview');
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
    codeStandardsScore: req.body.codeStandardsScore,
    reviewResult: req.body.reviewResult,
    reviewMemo: req.body.reviewMemo,
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

router.post('/leaveMessage', (req, res, next) => {
  let service = new commonService.commonInvoke('courseQuestionLeaveMessage');
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

router.put('/exercisesReview', (req, res, next) => {
  let service = new commonService.commonInvoke('classExercisesReview');
  let data = {
    reviewID: req.body.reviewID,
    reviewerID: req.body.reviewerID,
    reviewerUniversityCode: req.body.reviewerUniversityCode,
    reviewerSchoolID: req.body.reviewerSchoolID,
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
