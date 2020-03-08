// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const gameOption = {
    gobang: {
        name: '五子棋',
        icon: '',
        room: [
            ['人数', '1人', '5人', '10人'],
            ['支付方式', 'aa', 'bb', 'cc'],
        ],
    },
    fourCards: {
        name: '四副牌',
        icon: '',
        room: [
            []
        ],
    },
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateRoom extends cc.Component {

    /**
     * 主盒子
     */
    @property(cc.Node)
    mainBox: cc.Node = null;

    /**
     * 左侧盒子
     */
    @property(cc.Node)
    leftTopBox: cc.Node = null;

    /**
     * 大内容盒子
     */
    @property(cc.Node)
    ContentBox: cc.Node = null;

    /**
     * 大内容内容区域
     */
    @property(cc.Node)
    ContentBoxView: cc.Node = null;

    /**
     * 五子棋资源
     */
    @property(cc.Prefab)
    wzqPrefab: cc.Prefab = null;

    /**
     * 选项组资源
     */
    @property(cc.Prefab)
    radioGroup: cc.Prefab = null;

    prevPrefab: cc.Prefab = null;

    Canvas: cc.Canvas;

    start() {
        this.popupShow();
        // 默认载入五子棋
        this.loadPrefab('gobang');
    }


    /**
     * 加载创建房间的设置资源
     * @param prefabName - 游戏名
     */
    loadPrefab(prefabName: 'gobang') {
        // if (this.prevPrefab) {
        //     this.prevPrefab.destroy();
        // }
        // const newPrefab = cc.instantiate(this[prefabName + 'Prefab']);
        // this.ContentBoxView.addChild(newPrefab);
        // newPrefab.getComponent(prefabName + 'CreateRoom').Canvas = this.Canvas;
        // this.prevPrefab = newPrefab;
        const gameOpt = gameOption[prefabName];
        if (gameOpt) {
            gameOpt.room.forEach((opt: string[], index) => {
                const optGroup = cc.instantiate(this.radioGroup);
                const radioScript = optGroup.getComponent('Radio');
                radioScript.init(opt.shift(), opt);
                this.ContentBox.addChild(optGroup);
                optGroup.y -= index * 60 - 150;
            });
        }
    }


    /**
     * 界面显示
     * @param Action - 是否显示动画
     */
    popupShow() {
        const { leftTopBox } = this;
        this.ContentBox.scale = 0;
        leftTopBox.x = leftTopBox.x + leftTopBox.width;
        this.ContentBox.runAction(
            cc.sequence(
                cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut()),
                cc.callFunc(() => leftTopBox.runAction(
                    cc.moveBy(1, cc.v2(-leftTopBox.width, 0), 0).easing(cc.easeCubicActionOut()),
                ), this),
            ),
        );
    }

    
    /**
     * 界面隐藏
     * @param Action - 是否显示动画
     */
    popupHide() {
        this.ContentBox.runAction(
            cc.sequence(
                cc.scaleTo(0.5, .5, .5).easing(cc.easeBackIn()),
                cc.callFunc(() => this.node.destroy(), this),
            ),
        );
    }



    // update (dt) {}
}
