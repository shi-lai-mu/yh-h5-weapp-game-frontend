export default {
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
  get_games_list:    'get./game/home/list',                         // 获取游戏列表

  // 活动
  home_activity:     'get./activity',                               // 首页活动列表

  // 房间
  create_room:       'post./room/:gameName',                        // 创建房间
  room_info:         'get./room/info',                              // 房间详细
  room_join:         'post./room/join',                             // 加入房间
  room_exit:         'post./room/exit',                             // 退出房间
  room_isStart:      'get./room/:gameName/isStart',                 // 游戏是否开始

  // 商城
  shop_menu:         '/shop/main',                                  // 主商城菜单
  shop_menu_goods:   '/shop/main/:menuId',                          // 主商城菜单下的商品

  // 微服务接口
  // get_city:          'test1:get./public/city',                   // 获取城市 [测试阶段接口暂时暂停访问 付费接口]
  get_city:          'test1:get./public/city111111',                // 获取城市
  get_weather:       'test1:get./public/weather',                   // 获取天气
}