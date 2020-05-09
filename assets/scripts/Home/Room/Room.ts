// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Room extends cc.Component {

    // 创建房间界面
    @property(cc.Node) createNode: cc.Node = null;
    // 公共房间界面
    @property(cc.Node) publicNode: cc.Node = null;
    // 加入房间类型选择界面
    @property(cc.Node) typesNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.createNode.opacity = 255;
        this.publicNode.opacity = 255;
        this.createNode.active = false;
        this.publicNode.active = false;
    }


    /**
     * 创建房间模式
     */
    createRoomModel() {
        this.createNode.active = true;
        this.publicNode.active = false;
        this.typesNode.active = false;
    }


    close() {
        this.node.destroy();
    }

    // update (dt) {}
}
