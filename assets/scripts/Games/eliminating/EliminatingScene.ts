// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class EliminatingScene extends cc.Component {

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log(this, event);
           // this.voiceNode.active = true;
        }.bind(this), this)
    }

    backHome() {
        cc.director.loadScene('Home');
    }

    scrollScent(e) {
        console.log(e);
    }
}
