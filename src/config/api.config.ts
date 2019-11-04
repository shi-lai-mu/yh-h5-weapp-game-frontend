
interface Api {
  [key: string]: any;
}
const api: Api = {
  // 用户
  user_reg:          '/user/:registerCode',                    // 用户注册
  login:             '/user',                                  // 登陆
  get_regCode:       '/user/:codeType/:sendType/code',         // 获取注册所需的验证码
  check_code:        '/user/checkCode/:code/:inputCode',        // 校验验证码是否正确
};
export default api;
