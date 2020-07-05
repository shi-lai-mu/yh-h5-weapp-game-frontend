// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import State from '../../../utils/state';

@ccclass
export default class EliminatingPanel extends cc.Component {
    // 实体星星
    @property(cc.SpriteFrame) starEntity: cc.SpriteFrame = null;
    // 三星
    @property(cc.Sprite) stars: cc.Sprite[] = [];
    // 获得星星音效
    @property({ type: cc.AudioClip }) starAudio: cc.AudioClip = null;
    // 背景
    @property(cc.Node) backage: cc.Node = null;
    // 容器
    @property(cc.Node) box: cc.Node = null;
    // 关卡名字
    @property(cc.Label) names: cc.Label = null;
    // 分数
    @property(cc.Label) score: cc.Label = null;
    
    start() {
        // 背景渐显
        this.backage.opacity = 0;
        this.backage.runAction(cc.fadeTo(.5, 125));

        // 容器弹出动画
        this.box.y += this.box.height;
        this.box.runAction(
           cc.moveBy(.5, 0, -this.box.height).easing(cc.easeBackInOut()),
        );
    }

    
    /**
     * 初始化内容
     * @param options 参数
     */
    init(options: any) {
        this.names.string = options.names;
        options.score && (this.score.string = options.score);
        options.star && setTimeout(() => this.setStar(options.star), 500);
    }


    /**
     * 按下开始游戏
     */
    playGame() {
        State.tips('功能暂未开放, 请选择 "无限模式"!', 5, false, 2)
        // TODO: 暂未开放的关卡内容
        // cc.loader.loadRes('prefab/GroupLoading', (_err, prefab) => {
        //     const instantiate = cc.instantiate(prefab);
        //     cc.director.getScene().addChild(instantiate);
        //     cc.director.preloadScene('gameEliminating', (_err) => {
        //         instantiate.getComponent('GroupLoading').close();
        //         cc.director.loadScene('gameEliminating');
        //     });
        //     cc.director.loadScene(gameName);
        // });
    }


    /**
     * 设置岛屿的星数
     * @param starNumber  星数
     * @param index       当前星下标
     * @param audioEffect 是否播放音效
     */ 
    setStar(starNumber: number, index: number = 0, audioEffect: boolean = false) {
        const star = this.stars[index];
        const { scale } = star.node;
        star.spriteFrame = this.starEntity;
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
     * 关闭
     */
    close() {
        this.node.destroy();
    }
}
