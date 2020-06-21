let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('growingMap', { title: '学习路线' });
});


router.get('/list', function(req, res, next) {
  const service = new commonService.commonInvoke('growingMapList');
  const pageNumber = 1;
  const pageSize = sysConfig.pageSize.all;
  const parameter = `${pageNumber}/${pageSize}`;

  service.queryWithParameter(parameter, function (result) {
    if(result.err){
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        code: result.code,
        msg: result.msg,
        dataList: result.content.responseData
      });
    }
  });
});

router.get('/any', function(req, res, next) {
  const service = new commonService.commonInvoke('growingMap');
  const growingID = req.query.growingID;

  service.queryWithParameter(growingID, function (result) {
    if(result.err){
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        code: result.code,
        msg: result.msg,
        detail: result.content.responseData
      });
    }
  });
});

router.get('/list/detail', function(req, res, next) {
  const service = new commonService.commonInvoke('growingMapDetail');
  const growingID = req.query.growingID;

  service.queryWithParameter(growingID, function (result) {
    if(result.err){
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        code: result.code,
        msg: result.msg,
        detail: result.content.responseData
      });
    }
  });
});

module.exports = router;
