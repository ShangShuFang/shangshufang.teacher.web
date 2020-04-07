let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('abilityAnalysis', { title: '学生专业能力分析' });
});

router.get('/technologySimple', (req, res, next) => {
  let service = new commonService.commonInvoke('technologySimple');

  service.queryWithParameter('',  (result) => {
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
        dataList: result.content.responseData
      });
    }
  });
});

router.get('/data', function(req, res, next) {
  let service = new commonService.commonInvoke('studentAbilityAnalysis');
  let pageNumber = parseInt(req.query.pageNumber);

  let technologyID = req.query.technologyID;
  let studentUniversityCode = req.query.studentUniversityCode;
  let studentSchoolID = req.query.studentSchoolID;

  let teacherUniversityCode = req.query.teacherUniversityCode;
  let teacherSchoolID = req.query.teacherSchoolID;

  let teacherID = req.query.teacherID;
  let cellphone = req.query.cellphone;

  let parameter = `${pageNumber}/${sysConfig.abilityAnalysisPageSize}/${technologyID}/${studentUniversityCode}/${studentSchoolID}/${teacherUniversityCode}/${teacherSchoolID}/${teacherID}/${cellphone}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('学生专业能力分析', pageNumber, sysConfig.abilityAnalysisPageSize, result);
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
