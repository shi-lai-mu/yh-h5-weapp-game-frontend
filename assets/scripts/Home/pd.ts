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
export default class NewClass extends cc.Component {

    /**
     * 键盘资源
     */
    @property(cc.Prefab)
    keyboard: cc.Prefab = null;


    /**
     * 创建房间资源
     */
    @property(cc.Prefab)
    createRoomPrefab: cc.Prefab = null;


    @property(cc.Canvas)
    Canvas: cc.Canvas = null;



    /**
     * 加入房间
     */
    joinRoom() {
        const joinRoomPopup = cc.instantiate(this.keyboard);
        this.Canvas.node.addChild(joinRoomPopup);
        joinRoomPopup.getComponent('keyboard').parentClass = {
            emit(data) {
                console.log(data);
            }
        }
    }


    /**
     * 创建房间点击事件
     */
    showCreateRoomPopup() {
        const createRoomPrefab = cc.instantiate(this.createRoomPrefab);
        this.Canvas.node.addChild(createRoomPrefab);
        // createRoomPrefab.getComponent('keyboard').parentClass = {
        //     emit(data) {
        //         console.log(data);
        //     }
        // }
    }


    start () {

    }



    // update (dt) {}
}
