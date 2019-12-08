
interface Api {
  [key: string]: any;
}
const api: Api = {
  // 用户
  user_reg:          'post./user/:registerCode',                    // 用户注册
  login:             'post./user',                                  // 登陆
  get_regCode:       'get./user/:codeType/:sendType/code',          // 获取注册所需的验证码
  check_code:        'get./user/checkCode/:code/:inputCode',        // 校验验证码是否正确
  reset_pwd:         'put./user/password/:resetPasswordCode',       // 重设密码
  user_check:        'get./user/check',                             // 检测账号是否存在

  // 反馈
  get_feedBack:      'get./notice/feedback/type',                   // 获取反馈类型
  user_feedBack:     'post./notice/feedback',                       // 用户反馈

  // 首页
  get_city:          'test1:get./public/city',                      // 获取城市
  get_weather:       'test1:get./public/weather',                   // 获取天气
};
export default api;
