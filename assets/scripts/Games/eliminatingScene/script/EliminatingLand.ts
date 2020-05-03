// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // 实体星星
    @property(cc.SpriteFrame) starEntity: cc.SpriteFrame = null;
    // 三星
    @property(cc.Sprite) stars: cc.Sprite[] = [];
    // 获得星星音效
    @property({ type: cc.AudioClip }) starAudio: cc.AudioClip = null;
    // 锁
    @property(cc.Node) lock: cc.Node = null;

    
    start() {
        this.lock.active = false;
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
}
