// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
/**
 * 键盘组件
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class KeyBoard extends cc.Component {

    /**
     * 内容标签
     */
    @property(cc.Label)
    Label: cc.Label = null;

    /**
     * 内容盒子
     */
    @property(cc.Node)
    ContentBox: cc.Node = null;

    /**
     * 父级类 调用者this
     */
    parentClass: any = {};

    start() {
        // 展现动画
        this.ContentBox.scale = 0;
        this.ContentBox.runAction(
            cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut()),
        );
    }


    /**
     * 点击0-9的数值时
     * @param _event  - 事件体
     * @param content - 内容
     */
    onClickContent(_event, content: string) {
        this.Label.string += content;
    }


    /**
     * 点击.
     * @param _event  - 事件体
     * @param content - 内容
     */
    onClickDecimal(_event, content: string) {
        const { Label } = this;
        if (Label.string.indexOf('.') === -1 && Label.string.length) {
            Label.string += content;
        }
    }


    /**
     * 删除键
     */
    onClickDelete() {
        const { Label } = this;
        if (Label.string.length) {
            Label.string = Label.string.substr(0, Label.string.length - 1);
        }
    }


    /**
     * 完成键
     */
    onClickSuccess() {
        this.parentClass.emit && this.parentClass.emit(this.Label.string);
    }


    /**
     * 重置键
     */
    onClickReset() {
        this.Label.string = '';
    }


    /**
     * 关闭键
     */
    onClickClose() {
        this.parentClass.close && this.parentClass.close();
        this.ContentBox.runAction(
            cc.sequence(
                cc.scaleTo(0.5, .5, .5).easing(cc.easeBackIn()),
                cc.callFunc(() => this.node.destroy(), this),
            ),
        );
    }

    // update (dt) {}
}
