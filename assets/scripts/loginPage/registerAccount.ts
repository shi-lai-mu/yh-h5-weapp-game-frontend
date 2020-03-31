// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import axios from '../utils/axiosUtils';
import State from '../utils/state';
import LoginService from './loginPage';

@ccclass
export default class RegisterAccount extends cc.Component {
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
        account: '',
        password: '',
        twoPassword: '',
    }
    

    start () {
        this.accountInput.node.on('text-changed', (e) => this.input.account = e.string, this);
        this.passwordInput.node.on('text-changed', (e) => this.input.password = e.string, this);
        this.twoPasswordInput.node.on('text-changed', (e) => this.input.twoPassword = e.string, this);
        this.mobileInput.node.on('text-changed', (e) => this.input.mobile = e.string, this);
        this.codeInput.node.on('text-changed', (e) => this.input.code = e.string, this);
    }


    /**
     * 点击注册事件
     */
    onRegisterEvent() {
        console.log('注册账号点击');
        const {
            password,
            account,
        } = this.input;
        if (!this.code) {
            return this.message.string = '请先发送验证码';
        }
        console.log(password, account);
        axios.api('user_reg', {
            data: {
                nickname: this.input.account,
                ...this.input,
            },
            params: {
                registerCode: this.code,
            },
        }).then(res => {
            if (res.status !== false) {
                // 简单的混淆
                const p = (password || '').split('').map((pwd: string) => {
                  return pwd.charCodeAt(0) + 10;
                }).join('-');
                const a = (account || '').split('').map((acc: string) => {
                  return acc.charCodeAt(0) + 10;
                }).join('-');
                localStorage.setItem('account', JSON.stringify({ a, p }));
                localStorage.setItem('userInfo', JSON.stringify(res));
                State.observer.emit('tokenUpdate', res.token); 
                State.userInfo = res;;
                this.parentClass.loadingScens();
            } else {
                this.message.string = res.msg;
            }
            console.log(res);
        }).catch(() => {
            this.message.string = '账号系统繁忙, 请稍后再试!';
        });
    }


    /**
     * 发送验证码
     */
    onSendCode() {
        axios.api('get_regCode', {
            params: {
                codeType: 'register',
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
     * 关闭登录按钮
     */
    onClose() {
        this.node.destroy();
    }

    // update (dt) {}
}
