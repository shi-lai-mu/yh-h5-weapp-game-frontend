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


    start () {
        this.LoginPopupMask.scale = 0;
        this.accountInput.node.on('text-changed', (e) => this.accountInputText = e.string, this);
        this.passwordInput.node.on('text-changed', (e) => this.passwordInputText = e.string, this);
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
        if (cc.sys.isMobile) {
            this.LoginPopup.rotation = -90;
        }
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
            accountInputText,
            passwordInputText,
            LoginStatus,
            accountInput,
            passwordInput,
            LoginButton,
        } = this;
        LoginStatus.string = '登录中...';
        accountInput.node.scale = 0;
        passwordInput.node.scale = 0;
        LoginButton.scale = 0;
        

        axios
            .api('login', {
                data: {
                    account: accountInputText,
                    password: passwordInputText,
                }
            })
            .then((res) => {
                console.log(res);
                if (res.token) {
                    LoginStatus.string = '登录成功';
                } else {
                    LoginStatus.string = res.msg;
                    setTimeout(() => {
                        LoginStatus.string = '';
                        accountInput.node.scale = 1;
                        passwordInput.node.scale = 1;
                        LoginButton.scale = 0.268;
                    }, 1000);
                }
            })
        ;
    }


    // update (dt) {}
}
