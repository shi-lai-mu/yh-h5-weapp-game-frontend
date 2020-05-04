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

    clock;

    start () {
        cc.audioEngine.playEffect(this.clip, false);
    }

    onDestroy() {
        clearTimeout(this.clock);
    }

    /**
     * 设置内容
     * @param content 内容
     * @param timeout 消失时间
     */
    setContent(content: string, timeout?: number) {
        this.body.runAction(
            cc.moveTo(.7, 0, 230).easing(cc.easeBounceInOut()),
        );
        this.text.string = content;
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
