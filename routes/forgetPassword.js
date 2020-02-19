let express = require('express');
let router = express.Router();
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('forgetPassword', { title: '忘记密码-上书房智慧教育教师端', layout: null });
});

router.get('/checkCellphone', function(req, res, next) {
  let service = new commonService.commonInvoke('checkChangePasswordCellphone');
  let cellphone = req.query.cellphone;

  service.queryWithParameter(cellphone, function (result) {
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
        result: result.content.responseData
      });
    }
  });
});

router.put('/changePassword', (req, res, next) => {
  let service = new commonService.commonInvoke('changePassword');
  let data = {
    cellphone: req.body.cellphone,
    password: req.body.password,
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
