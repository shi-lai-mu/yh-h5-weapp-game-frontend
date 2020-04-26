// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

/**
 * 首页左侧商家脚本
 */
@ccclass
export default class HomeBusiness extends cc.Component {

    // 侧边栏容器
    @property(cc.Node) sideBox: cc.Node = null;
    // 侧边栏箭头
    @property(cc.Node) sideArrow: cc.Node = null;
    // 侧边栏状态
    sideState: boolean = true;
    // 移动状态
    sideMoveState: boolean = false;

    start () {
        this.toggleSide();
    }

    toggleSide() {
        const { sideState } = this;
        if (this.sideMoveState === false) {
            this.sideMoveState = true;
            this.sideBox.runAction(
                cc.sequence(
                    cc.moveTo(.5, sideState ? 60 : 180, 0).easing(cc.easeBackIn()),
                    cc.callFunc(() => {
                        this.sideState = !sideState;
                        this.sideArrow.runAction(
                            cc.rotateTo(.5, sideState ? 0 : 180),
                        );
                        this.sideMoveState = false;
                    }),
                )
            );
        }
    }
    // update (dt) {}
}
