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

const ItemData = cc.Class({
    name: 'itemData',
    properties: {
        key: cc.Label,
        value: cc.Label,
    },
})

const UserItem = cc.Class({
    name: 'userItem',
    properties: {
        nickname: cc.Label,
        avatarUrl: cc.Sprite,
        score: cc.Label,
        item: {
            default: [],
            type: ItemData,
        },
        winner: cc.Boolean,
        Node: cc.Node,
    },
})

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    

    @property(UserItem)
    UserItem: {
        nickname: cc.Label;
        avatarUrl: cc.Sprite;
        score: cc.Label;
        item: { key: cc.Label; value: cc.Label },
        winner: Boolean;
        Node: cc.Node;
    }[] = [];

    @property(cc.Label)
    roomId: cc.Label = null;

    @property(cc.Label)
    Time: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.UserItem.forEach((item, index) => {
            item.Node.scale = 0;
            // item.Node.y = item.Node.height;
            console.log(item);
            setTimeout(() => {
                item.Node.runAction(
                    cc.scaleTo(1, 0.314, 0.456).easing(cc.easeBackOut()),
                    // cc.moveTo(.5, new cc.Vec2(0, -item.Node.height))
                );
            }, index * 200);
        });
    }

    // update (dt) {}
}
