let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('growUpTrack', { title: '学生能力成长轨迹' });
});

module.exports = router;
