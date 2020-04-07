let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('approve', { title: '账户审批' });
});

router.get('/list', (req, res, next) => {
  let service = new commonService.commonInvoke('approveAccount');
  let pageNumber = req.query.pageNumber;
  let pageSize = sysConfig.pageSize;
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let accountID = req.query.accountID;
  let dataStatus = req.query.dataStatus;
  let accountRole = req.query.accountRole;
  let parameter = `${pageNumber}/${pageSize}/${universityCode}/${schoolID}/${accountID}/${dataStatus}/${accountRole}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('账户审批', pageNumber, sysConfig.pageSize, result);
      res.json({
        err: false,
        code: result.code,
        msg: result.msg,
        dataContent: dataContent
      });
    }
  });
});

router.get('/wait', (req, res, next) => {
  let service = new commonService.commonInvoke('waitApprove');

  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let teacherID = req.query.teacherID;
  let parameter = `${universityCode}/${schoolID}/${teacherID}`;

  service.queryWithParameter(parameter,  (result) => {
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
        totalCount: result.content.totalCount
      });
    }
  });
});


router.put('/status', (req, res, next) => {
  //todo 如果dataStatus为A，则发送通知短信
  let service = new commonService.commonInvoke('changeUniversityAccountStatus');
  let data = {
    accountID: req.body.accountID,
    universityCode: req.body.universityCode,
    schoolID: req.body.schoolID,
    customerID: req.body.customerID,
    studentID: req.body.studentID,
    accountRole: req.body.accountRole,
    dataStatus: req.body.status,
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
