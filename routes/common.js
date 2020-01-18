let express = require('express');
let router = express.Router();
let dateUtils = require('../common/dateUtils');
let commonService = require('../service/commonService');

router.get('/dateFormat', (req, res, next) => {
  let formatDate = dateUtils.formatGMT(req.query.utcDate);
  res.json({
    err: false,
    code: 1000,
    msg: 'UTC日期格式化成功',
    formatDate: formatDate
  });
});

router.get('/chinaRegion', (req, res, next) => {
  let service = new commonService.commonInvoke('chinaRegion');
  let parentCode = req.query.parentCode === undefined ? 0 : req.query.parentCode;

  service.queryWithParameter(parentCode,  (result) => {
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

router.get('/university', (req, res, next) => {
  let service = new commonService.commonInvoke('university');
  let parameter = '1/9999/0/0';

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
        dataList: result.content.responseData
      });
    }
  });
});

router.get('/school', (req, res, next) => {
  let service = new commonService.commonInvoke('school');
  let universityCode = req.query.universityCode;
  let parameter = `1/9999/${universityCode}`;

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
        dataList: result.content.responseData
      });
    }
  });
});

router.get('/company', (req, res, next) => {
  let service = new commonService.commonInvoke('company');
  let parameter = `1/9999/0/0`;

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
        dataList: result.content.responseData
      });
    }
  });
});

router.get('/technology', (req, res, next) => {
  let service = new commonService.commonInvoke('technology');
  let parameter = `1/9999`;

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
        dataList: result.content.responseData
      });
    }
  });
});

router.get('/knowledge', (req, res, next) => {
  let service = new commonService.commonInvoke('knowledge');
  let technologyID = req.query.technologyID;
  service.queryWithParameter(technologyID,  (result) => {
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

router.get('/direction', (req, res, next) => {
  let service = new commonService.commonInvoke('direction');
  let parameter = `1/9999`;

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
        dataList: result.content.responseData
      });
    }
  });
});

router.get('/learningPhase', (req, res, next) => {
  let service = new commonService.commonInvoke('learningPhase');

  service.queryWithParameter('',  (result) => {
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

router.get('/verificationCode/generate', (req, res, next) => {
  let chars = ['0','1','2','3','4','5','6','7','8','9'];
  let maxIndex = chars.length - 1;
  let code = "";
  for(let i = 0; i < 6 ; i ++) {
    let index = Math.ceil(Math.random() * maxIndex);
    code += chars[index];
  }
  res.json({code: code});
});

router.get('/verificationCode/check', (req, res, next) => {
  let service = new commonService.commonInvoke('verificationCode');
  let cellphone = req.query.cellphone;
  let code = req.query.code;
  let parameter = `${cellphone}/${code}`;

  service.queryWithParameter(parameter,  (result) => {
    if (result.err) {
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    } else {
      let checkResult = false;
      let checkResultMessage = '您输入的验证码不正确';
      if(result.content.responseData !== null){
        let createTime = result.content.responseData.createTime;
        let now = dateUtils.currentTime();
        let expiredTime = dateUtils.addMinutes(createTime, 5);
        let compareResult = dateUtils.compare(Date.parse(expiredTime), Date.parse(now));
        if(compareResult < 0){
          checkResult = false;
          checkResultMessage = '您输入的验证码已过期';
        }else{
          checkResult = true;
          checkResultMessage = '验证码输入正确';
        }
      }
      res.json({
        err: false,
        code: result.code,
        msg: checkResultMessage,
        result: checkResult
      });
    }
  });
});

router.post('/verificationCode/send', function (req, res, next) {
  //todo 调用阿里云，发送手机验证码
  let service = new commonService.commonInvoke('verificationCode');
  let data = {
    systemFunction: req.body.systemFunction,
    cellphone: req.body.cellphone,
    code: req.body.verificationCode
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
