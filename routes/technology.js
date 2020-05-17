let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let Constants = require('../constant/Constants');
let parameterUtils = require('../common/parameterUtils');

router.get('/', function(req, res, next) {
  res.render('technology', { title: '技术明细', technologyID: req.query.technology });
});

router.get('/technologyInfo', (req, res, next) => {
  let service = new commonService.commonInvoke('technology');
  let technologyID = parseInt(req.query.technologyID);

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
        technologyInfo: result.content.responseData
      });
    }
  });
});

router.get('/knowledgeList', (req, res, next) => {
  let service = new commonService.commonInvoke('knowledgeList');
  let pageNumber = parameterUtils.processNumberParameter(req.query.pageNumber, Constants.PAGE_NUMBER_DEFAULT);
  let technologyID = parameterUtils.processNumberParameter(req.query.technologyID, Constants.TECHNOLOGY_DEFAULT_ID);

  let parameter = `${pageNumber}/${sysConfig.knowledgePageSize}/${technologyID}/0/${Constants.DATA_ACTIVE}`;

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

// router.get('/developmentDirections', function(req, res, next) {
//   let service = new commonService.commonInvoke('developmentDirections');
//   let technologyID = req.query.technologyID;
//
//   service.queryWithParameter(technologyID, function (result) {
//     if(result.err){
//       res.json({
//         err: true,
//         code: result.code,
//         msg: result.msg
//       });
//     }else{
//       res.json({
//         err: false,
//         code: result.code,
//         msg: result.msg,
//         directionList: result.content.responseData
//       });
//     }
//   });
// });

router.get('/courseSignUp', function(req, res, next) {
  let service = new commonService.commonInvoke('signUp4Technology');
  let pageNumber = parseInt(req.query.pageNumber);
  let technologyID = parameterUtils.processNumberParameter(req.query.technologyID, Constants.TECHNOLOGY_DEFAULT_ID);

  let parameter = `${pageNumber}/${sysConfig.pageSize}/${technologyID}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('报名学生', pageNumber, sysConfig.pageSize, result);
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
