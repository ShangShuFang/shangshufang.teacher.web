let express = require('express');
let router = express.Router();
let commonService = require('../service/commonService');
let Constants = require('../constant/Constants');

router.get('/', function(req, res, next) {
  let backUrl = req.query.backUrl;
  res.render('login', { title: '系统登陆 上书房智慧教育教师端', backUrl: backUrl, layout: null });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('login');
  let param =`${req.body.cellphone}/${req.body.password}/${Constants.ACCOUNT_ROLE.TEACHER}`;

  service.queryWithParameter(param, function (result) {
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
        msg: result.msg,
        teacherInfo: result.content.responseData
      });
    }
  })
});

module.exports = router;
