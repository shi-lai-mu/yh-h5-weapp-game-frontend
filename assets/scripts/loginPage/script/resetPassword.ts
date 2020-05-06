// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import axios from '../../utils/axiosUtils';
import LoginService from './loginPage';

@ccclass
export default class NewClass extends cc.Component {
    // 密码输入框
    @property(cc.EditBox) passwordInput = null;
    // 确认密码输入框
    @property(cc.EditBox) twoPasswordInput = null;
    // 手机号输入框
    @property(cc.EditBox) mobileInput = null;
    // 验证码输入框
    @property(cc.EditBox) codeInput = null;
    // 消息提示内容
    @property(cc.Label) message = null;
    // 父级类
    parentClass: LoginService;
    // 验证码发送冷却时间
    codeCooling: number = 0;
    // 短信code
    code = ''

    input = {
        code: '',
        mobile: '',
        password: '',
        twoPassword: '',
    }


    start () {
        this.passwordInput.node.on('text-changed', (e) => this.input.password = e.string, this);
        this.twoPasswordInput.node.on('text-changed', (e) => this.input.twoPassword = e.string, this);
        this.mobileInput.node.on('text-changed', (e) => this.input.mobile = e.string, this);
        this.codeInput.node.on('text-changed', (e) => this.input.code = e.string, this);
    }


    /**
     * 点击注册事件
     */
    onRegisterEvent() {
        this.message.string = '';
        const {
            code,
            mobile,
            password,
            twoPassword,
        } = this.input;
        if (!code || !mobile  || !password || !twoPassword) {
            return this.message.string = '请先填写完整的信息!';
        }
        // 校验
        if (password.length < 6 || password.length > 20) {
            return this.message.string = '密码长度6-20位!';
        }
        if (password !== twoPassword) {
            return this.message.string = '两次输入的密码不相同!';
        }
        if (!this.code) {
            return this.message.string = '请先发送验证码';
        }

        // 发送注册
        axios.api('reset_pwd', {
            data: {
                newPassword: this.input.password,
                mobile: this.input.mobile,
                code: this.input.code,
            },
            params: {
                resetPasswordCode: this.code,
            },
        }).then(res => {
            if (res.status !== false) {
                this.message.string = '密码修改成功, 请返回登录!';
                setTimeout(() => {
                    this.node.destroy();
                }, 2000);
            } else {
                this.message.string = res.msg;
            }
        }).catch(() => {
            this.message.string = '账号系统繁忙, 请稍后再试!';
        });
    }


    /**
     * 发送验证码
     */
    onSendCode() {
        const { mobile } = this.input;
        this.message.string = '正在发送验证码...';

        if (!mobile || !(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(mobile))) {
            return this.message.string = '手机号错误!';
        }

        axios.api('get_regCode', {
            params: {
                codeType: 'resetPassword',
                sendType: 'sms',
            },
            data: {
                recipient: this.input.mobile,
            },
        }).then(res => {
            if (res.status) this.code = res.msg;
            this.message.string = res.status ? '发送成功!' : res.msg;
        }).catch(() => {
            this.message.string = '短信系统繁忙, 请稍后再试!';
        });
    }


    /**
     * 点击登录事件
     */
    onLogingEvent() {

    }


    /**
     * 关闭登录按钮
     */
    onClose() {
        this.node.destroy();
    }

    // update (dt) {}
}
