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
import tool from '../../utils/tool';
import State from '../../utils/state';

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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let prveStatus = 20;
        let statusUpdateTime = Date.now();
        setInterval(() => {
            this.time.string = tool.dateFrom('HH:mm');
            State.io.emit('signal');

            // 掉线二次检测
            if (statusUpdateTime + 10 * 1000 < Date.now()) {
                this.wifi.spriteFrame = this.wifiUnLinkFrame;
                prveStatus = 2000;
            }

            // 颜色修改
            if (prveStatus > 500) {
                this.signal.node.color = cc.color(197, 27, 6);
                this.signal.string = '已掉线';
            }
        }, 1000);

        State.io.on('signal', (signal) => {
            if (typeof signal === 'number') {
                statusUpdateTime = Date.now();
                this.signal.string = signal + 'ms';

                // 状态正常恢复
                if (prveStatus >= 500 && prveStatus <= 2000 && signal < 500) {
                    this.wifi.spriteFrame = this.wifiSuccessFrame;
                    this.signal.node.color = cc.color(30, 255, 127);
                }

                // 延迟状态
                if (signal > 500 && signal < 1000) {
                    this.wifi.spriteFrame = this.wifiErrorFrame;
                    prveStatus = signal;
                }

                // 掉线状态
                if (signal > 1000) {
                    this.wifi.spriteFrame = this.wifiUnLinkFrame;
                    prveStatus = signal;
                }
            }
        });
    }

    // update (dt) {}
}
