let express = require('express');
let router = express.Router();
let dateUtils = require('../common/dateUtils');
let smsUtils = require('../common/smsUtils');
let commonService = require('../service/commonService');
let sysConfig = require('../config/sysConfig.json');

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
  let service = new commonService.commonInvoke('universityList');
  let parameter = '1/9999/0/0/A';

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
  let service = new commonService.commonInvoke('schoolList');
  let universityCode = req.query.universityCode;
  let parameter = `1/9999/${universityCode}/A`;

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
  let parameter = `1/${req.query.maxCount}/0/0/A`;

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
        totalCount: result.content.totalCount,
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
  let service = new commonService.commonInvoke('knowledgeSimpleList');
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

router.get('/direction/list', (req, res, next) => {
  let service = new commonService.commonInvoke('directionList');
  let parameter = `1/9999/A`;

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

router.get('/technology/category/list', (req, res, next) => {
  const service = new commonService.commonInvoke('technologyCategoryList');
  const parameter = `1/9999/${req.query.directionID}/A`;

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

router.post('/businessAnalyseLog', (req, res, next) => {
  let service = new commonService.commonInvoke('businessAnalyseLog');
  let data = {
    cityIP: req.body.cityIP,
    cityID: req.body.cityID,
    cityName: req.body.cityName,
    browser: req.body.browser,
    portal: req.body.portal,
    device: req.body.device,
    pageName: req.body.pageName,
    operationName: req.body.operationName,
    operationResult: req.body.operationResult,
    operationType: req.body.operationType,
    memo: req.body.memo,
    customerID: req.body.customerID
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
  let service = new commonService.commonInvoke('checkVerificationCode');
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
  let cellphone = req.body.cellphone;
  let code = req.body.verificationCode;
  smsUtils.sendVerificationCode(cellphone, code, (response) => {
    //保存调用日志
    let service = new commonService.commonInvoke('addThirdPartyService');
    let data = {
      serviceType: sysConfig.thirdPartyService.aliSms,
      requestContent: JSON.stringify(response.reqContent),
      responseContent: JSON.stringify(response.resContent),
      result: response.result? 'Y' : 'N'
    };
    service.create(data, (result) => {
      if(result.err){
        res.json({
          err: true,
          code: result.code,
          msg: result.msg
        });
      }else{
        if (response.result) {
          //保存发送的验证码
          let service = new commonService.commonInvoke('addVerificationCode');
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
        } else {
          res.json({
            err: true,
            code: '2C99',
            msg: `验证码发送失败，原因：${response.resContent.message}`
          });
        }
      }
    });
  })
});

router.post('/tracking', (req, res, next) => {
  let service = new commonService.commonInvoke('addUserTracking');
  let data = {
    cityIP: req.body.cityIP,
    cityID: req.body.cityID,
    cityName: req.body.cityName,
    customer: req.body.customer,
    device: req.body.device,
    browser: req.body.browser,
    systemID: req.body.systemID,
    viewID: req.body.viewID
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
