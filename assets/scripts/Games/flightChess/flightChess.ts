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
const filghtItem = {
    id: -1,
    nickName: cc.Label,
    dicePoint: cc.Node,
    arrawPoint: cc.Node,
    pedestal: [ cc.Sprite ],
};
const FilghtPlayer = cc.Class({
    name: 'FilghtPlayer',
    properties: filghtItem,
});

@ccclass
export default class FilghtChess extends cc.Component {

    /**
     * 玩家坐标数据
     */
    @property(FilghtPlayer)
    filghtPlayer: typeof filghtItem[] = [];

    /**
     * 加一掷骰子的机会
     */
    @property(cc.Node)
    addDiceCount: cc.Node = null;

    /**
     * 完成状态的图片
     */
    @property(cc.Sprite)
    complete: cc.Sprite = null;
    
    /**
     * 爆炸动画
     */
    @property(cc.Node)
    exploade: cc.Node = null;

    /**
     * 箭头节点
     */
    @property(cc.Node)
    arraw: cc.Node = null;

    
    start () {

    }

    // update (dt) {}
}
