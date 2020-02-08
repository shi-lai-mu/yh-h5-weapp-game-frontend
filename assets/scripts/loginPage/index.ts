// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import axios from '../utils/axiosUtils';

@ccclass
export default class NewClass extends cc.Component {
    /**
     * 登录弹窗节点
     */
    @property({
        type: cc.Node,
        tooltip: '登录弹窗节点',
        displayName: '登录弹窗节点',
    })
    LoginPopup: cc.Node = null;

    /**
     * 登录弹窗遮罩节点
     */
    @property({
        type: cc.Node,
        tooltip: '登录弹窗遮罩层',
        displayName: '登录弹窗遮罩节点',
    })
    LoginPopupMask: cc.Node = null;

    /**
     * 登录按钮
     */
    @property({
        type: cc.Node,
        tooltip: '登录按钮',
        displayName: '登录按钮节点',
    })
    LoginButton: cc.Node = null;


    /**
     * 注册按钮
     */
    @property({
        type: cc.Node,
        tooltip: '注册按钮',
        displayName: '注册按钮节点',
    })
    registerButton: cc.Node = null;

    /**
     * label 登录状态节点
     */
    @property({
        type: cc.Label,
        displayName: '登录状态节点',
    })
    LoginStatus: cc.Label = null;

    /**
     * 当前登录弹窗状态
     */
    @property({
        visible: false,
        tooltip: '当前登录弹窗状态',
    })
    LoginPopupState = !0;

    /**
     * 账户输入框
     */
    @property({
        type: cc.EditBox,
        tooltip: '账户输入框',
    })
    accountInput = null;

    /**
     * 密码输入框
     */
    @property({
        type: cc.EditBox,
        tooltip: '密码输入框',
    })
    passwordInput = null;

    @property({ visible: false }) accountInputText: string = '';
    @property({ visible: false }) passwordInputText: string = '';

    onLoad() {
        localStorage.getItem('account') && this.onLogin();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.keyDown, this);
    }


    start () {
        this.LoginPopupMask.scale = 0;
        this.accountInput.node.on('text-changed', (e) => this.accountInputText = e.string, this);
        this.passwordInput.node.on('text-changed', (e) => this.passwordInputText = e.string, this);
    }


    /**
     * 按键按下时
     */
    keyDown(event: any) {
        if (event.keyCode === cc.macro.KEY.enter) {
            this.onLogin();
        }
    }


    inputClick() {
        if (cc.sys.isMobile) {
            this.LoginPopup.rotation = -90;
            this.LoginPopup.x = this.node.width / 4;
        }
    }


    /**
     * 登录按钮点击
     */
    onLoginClick() {
        const { LoginPopup, LoginPopupMask } = this;
        LoginPopup.runAction(cc.fadeTo(0.3, 255));
        LoginPopupMask.runAction(cc.fadeTo(0.3, 200));
        LoginPopupMask.runAction(cc.scaleTo(0.1, 1).easing(cc.easeBackInOut()));
        LoginPopup.runAction(cc.scaleTo(0.4, 1).easing(cc.easeBackInOut()));
    }


    /**
     * 关闭登录按钮
     */
    onLoginClose() {
        const { LoginPopup, LoginPopupMask } = this;
        LoginPopup.runAction(cc.fadeTo(255, 0));
        LoginPopup.runAction(cc.scaleTo(1, 0).easing(cc.easeBackInOut()));
        LoginPopupMask.scale = 0;
    }


    /**
     * 登录账户
     */
    async onLogin() {
        // console.log(await axios.api('xxx').then((res) => console.log(res)));
        const {
            accountInput,
            passwordInput,
            LoginStatus,
            LoginButton,
            registerButton,
        } = this;
        let {
            accountInputText,
            passwordInputText,
        } = this;
        

        // 重新登录
        const { a, p } = JSON.parse(localStorage.getItem('account') || '{}');
        if (a && p) {
            passwordInputText = p.split('-').map((pwd: string) => {
                return String.fromCharCode(+pwd - 10);
            }).join('');
            accountInputText = a.split('-').map((acc: string) => {
                return String.fromCharCode(+acc - 10);
            }).join('');
            this.onLoginClick();
        }

        if (!accountInputText || !passwordInputText) {
            return;
        }

        LoginStatus.string = '登录中...';
        accountInput.node.scale = 0;
        passwordInput.node.scale = 0;
        registerButton.scale = 0;
        LoginButton.scale = 0;

        axios
            .api('login', {
                data: {
                    account: accountInputText,
                    password: passwordInputText,
                }
            })
            .then((res) => {
                if (res.token) {
                    LoginStatus.string = '登录成功';
                    localStorage.setItem('userInfo', JSON.stringify(res));
                    setTimeout(() => {
                        cc.director.loadScene('Home');
                    }, 500);
                    // 简单的混淆
                    const account = (accountInputText || '').split('').map((pwd: string) => {
                      return pwd.charCodeAt(0) + 10;
                    }).join('-');
                    const password = (passwordInputText || '').split('').map((acc: string) => {
                      return acc.charCodeAt(0) + 10;
                    }).join('-');
                    localStorage.setItem('account', JSON.stringify({
                      a: account,
                      p: password,
                    }));
                } else {
                    LoginStatus.string = `登录失败\n${res.msg || '服务器繁忙'}`;
                    setTimeout(() => {
                        LoginStatus.string = '';
                        accountInput.node.scale = 1;
                        passwordInput.node.scale = 1;
                        LoginButton.scale = 0.268;
                        registerButton.scale = 0.268;
                    }, 1500);
                }
            })
        ;
    }


    // update (dt) {}
}