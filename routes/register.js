let express = require('express');
let router = express.Router();
let commonService = require('../service/commonService');
let Constants = require('../constant/Constants');

router.get('/', function(req, res, next) {
  res.render('register', { title: '账户注册 上书房智慧教育教师端', layout: null });
});

router.get('/checkCellphone', function(req, res, next) {
  let service = new commonService.commonInvoke('checkUniversityAccountCellphone');
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

router.post('/', (req, res, next) => {
  let service = new commonService.commonInvoke('universityAccount');
  let data = {
    universityCode: req.body.universityCode,
    schoolID: req.body.schoolID,
    fullName: req.body.fullName,
    cellphone: req.body.cellphone,
    password: req.body.password,
    accountRole: Constants.ACCOUNT_ROLE.TEACHER,
    dataStatus: Constants.ACCOUNT_WAITING,
    loginUser: 1
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
