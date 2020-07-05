let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
    res.render('company', { title: '合作企业' });
});

router.get('/list', (req, res, next) => {
    let service = new commonService.commonInvoke('company');
    let pageNumber = req.query.pageNumber;
    let parameter = `${pageNumber}/${sysConfig.pageSize.sixteen}/0/0/A`;

    service.queryWithParameter(parameter, (result) => {
        if (result.err) {
            res.json({
                err: true,
                code: result.code,
                msg: result.msg
            });
        } else {
            let dataContent = commonService.buildRenderData('合作企业', pageNumber, sysConfig.pageSize.sixteen, result);
            res.json({
                err: false,
                code: result.code,
                msg: result.msg,
                dataContent: dataContent
            });
        }
    });
});

router.get('/technology/using', (req, res, next) => {
    let service = new commonService.commonInvoke('companyUsingTechnology');
    let companyID = req.query.companyID;

    service.queryWithParameter(companyID, (result) => {
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
                dataList: result.content.responseData
            });
        }
    });
});

router.get('/knowledge', (req, res, next) => {
    let service = new commonService.commonInvoke('companyUsingKnowledge');
    let companyID = req.query.companyID;
    let technologyID = req.query.technologyID;
    let parameter = `${companyID}/${technologyID}`;

    service.queryWithParameter(parameter, (result) => {
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
                dataList: result.content.responseData
            });
        }
    });
});

module.exports = router;