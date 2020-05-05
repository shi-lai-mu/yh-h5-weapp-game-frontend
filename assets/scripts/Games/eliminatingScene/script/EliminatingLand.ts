// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const {ccclass, property} = cc._decorator;

@ccclass
export default class EliminatingLand extends cc.Component {
    // 实体星星
    @property(cc.SpriteFrame) starEntity: cc.SpriteFrame = null;
    // 三星
    @property(cc.Sprite) stars: cc.Sprite[] = [];
    // 获得星星音效
    @property({ type: cc.AudioClip }) starAudio: cc.AudioClip = null;
    // 锁
    @property(cc.Node) lock: cc.Node = null;
    // 星父节点
    @property(cc.Node) Stars: cc.Node = null;
    // 关卡资源
    @property(cc.Prefab) Checkpoint: cc.Node = null;
    // 关卡名字
    @property(cc.Label) names: cc.Label = null;
    // 关卡分数
    recordData;

    start() {
        this.lock.active = false;
    }

    init(recordData, id, state) {
        console.log(recordData, id, state);

        this.names.string = recordData ? recordData.id : id + 1;

        if (recordData) {
            this.recordData = recordData;
            this.setStar(recordData.star);
        }
        if (state) {
            setTimeout(() => {
                const isLand = this.node.getComponent(cc.Button);
                isLand.enabled = true;
                isLand.interactable = false;
                this.lock.active = true;
                this.Stars.active = false;
            }, 100);
        }
    }


    /**
     * 设置岛屿的星数
     * @param starNumber  星数
     * @param index       当前星下标
     * @param audioEffect 是否播放音效
     */
    setStar(starNumber: number, index: number = 0, audioEffect: boolean = false) {
        const star = this.stars[index];
        star.spriteFrame = this.starEntity;
        const { scale } = star.node;
        star.node.runAction(
            cc.sequence(
                cc.scaleTo(.2, scale + .5),
                cc.scaleTo(.2, scale),
                cc.callFunc(() => {
                    if (--starNumber) this.setStar(starNumber, ++index, audioEffect);
                    audioEffect && cc.audioEngine.playEffect(this.starAudio, false);
                }),
            ),
        );
    }


    /**
     * 点开关卡
     */
    openCheckpoint() {
        const Checkpoint = cc.instantiate(this.Checkpoint);
        const script = Checkpoint.getComponent('EliminatingPanel');
        script.init({
            names: 121,
            star: 2,
            score: 6666,
        });
        cc.director.getScene().addChild(Checkpoint);
    }
}
