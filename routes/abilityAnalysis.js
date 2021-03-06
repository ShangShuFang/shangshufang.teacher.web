let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
    res.render('abilityAnalysis', { title: '学生专业能力分析' });
});

router.get('/technologySimple', (req, res, next) => {
    let service = new commonService.commonInvoke('technologySimple');
    const directionID = req.query.directionID;
    const categoryID = req.query.categoryID;
    const dataStatus = 'A';
    const parameter = `${directionID}/${categoryID}/${dataStatus}`;

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
                totalCount: result.content.totalCount,
                dataList: result.content.responseData
            });
        }
    });
});

router.get('/data', function(req, res, next) {
    let service = new commonService.commonInvoke('studentAbilityList');
    let pageNumber = parseInt(req.query.pageNumber);
    let pageSize = sysConfig.pageSize.sixteen;
    let directionID = req.query.directionID;
    let categoryID = req.query.categoryID;
    let technologyID = req.query.technologyID;
    let universityCode = req.query.universityCode;
    let schoolID = req.query.schoolID;
    let studentName = req.query.studentName;
    let studentID = 0;

    let parameter = `${pageNumber}/${pageSize}/${directionID}/${categoryID}/${technologyID}/${universityCode}/${schoolID}/${studentName}/${studentID}`;

    service.queryWithParameter(parameter, (result) => {
        if (result.err) {
            res.json({
                err: true,
                code: result.code,
                msg: result.msg
            });
        } else {
            let dataContent = commonService.buildRenderData('学生专业能力分析', pageNumber, pageSize, result);
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