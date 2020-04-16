
const {ccclass} = cc._decorator;
import axios from '../utils/axiosUtils';
import State from '../utils/state';

@ccclass
export default class WxLogin extends cc.Component {

    userInfo;

    start() {
      const width = 210;
      const height = 96;
      const x = -284;
      const y = -161.41;
      const that = this;

      if (State.IS_WECHAT) {
        let sysInfo = window.wx.getSystemInfoSync();
        //获取微信界面大小
        let screenWidth = sysInfo.screenWidth;
        let screenHeight = sysInfo.screenHeight;
        window.wx.getSetting({
          success (res) {
            if (res.authSetting["scope.userInfo"]) {
              window.wx.getUserInfo({
                success(res){
                  that.userInfo = res.userInfo;
                  //此时可进行登录操作
                  if (localStorage.getItem('userInfo') && !localStorage.getItem('account')) {
                    that.onWxLogin(res.userInfo);
                  }
                }
              });
             } else {
              let button = window.wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                  left: (screenWidth/2 + (width * .4 ) / 2) + x,
                  top: (screenHeight/2 - (height * 1.3)) - y,
                  width: width * .8,
                  height: height * .8,
                  backgroundColor: '#00000000',//最后两位为透明度
                  color: '#ffffff',
                  fontSize: 20,
                  textAlign: "center",
                  lineHeight: height,
                }
              });
              button.onTap((res) => {
                if (res.userInfo) {
                  that.onWxLogin(res.userInfo);
                  //此时可进行登录操作
                  button.destroy();
                }
              });
            }
          }
        });
      }
    }


    /**
     * 点击用户登录按钮时
     */
    onClickLoginButton() {
      if (this.userInfo) {
        this.onWxLogin(this.userInfo);
      } else if (!CC_WECHATGAME) {
        this.node.getComponent('loginPage').popupMiniContent('此功能只允许在\n微信小游戏或微信中使用!', 3000);
      }
    }


    /**
     * 微信授权登录
     */
    onWxLogin(userInfo) {
      const popup = this.node.getComponent('loginPage');
      const that = this;

      // 服务器状态检测
      if (State.server.state !== 0) {
        popup.popupMiniContent(
            State.serverConfig.state.note ||
            '关服维护中...\n请稍后再试!'
        );
        return false;
      }

      // const success = popup.popupMiniContent('获取授权成功!登录中...');

      window.wx.login({
        success (res) {
          if (res.errMsg === 'login:ok') {
            axios
              .api('wxLogin', {
                params: {
                  code: res.code,
                },
                data: userInfo,
              })
              .then(res => {
                if (res.token) {
                  console.log(res);
                  State.userInfo = res;
                  localStorage.setItem('userInfo', JSON.stringify(res));
                  console.log(res.token);
                  cc.game.emit('tokenUpdate', res.token);
                  popup.loadingScens();
                }
              })
              .catch(() => {
                success.destroy();
                popup.popupMiniContent('授权数据接口错误!\n请稍后再试!');
              })
            ;
          }
        }
      });
    }
}