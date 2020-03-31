// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import axios from '../utils/axiosUtils';

@ccclass
export default class NewClass extends cc.Component {
    // onLoad () {}
    // 账号输入框
    @property(cc.EditBox) accountInput = null;
    // 密码输入框
    @property(cc.EditBox) passwordInput = null;
    // 确认密码输入框
    @property(cc.EditBox) twoPasswordInput = null;
    // 手机号输入框
    @property(cc.EditBox) mobileInput = null;
    // 验证码输入框
    @property(cc.EditBox) codeInput = null;
    // 验证码发送冷却时间
    codeCooling: number = 0;
    

    start () {

    }


    /**
     * 点击注册事件
     */
    onRegisterEvent() {
        console.log('注册账号点击');
    }


    /**
     * 发送验证码
     */
    onSendCode() {

    }


    /**
     * 关闭登录按钮
     */
    onClose() {
        this.node.destroy();
    }

    // update (dt) {}
}
