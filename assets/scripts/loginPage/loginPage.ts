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
import State from '../utils/state';
import { packLoading, confusion } from '../utils/tool';

@ccclass
export default class Login extends cc.Component {
    // 登录弹窗节点
    @property(cc.Node) LoginPopup: cc.Node = null;
    // 登录弹窗遮罩节点
    @property(cc.Node) LoginPopupMask: cc.Node = null;
    // 登录按钮
    @property(cc.Node) LoginButton: cc.Node = null;
    // 注册按钮
    @property(cc.Node) registerButton: cc.Node = null;
    // label 登录状态节点
    @property(cc.Label) LoginStatus: cc.Label = null;
    // 忘记密码文字节点
    @property(cc.Label) resetPasswordNode: cc.Label = null;
    // 加载资源
    @property(cc.Prefab) loadingPrefab: cc.Prefab = null;
    // 重设密码资源
    @property(cc.Prefab) resetPassword = null;
    // 注册资源
    @property(cc.Prefab) registerAccount = null;
    // 弹窗资源
    @property(cc.Prefab) popupPrefab: cc.Prefab = null;
    // 账户输入框
    @property(cc.EditBox) accountInput = null;
    // 密码输入框
    @property(cc.EditBox) passwordInput = null;
    // 弹窗消息内容资源
    @property(cc.Prefab) messagePrefab: cc.Prefab = null;
    // 弹窗标题图片资源
    @property(cc.SpriteFrame) messageTitle: cc.SpriteFrame[] = [];
    // 账号输入框
    accountInputText: string = '';
    // 密码输入框
    passwordInputText: string = '';
    // 当前登录弹窗状态
    LoginPopupState = !0;
    // 缓冲计时器
    befferClock: any = null;
    // BGM
    bgm: cc.AudioClip = null;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.keyDown, this);
        
        // 服务器配置数据获取
        axios
            .api('server_config')
            .then(res => {
                console.log(res);
                State.serverConfig = res;

                // 服务器状态过滤
                if (res.state.value !== '0') {
                    State.server.state = Number(res.state.value);
                    this.showMessage();
                    return this.popupMiniContent(res.state.note);
                }

                // 如果之前未登录 则 显示弹窗
                !localStorage.getItem('userInfo') && this.showMessage();
                // 如果本地存在 account 数据 则尝试进行自动登录
                localStorage.getItem('account') && this.onLogin();
            })
            .catch(() => {
                State.server.state = -1;
                this.popupMiniContent('关服维护中...\n请稍后再试!');
            })
        ;
    }


    async start () {
        this.LoginPopupMask.scale = 0;
        this.accountInput.node.on('text-changed', (e) => this.accountInputText = e.string, this);
        this.passwordInput.node.on('text-changed', (e) => this.passwordInputText = e.string, this);
    }


    /**
     * 显示通知弹窗
     * - 此弹窗展示：
     *   + 未登录
     *   + 登录失败
     *   + 服务器状态异常 
     * @param content 内容
     */
    showMessage(content?: string, titleIndex?: number) {
        if (typeof content !== 'string') content = '';
        // 启动时需展现内容
        const { startMessage } = State.serverConfig;
        if (startMessage && startMessage.value) {
            const popupMessage = cc.instantiate(this.messagePrefab);
            const loginMsgScript = popupMessage.getComponent('loginMessage');
            if (this.messageTitle[startMessage.value]) {
                const title = titleIndex || (!content ? startMessage.value : false);
                title && loginMsgScript.setTitle(this.messageTitle[title]);
            }
            loginMsgScript.setContent(content || startMessage.note);
            this.node.addChild(popupMessage);
        }
        this.node.getComponent(cc.AudioSource).play();
    }


    /**
     * 重置资源
     */
    reset() {
        State.io.disconnect && State.io.disconnect();
        localStorage.clear();
        const popup = this.popupMiniContent('资源 (重置/修复) 成功!', 2000).setEvent('success', () => {
            popup.destroy();
        });
        cc.game.restart();
    }


    /**
     * 弹出小弹窗
     * @param content   内容
     * @param closeTime 自动关闭时间
     */
    popupMiniContent(content: string, closeTime?: number) {
        const popup = cc.instantiate(this.popupPrefab);
        this.node.parent.addChild(popup);
        const scriptPopup = popup.getComponent('popup');
        scriptPopup.init(content);
        scriptPopup.setEvent('success', () => {
            popup.destroy();
        });

        // 自动关闭时间
        if (closeTime) {
            setTimeout(() => popup.destroy(), closeTime);
        }

        return scriptPopup;
    }


    /**
     * 显示 关于
     */
    showAbout() {
        this.showMessage(`    本游戏大部分资源来自 原创及基于CC0 1-4协议，如部分资源涉及版权请联系我们的开发人员（史莱姆），我们将第一时间对资源进行核实审查后修改。

    邮件：admin@slmblog.com
    Q Q：478889187`);
    }


    /**
     * 按键按下时
     */
    keyDown(event: any) {
        if (event.keyCode === cc.macro.KEY.enter) {
            this.onLogin();
        }
    }


    /**
     * 登录按钮点击
     */
    onLoginClick() {
        const { LoginPopup, LoginPopupMask } = this;
        LoginPopupMask.runAction(cc.scaleTo(0.1, 1).easing(cc.easeBackInOut()));
        LoginPopup.runAction(cc.scaleTo(0.4, 1).easing(cc.easeBackInOut()));
    }


    /**
     * 注册按钮点击
     */
    createPrefab(_e, prefabName: string) {
        const instantiate = cc.instantiate(this[prefabName]);
        const script = instantiate.getComponent(prefabName);
        if (script) {
            script.parentClass = this;
        }
        this.node.addChild(instantiate);
    }


    /**
     * 关闭登录按钮
     */
    onLoginClose() {
        const { LoginPopup, LoginPopupMask } = this;
        LoginPopup.runAction(cc.scaleTo(1, 0).easing(cc.easeBackInOut()));
        LoginPopupMask.scale = 0;
    }


    /**
     * 加载界面
     */
    async loadingScens() {
        // 服务器状态检测
        console.log(State.server.state);
        if (State.server.state !== 0) {
            this.popupMiniContent(
                State.serverConfig.state.note ||
                '关服维护中...\n请稍后再试!'
            );
            return false;
        }

        const loading = cc.instantiate(this.loadingPrefab);
        const loadingScript = loading.getComponent('loading');
        this.node.addChild(loading);
        let timeout = null;
        await packLoading({
            sub: [
                'perfabScript', 'HomeScript', 'GamesScript',
            ],
            scene: [
                'Home',
            ],
        }, (_packname, count, all, message) => {
            const nextValue = ((count + 1) / all * 100) / 100;
            const currentValue = (count / all * 100) / 100;
            const averageValue = (nextValue - currentValue) / 20;
            let befferIndex = 0;
            loadingScript.updateValue(currentValue, message);

            // 缓冲效果
            this.befferClock && clearInterval(this.befferClock);
            if (nextValue < 1) {
                this.befferClock = setInterval(() => {
                    if (befferIndex < 19) {
                        befferIndex++;
                        loadingScript.updateValue(currentValue + befferIndex * averageValue);
                    } else clearInterval(this.befferClock);
                }, Math.random() * 200);
            }
            
            // 资源加载完成
            if (count === all) {
                timeout && clearTimeout(timeout);
                cc.director.loadScene('Home');
                return !0;
            }

            // 资源加载超时 1s
            timeout && clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.LoginStatus.string = '资源加载超时\n请稍后再试!';
                loading.destroy();
            }, 60000);
            return !0;
        });
    }


    /**
     * 登录账户
     */
    async onLogin() {
        // console.log(await axios.api('xxx').then((res) => console.log(res)));

        // 已自动登录则拒绝登录
        if (Date.now() - State.userInfo.last_login_time < 10000) {
            return this.loadingScens();
        }

        const {
            accountInput,
            passwordInput,
            LoginStatus,
            LoginButton,
            registerButton,
            resetPasswordNode,
        } = this;
        let {
            accountInputText,
            passwordInputText,
        } = this;

        // 重新登录
        const { a, p } = JSON.parse(localStorage.getItem('account') || '{}');
        if (a && p) {
            passwordInputText = passwordInputText || confusion.decrypt(p);
            accountInputText = accountInputText || confusion.decrypt(a);
            this.onLoginClick();
        }

        if (!accountInputText || !passwordInputText) {
            return;
        }

        LoginStatus.string = '登录中...';
        accountInput.node.scale = 0;
        passwordInput.node.scale = 0;
        registerButton.active = false;
        LoginButton.active = false;
        resetPasswordNode.node.active = false;

        // 超时
        let buys = setTimeout(() => {
            LoginStatus.string = '登录失败\n服务器超时!';
            setTimeout(this.resetLoginUI.bind(this), 1500);
        }, 7000);

        axios
            .api('login', {
                data: {
                    account: accountInputText,
                    password: passwordInputText,
                }
            })
            .then((res) => {
                clearTimeout(buys);
                if (res.token) {
                    LoginStatus.string = `登录成功!\n欢迎回来\n${res.nickname}`;
                    localStorage.setItem('userInfo', JSON.stringify(res));
                    State.userInfo = res;
                    this.loadingScens();
                    // 自动关闭并重置布局
                    setTimeout(() => {
                        this.onLoginClose();
                        this.resetLoginUI();
                    }, 2000);
                    // 简单的混淆
                    const account = confusion.encrypt(accountInputText);
                    const password = confusion.encrypt(passwordInputText);
                    localStorage.setItem('account', JSON.stringify({
                      a: account,
                      p: password,
                    }));
                    State.observer.emit('tokenUpdate', res.token); 
                } else {
                    LoginStatus.string = `登录失败\n${res.msg || '服务器繁忙'}`;
                    setTimeout(this.resetLoginUI.bind(this), 1500);
                }
            })
        ;
    }


    /**
     * 重置登录界面
     */
    resetLoginUI() {
        this.LoginStatus.string = '';
        this.accountInput.node.scale = 1;
        this.passwordInput.node.scale = 1;
        this.resetPasswordNode.node.active = true;
        this.LoginButton.active = true;
        this.registerButton.active = true;
    }


    // update (dt) {}
}
