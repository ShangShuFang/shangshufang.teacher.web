let express = require('express');
let router = express.Router();
let commonService = require('../service/commonService');
let Constants = require('../constant/Constants');

router.get('/', function(req, res, next) {
  res.render('forgetPassword', { title: '忘记密码 上书房智慧教育教师端', layout: null });
});


module.exports = router;
