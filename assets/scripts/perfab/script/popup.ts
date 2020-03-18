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

@ccclass
export default class Popup extends cc.Component {
    // 内容文本
    @property(cc.Label) text: cc.Label = null;
    // 弹窗主体
    @property(cc.Node) popupBox: cc.Node = null;
    // 关闭按钮
    @property(cc.Node) closeButton: cc.Node = null;
    // 成功按钮
    @property(cc.Node) successButton: cc.Node = null;
    // 重置按钮
    @property(cc.Node) resetButton: cc.Node = null;

    // 关闭事件
    closeEvent: any = null;
    // 确认事件
    successEvent: any = null;
    // 重置事件
    resetEvent: any = null;

    start () {
        const { popupBox } = this;
        popupBox.scale = 0;
        popupBox.runAction(
            cc.scaleTo(.3, 1, 1).easing(cc.easeBackInOut()),
        );
    }


    /**
     * 初始化
     * @param message - 内容
     * @param option  - 参数
     */
    init(message) {
        this.text.string = message;
    }

    /**
     * 设置事件
     * @param event - 事件体
     * @param show  - 是否显示
     */
    setEvent(buttonName: 'close' | 'success' | 'reset', event: any, show?: number) {
        this[buttonName + 'Event'] = event;
        const to = show !== undefined
        
            ? show
            : event === null ? 0 : 1.202;
        this[buttonName + 'Button'].runAction(cc.scaleTo(0.5, to, to).easing(cc.easeBackOut()));
    }

    /**
     * 
     * @param message 设置文字
     */
    message(message: string) {
        this.text.string = message;
    }

    reset() {
        this.resetEvent && this.resetEvent();
    }

    success() {
        console.log(123456);
        this.successEvent && this.successEvent();
    }


    /**
     * 关闭时
     */
    close() {
        const { popupBox } = this;
        popupBox.runAction(
            cc.sequence(
                cc.scaleTo(0.3, 0, 0).easing(cc.easeBackIn()),
                cc.callFunc(() => this.node.destroy()),
            ),
        );
        this.closeEvent && this.closeEvent();
    }
}
