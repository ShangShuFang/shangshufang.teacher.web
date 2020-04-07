let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('index', { title: '开课中心' });
});

router.get('/technologyList', (req, res, next) => {
  let service = new commonService.commonInvoke('technologyList');
  let pageNumber = parseInt(req.query.pageNumber);

  let parameter = `${pageNumber}/${sysConfig.technologyPageSize}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('热门技术', pageNumber, sysConfig.pageSize, result);
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
