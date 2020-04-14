let express = require('express');
let router = express.Router();
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('suggest', { title: '意见反馈' });
});

router.get('/suggestType', (req, res, next) => {
  let service = new commonService.commonInvoke('suggestType');
  let portal = 'T';

    service.queryWithParameter(portal,  (result) => {
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

router.post('/', (req, res, next) => {
  let service = new commonService.commonInvoke('addSuggest');
  let data = {
    suggestTypeID: req.body.suggestTypeID,
    suggestContent: req.body.suggestContent,
    cellphone: req.body.cellphone,
    portal: 'T',
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
