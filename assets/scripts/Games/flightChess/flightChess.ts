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
import { startPoint, chessPoint } from './flightGameData';
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

    /**
     * 骰子
     */
    @property(cc.Node)
    dice: cc.Node = null;

    @property(cc.Node)
    test: cc.Node = null;

    start () {
        let index = 0;
        setInterval(() => {
            index++;
            if (index === 52) index = 0;
            const targetIndex = chessPoint[index];
            console.log(index, targetIndex[0], targetIndex[1]);
            this.test.runAction(
                cc.moveTo(.5, targetIndex[0], targetIndex[1])
            )
            if (targetIndex[2] !== undefined) {
                this.test.runAction(
                    cc.rotateTo(.5, targetIndex[2])
                );
            }
        }, 1500);
    }

    // update (dt) {}
}
