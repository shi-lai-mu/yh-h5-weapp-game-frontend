// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

console.log(12);
const {ccclass, property} = cc._decorator;
import { dateFrom } from '../../lib/tool';
import State from '../../utils/state';

let prveStatus = 20;
let statusUpdateTime = 0;
let clock = 0;

@ccclass
export default class NewClass extends cc.Component {

    /**
     * WIFI 连接正常
     */
    @property(cc.SpriteFrame)
    wifiSuccessFrame: cc.SpriteFrame = null;

    /**
     * WIFI 连接警告
     */
    @property(cc.SpriteFrame)
    wifiErrorFrame: cc.SpriteFrame = null;

    /**
     * WIFI 连接断开
     */
    @property(cc.SpriteFrame)
    wifiUnLinkFrame: cc.SpriteFrame = null;

    /**
     * WIFI
     */
    @property(cc.Sprite)
    wifi: cc.Sprite = null;

    /**
     * 时间文字
     */
    @property(cc.Label)
    time: cc.Label = null;

    /**
     * 延迟文字
     */
    @property(cc.Label)
    signal: cc.Label = null;

    /**
     * 弹窗
     */
    @property(cc.Prefab)
    popupPrefab: cc.Prefab = null;

    /**
     * 弹窗实例
     */
    scriptPopup: any = null;

    onLoad() {
        this.watch();
        cc.game.on('socketConnect', this.watch.bind(this));
        cc.game.on('serverClose', this.serverCloseEvent.bind(this));
        const onLine = (content: string) => {
            const popup = cc.instantiate(this.popupPrefab);
            cc.director.getScene().addChild(popup);
            const scriptPopup = popup.getComponent('popup');
            scriptPopup.init(content);
            clearInterval(clock);
            scriptPopup.setEvent('close', () => {
                localStorage.clear();
                cc.director.loadScene('loginPage');
            });
        }

        // 账号在线监测
        cc.game.on('onLine', onLine);

        // 提早得到在线通知时
        if (State.io.online) onLine('当前账号已在\n其他设备上登录!');
    }

    
    /**
     * 服务器关闭检测
     */
    serverCloseEvent() {
        const popup = cc.instantiate(this.popupPrefab);
        cc.director.getScene().addChild(popup);
        const scriptPopup = popup.getComponent('popup');
        scriptPopup.init('服务器维护中...\n请退至首页!');
        scriptPopup.setEvent('success', () => {
            cc.director.loadScene('loginPage');
        });
        clearInterval(clock);
    }


    /**
     * 监听数据回音事件
     */
    watch() {
        clock && clearInterval(clock);
        clock = setInterval(() => {
            this.time.string = dateFrom('HH:mm');
            State.io.emit('signal', '');
            const time = Date.now();

            if (statusUpdateTime === 0) {
                console.log('retrun statusUpdateTime');
                statusUpdateTime = Date.now();
                return;
            }
            if (statusUpdateTime + (10 * 1000) < Date.now()) {
                // 掉线二次检测
                this.wifi.spriteFrame = this.wifiUnLinkFrame;
                prveStatus = 2000;
                this.unonline();
                this.signal.string = '已掉线';
            } else if (statusUpdateTime + (4 * 1000) < time) {
                // 警告状态
                this.wifi.spriteFrame = this.wifiErrorFrame;
                prveStatus = 700 + (Math.random() * 300 >> 1);
                this.signal.node.color = cc.color(255, 160, 36);
                this.signal.string = prveStatus.toString();
            }

            // 颜色修改
            if (prveStatus > 1000) {
                this.signal.node.color = cc.color(197, 27, 6);
            }
        }, 1000);

        // 延迟接收
        State.io.on('signal', this.onSignal.bind(this));
    }


    /**
     * 接收到延迟数据时
     * @param signal - 延迟
     */
    onSignal(signal) {
        if (typeof signal === 'number' && this.signal) {
            statusUpdateTime = Date.now();
            this.signal.string = signal + 'ms';
            State.userInfo.signal = signal;
            this.scriptPopup && this.scriptPopup.close();

            // 状态正常恢复
            if (prveStatus >= 500 && prveStatus <= 2000 && signal < 500) {
                this.wifi.spriteFrame = this.wifiSuccessFrame;
                this.signal.node.color = cc.color(30, 255, 127);
            }

            // 延迟状态
            if (signal > 500 && signal < 1000) {
                this.wifi.spriteFrame = this.wifiErrorFrame;
                this.signal.node.color = cc.color(255, 160, 36);
                prveStatus = signal;
            }

            // 掉线状态
            if (signal > 1000) {
                this.wifi.spriteFrame = this.wifiUnLinkFrame;
                prveStatus = signal;
            }
        }
    }


    /**
     * 掉线弹窗处理
     */
    unonline() {
        if (!this.scriptPopup) {
            console.log('与服务器失去连接');
            const popup = cc.instantiate(this.popupPrefab);
            this.node.parent.addChild(popup);
            const scriptPopup = popup.getComponent('popup');
            scriptPopup.init('与服务器失去连接!\n重新连接中...');
            scriptPopup.setEvent('close', () => {
                this.scriptPopup = null;
            });
            this.scriptPopup = scriptPopup;
        }
    }


    /**
     * 销毁场景时进行清理
     */
    onDestroy() {
        State.io.off('signal', this.onSignal.bind(this));
        cc.gameoff('socketConnect', this.watch.bind(this));
        clock && clearInterval(clock);
        statusUpdateTime = 0;
    }

    // update (dt) {}
}
