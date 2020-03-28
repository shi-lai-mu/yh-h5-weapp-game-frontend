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
import { FlightPlayersData } from '../../interface/game/flightChessInterface';
import axios from '../../utils/axiosUtils';
import State from '../../utils/state';
import { UserData } from '../../interface/game/fourCard';

const FlightPlayer = cc.Class({
    name: 'FlightPlayer',
    properties: {
        id: -1,
        box: cc.Node,
        nickName: cc.Label,
        pedestal: [ cc.Sprite ],
    },
});

// 临时测试用例
let index = 0;
// 聚焦计时器
let pedestalFouse = null;

@ccclass
export default class FlightChess extends cc.Component {
    // 玩家坐标数据
    @property(FlightPlayer) FlightPlayer: FlightPlayersData[] = [];
    // 加一掷骰子的机会
    @property(cc.Node) addDiceCount: cc.Node = null;
    // 游戏开始字样
    @property(cc.Node) gameStartNode: cc.Node = null;
    // 完成状态的图片
    @property(cc.SpriteFrame) complete: cc.SpriteFrame = null;
    // 爆炸动画
    @property(cc.Node) exploade: cc.Node = null;
    // 箭头节点
    @property(cc.Node) arraw: cc.Node = null;
    // 骰子
    @property(cc.Node) dice: cc.Node = null;
    // 房间号
    @property(cc.Label) roomCode: cc.Label = null;
    // 玩家数据
    playersData: UserData[] = [];
    // 弹窗资源
    @property(cc.Prefab) popupPrefab: cc.Prefab = null;
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
    // 棋子出生点
    chessSpawn: number[][][] = [];
    // 允许起飞点数
    takeOff = [ 1,2,3,4,5,6, 6, 3 ];
    // 行走点数
    setpNumber = -1;

    bindonGameData = (data) => this.onGameData(data);
    bindfetchRoomInfo = () => this.fetchRoomInfo();
    bindrommleave = (data) => this.rommleave(data);

    onLoad() {
        const that = this;
        State.io.on('flightChess/gameData', that.bindonGameData);
        State.io.on('rommjoin', that.bindfetchRoomInfo);
        State.io.on('rommleave', that.bindrommleave);
        this.dice.getComponent('dice').onClickEvent = this.diceOut.bind(this);
        this.dice.getComponent(cc.Button).enabled = false;
        this.fetchRoomInfo();
        // 模拟测试
        // this.gameStart(this.roomInfo);       
        cc.loader.setAutoReleaseRecursively('68b61513-780a-4964-9622-adbea2867cda', true);
        cc.loader.setAutoReleaseRecursively('a9654289-ba14-4c09-8e65-5712b9174e2c', true);
        cc.loader.setAutoReleaseRecursively('0bdee8a8-6a17-4c36-9433-644b6412515b', true);
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
    fetchRoomInfo() {
        axios.api('room_info').then(res => {
            res.players.forEach((player, index) => {
                this.FlightPlayer[index].nickName.string = player.nickname;
            });
            this.roomCode.string = '房间号: ' + res.roomCode;
            this.roomInfo = res;
            if (res.isStart) this.gameStart(res);
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
    }, isPlayer: boolean = false) {
        const romm = this.roomInfo;
        // 获取目标棋子
        ioData.dice++;
        // const targetChess = this.roomInfo.gameData.chess[ioData.index];

        // 为自己的回合
        // console.log(romm.playerIndex, ioData.index);
        console.log(romm.playerIndex, ioData.index , isPlayer);
        if (romm.playerIndex === ioData.index && isPlayer) {
            // 如果还有未起飞的棋子 且当前骰子点数为起飞点
            // if (this.takeOff.indexOf(ioData.dice) !== -1 && targetChess.some(num => num === -2)) {
            //     // 高亮闪动显示未起飞的飞机
                
            //     // foces flght code...
            // }
            // 允许玩家点击棋
            console.log(ioData.dice, ioData);
            this.setpNumber = ioData.dice;
        }
    }


    /**
     * 点击飞机事件
     */
    chessTakeOff(_e, chessIndex: number, playerIndex?: number, setpNumber?: number) {
        const { roomInfo, takeOff } = this;
        const { gameData } = roomInfo;
        playerIndex = playerIndex !== undefined ? playerIndex : roomInfo.playerIndex;
        setpNumber = setpNumber || this.setpNumber;

        if (_e) {
            // 隐藏聚焦圈
            this.FlightPlayer[playerIndex].pedestal.forEach(pedestal => pedestal.node.children[0].active = false);
            clearInterval(pedestalFouse);
        }

        // console.log(setpNumber);
        if (setpNumber !== -1) {
            const targetChess = gameData.chess[playerIndex][chessIndex];
            const targetSprite = this.FlightPlayer[playerIndex].pedestal[chessIndex];
            // 检测是否允许玩家出棋
            if (targetChess === -2 && takeOff.indexOf(setpNumber) !== -1) {
                const tStartPoint = startPoint[playerIndex];
                this.moveChess(targetSprite, tStartPoint);
                gameData.chess[playerIndex][chessIndex] = -1;
            } else if (targetChess > -2) {
                const outIndex =  notePoint[playerIndex].out - 1;
                const nextIndex = (targetChess === -1 ? outIndex : targetChess) + setpNumber;
                if (targetChess === -1) {
                    gameData.chess[playerIndex][chessIndex] = outIndex;
                }
                this.moveChess(targetSprite, false, .5, {
                    to: nextIndex,
                    from: gameData.chess[playerIndex],
                    index: chessIndex,
                }, playerIndex);
                // gameData.chess[playerIndex][chessIndex] = nextIndex;
            } else {
                // console.log('skip');
                return false;
            }
            if (playerIndex === roomInfo.playerIndex) {
                // 通讯下一步
                State.io.emit('flightChess/setp', {
                    to: setpNumber,
                    chessIndex,
                    index: playerIndex,
                });
            }
            this.setpNumber = -1;
        }
    }


    /**
     * 允许玩家发牌时
     * @param data io数据
     */
    userSendChess(data: any) {
        const { next } = data;
        const { playerIndex } = this.roomInfo;
        // console.log(data);
        if (next) {
            index = next.index;
            // 如果为当前玩家回合
            this.dice.getComponent(cc.Button).enabled = next.index === playerIndex;
            // 其他玩家数据更新
            if (next.prveChess && next.prveChess.index !== playerIndex) {
                const { prveChess } = next;
                if (prveChess) {
                    this.dice.getComponent('dice').onClick(prveChess.to - 1);
                    this.chessTakeOff(false, prveChess.chessIndex, prveChess.index, prveChess.to);
                }
            }
        }
        const nextPlayer = this.FlightPlayer[index];
        const { x, y } = nextPlayer.box;
        // 移动骰子
        this.dice.runAction(
            cc.moveTo(1, x + 45, y - 5).easing(cc.easeBackIn()),
        );
        // 移动箭头
        this.arraw.runAction(
            cc.moveTo(1, x + 60, y + 45).easing(cc.easeBackIn()),
        );
    }
    

    /**
     * 玩家离开游戏时
     * @param data - 数据
     */
    rommleave(ioData) {
    }


    /**
     * 开始游戏
     * @param roomInfo - 卡牌数组
     */
    gameStart(roomInfo: any) {
        console.log(roomInfo);
        this.roomCode.string = '房间号: ' + roomInfo.roomCode;
        const startNode = this.gameStartNode;
        this.takeOff = roomInfo.gameData.takeOff;
        startNode.y = -startNode.height;
        startNode.runAction(
            cc.sequence(
                cc.moveTo(3, 0, 0).easing(cc.easeBounceIn()),
                cc.callFunc(() => startNode.active = false),
            ),
        );

        // 初始化
        this.FlightPlayer[roomInfo.playerIndex].pedestal.forEach((pedestal, index) => {
            const eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node; 
            eventHandler.component = 'flightChess';
            eventHandler.handler = 'chessTakeOff';
            eventHandler.customEventData = index.toString();
            const newButton = pedestal.node.addComponent(cc.Button);
            newButton.clickEvents.push(eventHandler);
            // console.log(index);
        });

        // 初始化房主信息
        this.userSendChess({
            next: {
                index: 0,
            },
        });

        // 隐藏聚焦圈
        this.FlightPlayer.forEach((player, index) => {
            player.pedestal.forEach(pedestal => {
                pedestal.node.children[0].active = false;
                // 保存棋子重生点
                if (!this.chessSpawn[index]) {
                    this.chessSpawn.push([]);
                }
                this.chessSpawn[index].push([ pedestal.node.x, pedestal.node.y ]);
            });
        });
    }


    /**
     * 游戏结束
     * @param data
     *  - false: 房主离开游戏触发
     */
    gameOver(data: any | false) {
    }


    /**
     * 当前玩家回合
     * @param data 
     */
    targetUser(data) {

    }


    /**
     * 投骰子时
     * @param diceNumber 数值
     */
    diceOut(dice: number, event: Event | number) {
        const { takeOff, roomInfo } = this;
        const { playerIndex } = roomInfo;
        // 如果 非出棋的点数 且 无棋可走
        if (typeof event !== 'number' && takeOff.indexOf(dice + 1) === -1 && roomInfo.gameData.chess[playerIndex].every(num => num === -2)) {
            // 通讯下一步
            State.io.emit('flightChess/setp', {
                to: dice + 1,
                chessIndex: -1,
                index: playerIndex,
            });
            this.setpNumber = -1;
            return;
        }
        
        // 显示聚焦圈
        this.FlightPlayer[playerIndex].pedestal.forEach(pedestal => pedestal.node.children[0].active = true);
        let focseState = 0;
        pedestalFouse = setInterval(() => {
            this.FlightPlayer[playerIndex].pedestal.forEach(pedestal => pedestal.node.children[0].runAction(
                focseState ? cc.fadeOut(1) : cc.fadeIn(1),
            ));
            focseState = focseState ? 0 : 1;
        }, 1000);
        this.setp({
            dice,
            index,
            flyIndex: -1,
        }, typeof event !== 'number');
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
        playerIndex?: number,
    ) {
        // console.log(move);
        playerIndex = playerIndex === undefined ? this.roomInfo.playerIndex : playerIndex;
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
                        move.from[move.index] = -3;
                        chess.spriteFrame = this.complete;
                        this.moveChess(chess, this.chessSpawn[playerIndex][move.index]);
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
            this.setpNumber = -1;
        }
    }


    /**
     * 返回首页
     */
    backHome() {
        const { playersData, node, popupPrefab } = this;
        // cc.director.loadScene('Home');
        // return;
        // console.log(State, playersData);
        if (!playersData.length || playersData.length === 1) {
            return this.gameOver(false);
        }
        const popup = cc.instantiate(popupPrefab);
        const scriptPopup = popup.getComponent('popup');
        node.parent.addChild(popup);
        playersData.forEach((item, index: number) => {
            if (item.id === State.userInfo.id) {
                console.log(index);
                scriptPopup.init('是否要返回大厅?\n' + (index ? '将退出房间' : '房间将被解散'));
                scriptPopup.setEvent('success', () => {
                    popup.destroy();
                    // this.roomExit();
                    cc.director.loadScene('Home');
                });
                scriptPopup.setEvent('close', () => {});
            }
        });
    }
}
