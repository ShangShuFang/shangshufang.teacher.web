let bizLogger = {};
bizLogger.logInfo = function (pageName, operation, memo) {
  let ipAddress = commonUtility.getIpAddress();
  let browser = commonUtility.getBrowserName();
  let device = commonUtility.getDeviceName();
  let portal = 'T';
  let loginUser = commonUtility.isLogin() ? commonUtility.getLoginUser().customerID : 0;

  $.post('common/businessAnalyseLog',
    {
      cityIP: ipAddress.city_ip,
      cityID: ipAddress.city_id,
      cityName: ipAddress.city_name,
      browser: browser,
      portal: portal,
      device: device,
      pageName: pageName,
      operation: operation,
      memo: memo,
      customerID: loginUser
    },
    function(data,status){
      //alert("数据：" + data + "\n状态：" + status);
    }
  )
};