
const {ccclass, property} = cc._decorator;
import axios from '../utils/axiosUtils';
import State from '../utils/state';

@ccclass
export default class wxLogin extends cc.Component {

    userInfo;

    start() {
      const width = 210;
      const height = 96;
      const x = -284;
      const y = -161.41;
      const that = this;

      if (window.wx) {
        let sysInfo = window.wx.getSystemInfoSync();
        //获取微信界面大小
        let screenWidth = sysInfo.screenWidth;
        let screenHeight = sysInfo.screenHeight;
        window.wx.getSetting({
          success (res) {
            console.log(res.authSetting);
            if (res.authSetting["scope.userInfo"]) {
              window.wx.getUserInfo({
                success(res){
                  that.userInfo = res.userInfo;
                  //此时可进行登录操作
                  if (State.userInfo) {
                    that.onWxLogin(res.userInfo);
                  }
                }
              });
             } else {
              console.log("用户未授权");
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
                } else {
                  console.log("用户拒绝授权:", res);
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
      }
    }


    /**
     * 微信授权登录
     */
    onWxLogin(userInfo) {
      const that = this;
      window.wx.login({
        success (res) {
          if (res.errMsg === 'login:ok') {
            console.log(res);
            axios.api('wxLogin', {
              params: {
                code: res.code,
              },
              data: userInfo,
            }).then(res => {
              if (res.token) {
                console.log(res);
                State.userInfo = res;
                localStorage.setItem('userInfo', JSON.stringify(res));
                State.observer.emit('tokenUpdate', res.token);
                console.log(that.node, that.node.getComponent('loginPage'));
                that.node.getComponent('loginPage').loadingScens();
              }
            });
          }
        }
      });
    }
}