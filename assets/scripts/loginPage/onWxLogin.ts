
const {ccclass, property} = cc._decorator;
import axios from '../utils/axiosUtils';
import State from '../utils/state';
import { packLoading } from '../utils/tool';

@ccclass
export default class wxLogin extends cc.Component {
    start() {
      const { width, height, x, y } = this.node;
      const that = this;
      console.log(width, height);
      let sysInfo = window.wx.getSystemInfoSync();
      //获取微信界面大小
      let screenWidth = sysInfo.screenWidth;
      let screenHeight = sysInfo.screenHeight;

      if (window.wx) {
        let exportJson = {};
        window.wx.getSetting({
          success (res) {
            console.log(res.authSetting);
            if (res.authSetting["scope.userInfo"]) {
              console.log("用户已授权");
              window.wx.getUserInfo({
                success(res){
                  console.log(res);
                  that.onWxLogin(res.userInfo);
                  //此时可进行登录操作
                }
              });
             }else {
              console.log("用户未授权");
              let button = window.wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                  left: (screenWidth/2 + (width * .4 ) / 2) + x,
                  top: (screenHeight/2 - (height * 1.3)) - y,
                  width: width * .8,
                  height: height * .8,
                  backgroundColor: '#000000',//最后两位为透明度
                  color: '#ffffff',
                  fontSize: 20,
                  textAlign: "center",
                  lineHeight: height,
                }
              });
              button.onTap((res) => {
                if (res.userInfo) {
                  console.log("用户授权:", res);
                  that.onWxLogin(res.userInfo);
                  //此时可进行登录操作
                  button.destroy();
                }else {
                  console.log("用户拒绝授权:", res);
                }
              });
            }
          }
        });
      }
    }

    onWxLogin(userInfo) {
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
              console.log(res);
            });
          }
        }
      });
    }
}