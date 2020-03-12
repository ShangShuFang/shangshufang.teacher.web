let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('abilityAnalysisList', { title: '学生专业能力分析' });
});

module.exports = router;
