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
export default class ButtonAudio extends cc.Button {

    @property({
        type: cc.AudioClip,
    })
    clip: cc.AudioClip = null;

    _onTouchEnded(event: any) {
        if (!this.interactable || !this.enabledInHierarchy) return;
        cc.audioEngine.playEffect(this.clip, false);
        cc.Component.EventHandler.emitEvents(this.clickEvents, event);
        this.node.emit('click', this);
        event.stopPropagation();
    }
    // update (dt) {}
}
