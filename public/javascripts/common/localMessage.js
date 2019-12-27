const localMessage = {};
localMessage.NETWORK_ERROR = '网络异常，请检查网络设置';
localMessage.NO_ACCOUNT = '您输入的用户名或密码不存在！';

localMessage.UPLOAD_SUCCESS = '文件上传成功！';
localMessage.SAVE_SUCCESS = '数据保存成功！';
localMessage.DELETE_SUCCESS = '数据删除成功！';
localMessage.NO_USING_LEARNING_PHASE = '未查询到该技术的学习路径！';
localMessage.NO_USING_KNOWLEDGE = '未查询到该学习路径的知识点！';

localMessage.EXERCISES_TYPE_SINGLE_INVALID = '单点练习只能选择一个技术的一个学习阶段的内容！';
localMessage.EXERCISES_TYPE_COMPREHENSIVE_INVALID = '综合练习只能选择一个技术的内容！';

localMessage.EXERCISES_CODE_SINGLE_FORMAT_INVALID = '单点练习的习题编码格式不正确！';
localMessage.EXERCISES_CODE_COMPREHENSIVE_FORMAT_INVALID = '综合练习的习题编码格式不正确！';
localMessage.EXERCISES_CODE_PROJECT_FORMAT_INVALID = '项目练习的习题编码格式不正确！';
localMessage.EXERCISES_CODE_INVALID = '您输入的习题编码已存在！';
localMessage.PARAMETER_ERROR = '参数错误，未能读取到对应参数，无法继续操作！';

localMessage.ACCOUNT_WAITING = '您的账户正在等待所在院校的管理员审批，审批通过后方可登陆。';
localMessage.ACCOUNT_NO_PASS = '您的账户审批未通过，请联系所在院校的管理员。';
localMessage.ACCOUNT_DISABLED = '您的账户已被冻结，请联系所在院校的管理员或我公司客服。';

localMessage.CELLPHONE_INVALID = '您输入的内容不是有效的手机号码。';
localMessage.CELLPHONE_REGISTERED = '您输入的手机号码已注册。';
localMessage.VERIFICATION_CODE_INVALID = '您输入的验证码不正确。';


localMessage.formatMessage = function (code, msg) {
  return `<strong>抱歉，系统发生异常，请联系我们</strong> </br>状态码:&nbsp ${code} </br> 详细信息:&nbsp ${msg}`;
};