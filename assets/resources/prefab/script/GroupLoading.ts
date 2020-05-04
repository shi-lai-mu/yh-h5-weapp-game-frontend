// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GroupLoading extends cc.Component {
    // 点
    @property(cc.Node) spot: cc.Node[] = [];
    // 背景
    @property(cc.Node) backage: cc.Node = null;
    // 内容
    @property(cc.Node) info: cc.Node = null;
    // 时钟
    clock;

    start() {
        // 背景渐显
        this.backage.opacity = 0;
        this.backage.runAction(cc.fadeIn(.5));

        // 加载中效果
        let spotNum = 0;
        this.clock = setInterval(() => {
            this.spot[spotNum].runAction(
                cc.sequence(
                    cc.scaleTo(.5, 1.2, 1.2).easing(cc.easeSineInOut()),
                    cc.scaleTo(.2, .6, .3).easing(cc.easeSineInOut()),
                )
            );
            this.info.runAction(
                cc.rotateTo(.3, spotNum === 0 ? -5 : spotNum === 1 ? 0 : 5).easing(cc.easeSineInOut())
            );
            if (++spotNum === 3) spotNum = 0;
        }, 1000);
    }

    /**
     * 关计时器
     */
    close() {
        clearInterval(this.clock);
        this.backage.runAction(
            cc.sequence(
                cc.fadeOut(.5),
                cc.callFunc(() => this.node.destroy()),
            ),
        );
    }

    onDestroy() {
        clearInterval(this.clock);
    }
}
