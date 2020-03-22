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
import axios from '../../utils/axiosUtils';
import State from '../../utils/state';
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

// 临时测试用例
let index = 0;

@ccclass
export default class FilghtChess extends cc.Component {
    // 玩家坐标数据
    @property(FilghtPlayer) filghtPlayer: typeof filghtItem[] = [];
    // 加一掷骰子的机会
    @property(cc.Node) addDiceCount: cc.Node = null;
    // 完成状态的图片
    @property(cc.Sprite) complete: cc.Sprite = null;
    // 爆炸动画
    @property(cc.Node) exploade: cc.Node = null;
    // 箭头节点
    @property(cc.Node) arraw: cc.Node = null;
    // 骰子
    @property(cc.Node) dice: cc.Node = null;
    // 玩家数据
    roomInfo = {
        gameData: {
            chess: [
              [-1, -1, -1, -1,],
              [-1, -1, -1, -1,],
              [-1, -1, -1, -1,],
              [-1, -1, -1, -1,],
            ],
        },
        players: [],
        roomCode: '123456',
    };

    bindonGameData = (data) => this.onGameData(data);
    bindfetchRoomInfo = (data) => this.fetchRoomInfo(data);
    bindrommleave = (data) => this.rommleave(data);

    onLoad() {
        const that = this;
        State.io.on('flightChess/gameData', that.bindonGameData);
        State.io.on('rommjoin', that.bindfetchRoomInfo);
        State.io.on('rommleave', that.bindrommleave);
        this.dice.getComponent('dice').onClickEvent = this.diceOut.bind(this);
        // let index = 0;
        // setInterval(() => {
        //     index++;
        //     if (index === 52) index = 0;
        //     const targetIndex = chessPoint[index];
        //     console.log(index, targetIndex[0], targetIndex[1]);
        //     this.test.runAction(
        //         cc.moveTo(.5, targetIndex[0], targetIndex[1])
        //     )
        //     if (targetIndex[2] !== undefined) {
        //         this.test.runAction(
        //             cc.rotateTo(.5, targetIndex[2])
        //         );
        //     }
        // }, 1500);
    }

    /**
     * 接收到游戏数据时
     * @param data - IO数据
     */
    onGameData(data: any) {
        data = typeof data === 'string' ? JSON.parse(data) : data;
        data.callback && data.msg && this[data.callback](data.msg);
    }


    /**
     * 当玩家加入房间时
     */
    fetchRoomInfo(data) {
        const MyUserData = State.userInfo;
        axios.api('room_info').then(res => {
        });
    }


    /**
     * 开始游戏
     * @param gameData - 卡牌数组
     */
    gameStart(gameData: Array<{ [key: number]: number }>) {
    }


    /**
     * 下一步
     * @param ioData 数据
     */
    setp(ioData) {
        console.log(ioData);
    }
    

    /**
     * 玩家离开游戏时
     * @param data - 数据
     */
    rommleave(ioData) {
    }


    /**
     * 游戏结束
     * @param data
     *  - false: 房主离开游戏触发
     */
    gameOver(data: any | false) {
    }


    /**
     * 投骰子时
     * @param diceNumber 数值
     */
    diceOut(dice: number) {
        this.onGameData({
            callback: 'setp',
            msg: {
                dice,
                index: index++,
                flyIndex: -1,
            },
        });
    }
}
