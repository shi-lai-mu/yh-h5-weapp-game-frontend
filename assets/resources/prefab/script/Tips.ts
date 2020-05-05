// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node) body: cc.Node = null;
    // 内容
    @property(cc.Label) text: cc.Label = null;
    // 音效
    @property({ type: cc.AudioClip }) clip: cc.AudioClip = null;
    // 图标节点
    @property(cc.Sprite) iconNode: cc.Sprite = null;
    // 图标合集
    @property(cc.SpriteFrame) icons: cc.SpriteFrame[] = [];
    // 时钟
    clock;

    onDestroy() {
        clearTimeout(this.clock);
    }

    /**
     * 设置内容
     * @param content 内容
     * @param timeout 消失时间
     * @param effect  是否播放音效
     * @param icon    图标（-1：不显示，1：成功，2：失败，3：警告）
     */
    setContent(content: string, timeout?: number, effect: boolean = false, icon: number = -1) {
        this.body.runAction(
            cc.moveTo(.7, 0, 230).easing(cc.easeBounceInOut()),
        );
        this.text.string = content;
        effect && cc.audioEngine.playEffect(this.clip, false);
        if (icon !== -1) this.iconNode.spriteFrame = this.icons[icon];
        if (timeout) {
            clearTimeout(this.clock);
            this.clock = setTimeout(() => this.close(), timeout * 1000);
        }
    }


    /**
     * 关闭
     */
    close() {
        this.body.runAction(
            cc.sequence(
                cc.moveTo(.5, 0, 420),
                cc.callFunc(() => this.node.destroy()),
            ),
        );
    }

    // update (dt) {}
}
