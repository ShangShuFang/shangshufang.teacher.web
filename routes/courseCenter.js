let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
    res.render('courseCenter', { title: '开课中心' });
});

router.get('/technologyList', (req, res, next) => {
    const service = new commonService.commonInvoke('technologyList');
    const pageSize = sysConfig.pageSize.sixteen;
    const parameter = `${req.query.pageNumber}/${pageSize}/${req.query.directionID}/${req.query.categoryID}`;

    service.queryWithParameter(parameter, (result) => {
        if (result.err) {
            res.json({
                err: true,
                code: result.code,
                msg: result.msg
            });
        } else {
            let dataContent = commonService.buildRenderData('热门技术', req.query.pageNumber, pageSize, result);
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