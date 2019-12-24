const Constants = {};
Constants.PAGE_SIZE = 10;
Constants.PROVINCE_LEVEL_MUNICIPALITY = ['北京', '天津', '上海', '重庆'];
Constants.CHECK_INVALID = {
  DEFAULT: -1,
  VALID: 0,
  INVALID: 1
};
Constants.DATA_STATUS = {
  ACTIVE: 'A',
  DISABLED: 'D'
};
Constants.ACCOUNT_STATUS = {
  WAITING: 'P',
  ACTIVE: 'A',
  NO_PASS: 'N',
  DISABLED: 'D',
};
Constants.COOKIE_LOGIN_USER = 'shs.teacher.user';
Constants.UPLOAD_SERVICE_URI='http://localhost:8000/upload';

Constants.KEY_OPTION_EXERCISES = 'shs.teacher.exercises.option';
Constants.KEY_OPTION_ADD = 'add';
Constants.KEY_OPTION_UPLOAD = 'upd';

Constants.KEY_UPD_EXERCISES = 'shs.teacher.upd.exercises';
Constants.KEY_UPLOAD_EXERCISES = 'shs.teacher.upload.exercises';