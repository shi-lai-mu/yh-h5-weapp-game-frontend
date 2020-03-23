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
import { startPoint, chessPoint, notePoint } from './flightGameData';
import { FlightPlayersData } from '../../interface/game/flightChess';
import axios from '../../utils/axiosUtils';
import State from '../../utils/state';

const FilghtPlayer = cc.Class({
    name: 'FilghtPlayer',
    properties: {
        id: -1,
        nickName: cc.Label,
        dicePoint: cc.Node,
        arrawPoint: cc.Node,
        pedestal: [ cc.Sprite ],
    },
});

// 临时测试用例
let index = 0;

@ccclass
export default class FilghtChess extends cc.Component {
    // 玩家坐标数据
    @property(FilghtPlayer) filghtPlayer: FlightPlayersData[] = [];
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
    // 房间号
    @property(cc.Label) roomCode: cc.Label = null;
    // 玩家数据
    roomInfo = {
        gameData: {
            chess: [
              [-2, -2, -2, -2,],
              [-2, -2, -2, -2,],
              [-2, -2, -2, -2,],
              [-2, -2, -2, -2,],
            ],
        },
        players: [],
        roomCode: '123456',
        playerIndex: 0,
    };
    // 允许起飞点数
    takeOff = [ 6, 3 ];
    // 行走点数
    setpNumber = -1;

    bindonGameData = (data) => this.onGameData(data);
    bindfetchRoomInfo = (data) => this.fetchRoomInfo(data);
    bindrommleave = (data) => this.rommleave(data);

    onLoad() {
        const that = this;
        State.io.on('flightChess/gameData', that.bindonGameData);
        State.io.on('rommjoin', that.bindfetchRoomInfo);
        State.io.on('rommleave', that.bindrommleave);
        this.dice.getComponent('dice').onClickEvent = this.diceOut.bind(this);

        // 初始化
        this.filghtPlayer[this.roomInfo.playerIndex].pedestal.forEach((pedestal, index) => {
            const eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node; 
            eventHandler.component = 'flightChess';
            eventHandler.handler = 'chessTakeOff';
            eventHandler.customEventData = index.toString();
            const newButton = pedestal.node.addComponent(cc.Button);
            newButton.clickEvents.push(eventHandler);
            console.log(index);
        });

        // 模拟测试
        this.gameStart(this.roomInfo);
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
     * 玩家进行下一步操作时
     * @param ioData 数据
     */
    setp(ioData: {
        dice: number;
        index: number;
        flyIndex: number; // 棋子下标 如果当前棋子下标为-1则为出棋，否则为行走步数
    }) {
        console.log(ioData);
        const romm = this.roomInfo;
        // 获取目标棋子
        ioData.dice++;
        const targetChess = this.roomInfo.gameData.chess[ioData.index];

        // 为自己的回合
        console.log('-> ' + ioData.dice, romm.playerIndex === ioData.index, romm.playerIndex, ioData.index);
        if (romm.playerIndex === ioData.index) {
            console.log(ioData.dice);
            // 如果还有未起飞的棋子 且当前骰子点数为起飞点
            if (this.takeOff.indexOf(ioData.dice) !== -1 && targetChess.some(num => num === -2)) {
                // 高亮闪动显示未起飞的飞机
    
                // foces flght code...
            }
            // 允许玩家点击棋
            this.setpNumber = ioData.dice;
        }
    }


    /**
     * 点击飞机事件
     */
    chessTakeOff(_e, chessIndex: number) {
        const { setpNumber, roomInfo, takeOff } = this;
        const { playerIndex, gameData } = roomInfo;

        console.log(setpNumber);
        if (setpNumber !== -1) {
            const targetChess = gameData.chess[playerIndex][chessIndex];
            const targetSprite = this.filghtPlayer[playerIndex].pedestal[chessIndex];
            // 检测是否允许玩家出棋
            if (targetChess === -2 && this.takeOff.indexOf(setpNumber) !== -1) {
                const tStartPoint = startPoint[playerIndex];
                this.moveChess(targetSprite, tStartPoint);
                gameData.chess[playerIndex][chessIndex] = -1;
            } else if (targetChess !== -2) {
                console.log((targetChess === -1 ? notePoint[playerIndex].out : targetChess) + setpNumber);
                const nextIndex = (targetChess === -1 ? notePoint[playerIndex].out - 1 : targetChess) + setpNumber;
                this.moveChess(targetSprite, chessPoint[nextIndex]);
                gameData.chess[playerIndex][chessIndex] = nextIndex;
            }
        }
    }
    

    /**
     * 玩家离开游戏时
     * @param data - 数据
     */
    rommleave(ioData) {
    }


    /**
     * 开始游戏
     * @param gameData - 卡牌数组
     */
    gameStart(gameData: any) {
        console.log(gameData);
        this.roomCode.string = '房间号: ' + gameData.roomCode;
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
                // index: index++,
                index: 0,
                flyIndex: -1,
            },
        });
    }


    /**
     * 移动棋子到指定位置
     * @param chess    棋子
     * @param point    坐标 [x, y, ?rotate, ?duration]
     * @param duration 动画过度时间
     */
    moveChess(chess: cc.Sprite, point: number[], duration: number = .5) {
        console.log('move', point);
        chess.node.runAction(
            cc.moveTo(point[3] || duration, point[0], point[1])
        );
        if (point[2] !== undefined) {
            chess.node.runAction(
                cc.rotateTo(duration, point[2])
            );
        }
        this.setpNumber = -1;
    }
}
