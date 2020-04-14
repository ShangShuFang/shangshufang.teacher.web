let express = require('express');
let router = express.Router();
let commonService = require('../service/commonService');
let Constants = require('../constant/Constants');

router.get('/', function(req, res, next) {
  let backUrl = req.query.backUrl;
  res.render('user', { title: '上书房智慧教育 用户信息修改 教师端', backUrl: backUrl, layout: null });
});

router.put('/', (req, res, next) => {
  let service = new commonService.commonInvoke('changeTeacher');
  let data = {
    universityCode: req.body.universityCode,
    schoolID: req.body.schoolID,
    customerID: req.body.customerID,
    accountID: req.body.accountID,
    fullName: req.body.fullName,
    sex: req.body.sex,
    birth: req.body.birth,
    cellphone: req.body.cellphone,
    email: req.body.email,
    photo: req.body.photo,
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
