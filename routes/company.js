let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('company', { title: '合作企业' });
});

router.get('/list', (req, res, next) => {
  let service = new commonService.commonInvoke('company');

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
        dataList: result.content.responseData
      });
    }
  });
});

router.get('/technology', (req, res, next) => {
  let service = new commonService.commonInvoke('companyUsingTechnology');
  let companyID = req.query.companyID;

  service.queryWithParameter(companyID,  (result) => {
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

router.get('/knowledge', (req, res, next) => {
  let service = new commonService.commonInvoke('companyUsingKnowledge');
  let companyID = req.query.companyID;
  let technologyID = req.query.technologyID;
  let parameter = `${companyID}/${technologyID}`;

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

module.exports = router;
