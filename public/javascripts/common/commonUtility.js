let commonUtility = {};
commonUtility.setNavActive = function () {
  let pathname = window.location.pathname;
  let linkObj = {};

  if(pathname.includes('index')){
    linkObj = $('#kt_aside_menu_wrapper ul.kt-menu__nav li a[href="/index"]');
    linkObj.parent().addClass('kt-menu__item--active');
    return false;
  }
  if(pathname.includes('softwareExercises')){
    pathname = '/softwareExercises';
  }

  linkObj = $(`#kt_aside_menu_wrapper ul.kt-menu__nav li a[href="${pathname}"]`);
  linkObj.parent().addClass('kt-menu__item--active');
  linkObj.parent().parent().parent().parent().addClass('kt-menu__item--open');
};

commonUtility.isEmpty = function (value) {
  return value === '' || value === undefined;
};

commonUtility.isEmptyList = function (list) {
  return list === null || list.length === 0;
};

commonUtility.setCookie = function (name, value) {
  let days = 30;
  let exp = new Date();
  exp.setTime(exp.getTime() + days*24*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};

commonUtility.getCookie = function (name) {
  let reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  let arr = document.cookie.match(reg);
  if(arr === null){
    return null;
  }
  return unescape(arr[2]);
};

commonUtility.delCookie = function (name) {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cookieName = this.getCookie(name);
  if(cookieName !== null)
    document.cookie= name + "=" + cookieName + ";expires=" + exp.toGMTString();
};

commonUtility.getLoginUser = function () {
  let cookie = this.getCookie(Constants.COOKIE_LOGIN_USER);
  if(cookie === null){
    location.href = '/';
  }
  return JSON.parse(cookie);
};

commonUtility.buildUniversityUploadRemoteUri = function (serviceUrl, universityCode, dirName) {
  let systemName = 'shs';
  return `${serviceUrl}?system=${systemName}&customer=university&universityCode=${universityCode}&dirName=${dirName}`;
};

commonUtility.buildEnterpriseUploadRemoteUri = function (serviceUrl, companyName, dirName) {
  let systemName = 'shs';
  return `${serviceUrl}?system=${systemName}&customer=enterprise&companyName=${companyName}&dirName=${dirName}`;
};

commonUtility.buildSystemRemoteUri = function (serviceUrl, dirJson) {
  let systemName = 'shs';
  let remoteUri = `${serviceUrl}?system=${systemName}`;
  for (let key in dirJson) {
    remoteUri += `&${key}=${dirJson[key]}`;
  }
  return remoteUri;
};

commonUtility.isCellphoneNumber = function (cellphone) {
  let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
  if(!reg.test(cellphone)){
    return false;
  }
  return true;
};

commonUtility.isLogin = function () {
  let login_cookie = commonUtility.getCookie(Constants.COOKIE_LOGIN_USER);
  return login_cookie !== null;
};