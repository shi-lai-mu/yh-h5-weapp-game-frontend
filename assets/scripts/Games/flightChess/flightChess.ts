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
import { startPoint, chessPoint, notePoint, centerPedestal } from './flightGameData';
import { FlightPlayersData } from '../../interface/game/flightChess';
import axios from '../../utils/axiosUtils';
import State from '../../utils/state';

const FlightPlayer = cc.Class({
    name: 'FlightPlayer',
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
export default class FlightChess extends cc.Component {
    // 玩家坐标数据
    @property(FlightPlayer) FlightPlayer: FlightPlayersData[] = [];
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
              [ -2, -2, -2, -2 ],
              [ -2, -2, -2, -2 ],
              [ -2, -2, -2, -2 ],
              [ -2, -2, -2, -2 ],
            ],
        },
        players: [],
        roomCode: '123456',
        playerIndex: 1,
    };
    // 允许起飞点数
    takeOff = [ 1,2,3,4,5,6, 6, 3 ];
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
        this.FlightPlayer[this.roomInfo.playerIndex].pedestal.forEach((pedestal, index) => {
            const eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node; 
            eventHandler.component = 'flightChess';
            eventHandler.handler = 'chessTakeOff';
            eventHandler.customEventData = index.toString();
            const newButton = pedestal.node.addComponent(cc.Button);
            newButton.clickEvents.push(eventHandler);
            console.log(index);
        });

        // this.FlightPlayer.forEach(player => {
        //     player.pedestal.forEach((pedestal, index) => {
        //         const eventHandler = new cc.Component.EventHandler();
        //         eventHandler.target = this.node; 
        //         eventHandler.component = 'flightChess';
        //         eventHandler.handler = 'chessTakeOff';
        //         eventHandler.customEventData = index.toString();
        //         const newButton = pedestal.node.addComponent(cc.Button);
        //         newButton.clickEvents.push(eventHandler);
        //         console.log(index);
        //     });
        // })

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
        const romm = this.roomInfo;
        // 获取目标棋子
        ioData.dice++;
        const targetChess = this.roomInfo.gameData.chess[ioData.index];

        // 为自己的回合
        if (romm.playerIndex === ioData.index) {
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

        // console.log(setpNumber);
        if (setpNumber !== -1) {
            const targetChess = gameData.chess[playerIndex][chessIndex];
            const targetSprite = this.FlightPlayer[playerIndex].pedestal[chessIndex];
            // 检测是否允许玩家出棋
            if (targetChess === -2 && takeOff.indexOf(setpNumber) !== -1) {
                const tStartPoint = startPoint[playerIndex];
                this.moveChess(targetSprite, tStartPoint);
                gameData.chess[playerIndex][chessIndex] = -1;
            } else if (targetChess !== -2) {
                const outIndex =  notePoint[playerIndex].out - 1;
                const nextIndex = (targetChess === -1 ? outIndex : targetChess) + setpNumber;
                if (targetChess === -1) {
                    gameData.chess[playerIndex][chessIndex] = outIndex;
                }
                this.moveChess(targetSprite, false, .5, {
                    to: nextIndex,
                    from: gameData.chess[playerIndex],
                    index: chessIndex,
                });
                // gameData.chess[playerIndex][chessIndex] = nextIndex;
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
        // 初始化房主信息
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
                index: 1,
                flyIndex: -1,
            },
        });
    }


    /**
     * 移动棋子到指定位置
     * @param chess    棋子
     * @param point    坐标 [x, y, rotate?, duration?]
     * @param duration 动画过度时间
     */
    moveChess(
        chess: cc.Sprite,
        point: number[] | false,
        duration: number = .5,
        move?: {
            to: number;
            from: number[];
            index: number;
            noJump?: boolean;
        },
    ) {
        // console.log(move);
        const { playerIndex } = this.roomInfo;
        const tNotePoint = notePoint[playerIndex];
        let clock;
        // 定位移动
        if (move) {
            let moveSpace = move.to - move.from[move.index];
            moveSpace = moveSpace > 1 ? moveSpace + 1 : moveSpace;
            // console.log('moveSpace ', move.to, move.to - move.from[move.index], move.from[move.index]);
            let moveSetp = 1;
            const moveTo = () => {
                let moveIndex = move.from[move.index];
                // 前往中央转折
                if (moveIndex === tNotePoint.in || moveIndex >> 0 === tNotePoint.in) {
                    if (moveIndex >= tNotePoint.in + .6) moveSetp = -0.1;
                    if (moveSetp === 1) {
                        moveSetp = 0.1;
                        playerIndex === 1 && moveSpace++;
                    };
                    console.log(moveSpace, moveIndex, moveSpace);
                    moveIndex = move.from[move.index] += moveSetp;
                    let moveI = (((moveIndex - tNotePoint.in) * 10) >> 0) - 1;
                    if (moveI === -1) moveI = 0;
                    const centerPoint = centerPedestal[playerIndex][moveI];
                    console.log(moveI);
                    // 如果当前剩余2次（因为延迟-1）或投中1点 进入最后一个位置则判定完成
                    if ((moveSpace === 2 || moveSpace === 1) && moveI === 5) {
                        console.log('fly over');
                        clearInterval(clock);
                    }
                    this.moveChess(chess, centerPoint);
                    moveSpace--;
                    if (moveSpace <= 1) clearInterval(clock);
                    return;
                }
                move.from[move.index] += moveSetp;
                moveSpace--;
                
                moveIndex = move.from[move.index];
                // console.log(moveIndex, moveSpace, tNotePoint.in);
                if (moveIndex > chessPoint.length - 1) {
                    moveIndex = move.from[move.index] = 1;
                }

                if (moveSpace <= 1) {
                    clearInterval(clock);
                    // 起飞点检测
                    if (moveIndex === tNotePoint.start) {
                        // 跳到起飞点后再起飞
                        setTimeout(() => {
                            const flyData = chessPoint[tNotePoint.end];
                            const i = playerIndex;
                            flyData[2] = i === 0
                                ? 90 : i === 1
                                ? 180 : i === 2
                                ? -90 : 0
                            ;
                            // console.log(flyData);
                            this.moveChess(chess, flyData, 1.5);
                            move.from[move.index] = tNotePoint.end;
                            // 降落后跳四格
                            setTimeout(() => {
                                move.to = tNotePoint.end + 4;
                                move.noJump = true;
                                this.moveChess(chess, point, duration, move);
                            }, 1500);
                        }, 500);
                    }
                }
                this.moveChess(chess, chessPoint[moveIndex]);
            }
            // const clock = setInterval(moveTo, 100);
            // 判断是否跳跃
            // console.log(move.from[move.index], moveSpace, tNotePoint.in);
            const endIndex = move.from[move.index] + moveSpace + (moveSpace > 1 ? -1 : 0);
            if (
                (endIndex) % 4 === playerIndex
                && endIndex !== tNotePoint.start
                && !move.noJump
                && move.from[move.index] + moveSpace - 1 !== tNotePoint.in
                && move.from[move.index] !== tNotePoint.in
            ) {
                // console.log(move.index, moveSpace, '+4');
                moveSpace += 4 + (moveSpace > 1 ? 0 : 1);
            }
            if (moveSpace !== 1) {
                clock = setInterval(moveTo, 500);
            }
            moveTo();
            return;
        }

        if (point) {
            chess.node.runAction(
                cc.moveTo(point[3] || duration, point[0], point[1])
            );
            if (point[2] !== undefined) {
                chess.node.runAction(
                    cc.rotateTo(duration, point[2])
                );
            }
            // this.setpNumber = -1;
        }
    }
}
