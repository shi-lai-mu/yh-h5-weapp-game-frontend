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
import { loadImg, setAutoRecursively } from '../../utils/tool';

const FlightPlayer = cc.Class({
    name: 'FlightPlayer',
    properties: {
        id: -1,
        box: cc.Node,
        nickName: cc.Label,
        pedestal: [ cc.Sprite ],
        avatarUrl: null,
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
    // 结算界面资源
    @property(cc.Prefab) chessPrefab: cc.Prefab = null;
    // 玩家数据
    roomInfo = {
        gameData: {
            chess: [],
        },
        players: [],
        roomCode: '',
        playerIndex: 1,
    };
    // 棋子出生点
    chessSpawn: number[][][] = [];
    // 允许起飞点数
    takeOff = [];
    // 行走点数
    setpNumber = -1;

    bindonGameData = (data) => this.onGameData(data);
    bindfetchRoomInfo = () => this.fetchRoomInfo();
    bindrommleave = (data) => this.rommleave(data);

    onLoad() {
        setAutoRecursively([
            // 'c3a88e04-eee8-42e6-ade2-27c6e1896203',
            // '5f4ed9fe-1373-449f-b83d-ba7179f2410d',
            // '0b7da469-5226-4405-aad7-56210d04d191',
            // 'c3a88e04-eee8-42e6-ade2-27c6e1896203',
            // 'db61dc3a-8854-4824-a19a-472e74d7aa03',
            // 'fc30fbe0-1668-4af2-8dcb-a798b469719b',
            // '9cf6f7b8-31d5-426f-9fc9-676a72df1701',
        ]);
        // cc.loader.setAutoRelease('5f4ed9fe-1373-449f-b83d-ba7179f2410d', true)
        // cc.loader.setAutoRelease('5e22369e-2b0d-4e53-b521-3327e4ddfcb3', true)
        console.log('load');
        const that = this;
        State.io.on('flightChess/gameData', that.bindonGameData);
        State.io.on('rommjoin', that.bindfetchRoomInfo);
        State.io.on('rommleave', that.bindrommleave);
        this.dice.getComponent('dice').onClickEvent = this.diceOut.bind(this);
        this.dice.getComponent(cc.Button).enabled = false;
        this.fetchRoomInfo();
        // 模拟测试
        // this.gameStart(this.roomInfo);
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
                const target = this.FlightPlayer[index];
                target.nickName.string = player.nickname;
                loadImg(`${player.avatarUrl ? player.id : 'default'}.png`, spriteFrame => {
                    target.avatarUrl = spriteFrame;
                }, 'avatar');
            });
            this.roomCode.string = '房间号: ' + res.roomCode;
            this.roomInfo = res;
            if (res.isStart) this.gameStart(res);
        });
    }

    onDestroy() {
        clearInterval(pedestalFouse);
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

        // 为自己的回合
        // console.log(romm.playerIndex, ioData.index , isPlayer);
        if (romm.playerIndex === ioData.index && isPlayer) {
            // 如果还有未起飞的棋子 且当前骰子点数为起飞点
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

        // 隐藏聚焦圈
        if (_e) this.clearFouseState();
        // console.log(_e);

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
        ioData = JSON.parse(ioData);
        if (ioData && ioData.data && ioData.data.id === this.roomInfo.players[0].id) {
            this.gameOver({ type: 0 });
        }
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
            player.pedestal.forEach((pedestal, o) => {
                pedestal.node.children[0].active = false;
                // 保存棋子重生点
                if (!this.chessSpawn[index]) {
                    this.chessSpawn.push([]);
                }
                this.chessSpawn[index].push([ pedestal.node.x, pedestal.node.y ]);
                // pedestal.node.x = this.chessSpawn[index][o][0];
                // pedestal.node.y = this.chessSpawn[index][o][1];
            });
        });
        // console.log(this.chessSpawn);
    }


    /**
     * 游戏结束
     * @param data
     *  - false: 房主离开游戏触发
     */
    gameOver(data: any | false) {
        console.log(data);
        const { node, popupPrefab, FlightPlayer, roomInfo } = this;
        if (data && data.type !== 0) {
            this.gameOver = () => {};
            const chessPrefab = cc.instantiate(this.chessPrefab);
            const chessScript = chessPrefab.getComponent('overScript');
            const chessData: any = [];
            console.log(data.gameData, data.gameData.score);
            roomInfo.players.forEach((player, index) => {
                const gamedata = data.gameData;
                console.log(index);
                chessData.push({
                    nickname: player.nickname,
                    avatarUrl: FlightPlayer[index].avatarUrl,
                    score: gamedata.score[index],
                    item: {
                        // noteScore: gamedata.noteScore[index],
                    },
                });
            });
            chessScript.init({
                players: chessData,
                // itemKey: {
                //     noteScore: '抓分',
                // },
                time: data.gameData.createTime,
                roomId: data.roomCode,
            });
            this.node.addChild(chessPrefab);
        } else if (roomInfo.playerIndex !== 0) {
            const popup = cc.instantiate(popupPrefab);
            const scriptPopup = popup.getComponent('popup');
            node.parent.addChild(popup);
            scriptPopup.init('房主已将房间解散!');
            scriptPopup.setEvent('success', () => {
                popup.destroy();
                this.roomExit();
                cc.director.loadScene('Home');
            });
        } else if (roomInfo.players.length === 1) {
            this.roomExit();
            cc.director.loadScene('Home');
        }
        console.log(roomInfo.players.length);
    }

    
    /**
     * 退出房间
     */
    roomExit() {
        axios.api('room_exit', {
            data: {
                roomCode: this.roomInfo.roomCode,
            },
        }).then(() => {});
    }



    /**
     * 当前玩家回合
     * @param data 
     */
    targetUser(data) {

    }


    /**
     * 清除棋子聚焦状态
     */
    clearFouseState() {
        this.FlightPlayer[this.roomInfo.playerIndex].pedestal.forEach(pedestal => pedestal.node.children[0].active = false);
        clearInterval(pedestalFouse);
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
            this.clearFouseState();
            return;
        }
        
        // 显示聚焦圈
        this.FlightPlayer[playerIndex].pedestal.forEach((pedestal, index) => {
            const targetChessIndex = this.roomInfo.gameData.chess[playerIndex][index];
            if ((this.takeOff.indexOf(dice) !== -1 && targetChessIndex !== -3) || targetChessIndex > -1) {
                pedestal.node.children[0].active = true
            }
        });
        let focseState = 0;
        // this.takeOff.indexOf(ioData.dice) !== -1 && targetChess.some(num => num === -2)
        // 聚焦闪动
        clearInterval(pedestalFouse);
        pedestalFouse = setInterval(() => {
            this.FlightPlayer[playerIndex].pedestal.forEach((pedestal, index) => {
                const targetChessIndex = this.roomInfo.gameData.chess[playerIndex][index];
                if ((this.takeOff.indexOf(dice) !== -1 && targetChessIndex !== -3) || targetChessIndex > -1) {
                    pedestal.node.children[0].runAction(
                        focseState ? cc.fadeOut(1) : cc.fadeIn(1),
                    );
                } else {
                    pedestal.node.children[0].active = false;
                }
            });
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
        playerTarget?: number,
    ) {
        // console.log(move);
        const playerIndex = playerTarget === undefined ? this.roomInfo.playerIndex : playerTarget;
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
                        // console.log('fly over');
                        move.from[move.index] = -3;
                        chess.spriteFrame = this.complete;
                        this.moveChess(chess, this.chessSpawn[playerIndex][move.index]);
                        clearInterval(clock);
                        // console.log(this.roomInfo.gameData);
                        return true;
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

                // 飞行结束
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
                            this.moveChess(chess, flyData, 1.5);
                            move.from[move.index] = tNotePoint.end;
                            // 降落后跳四格
                            setTimeout(() => {
                                move.to = tNotePoint.end + 4;
                                move.noJump = true;
                                this.moveChess(chess, point, duration, move, playerIndex);
                            }, 1500);
                        }, 500);
                    }

                    // 如果操作的飞机为自己的飞机 则判为操作者 否则为数据同步
                    // 检测是否覆盖到其他飞机上方
                    // 如果覆盖则吃掉下方的飞机 并 同步数据
                    // let existsChess = false;
                    this.roomInfo.gameData.chess.forEach((chessArr, index) => {
                        // console.log(playerTarget);
                        if (index !== playerTarget) {
                            chessArr.forEach((chessValue, chessIndex) => {
                                // console.log(chessIndex, move.to);
                                if (chessValue === move.to) {
                                    // 覆盖中
                                    // console.log(move.from, chessArr, chessIndex, move.to, playerTarget, this.roomInfo.playerIndex, move);
                                    move.from[chessIndex] = -2;
                                    this.roomInfo.gameData.chess[index][chessIndex] = -2;
                                    // console.log(move.from, this.chessSpawn[index], index, chessIndex);
                                    const backPoint = this.chessSpawn[index][chessIndex];
                                    backPoint[2] = index === 0
                                        ? 90 : index === 1
                                            ? 180 : index === 2
                                                ? -90 : 0
                                    ;
                                    this.moveChess(this.FlightPlayer[index].pedestal[chessIndex], backPoint);
                                    // existsChess = true;
                                    console.log('被吃');
                                }
                            })
                        }
                    });
                    // if (existsChess) return true;
                    // console.log('降落完毕');
                    // console.log(move, this.roomInfo.gameData.chess);
                }
                this.moveChess(chess, chessPoint[moveIndex]);
            }
            // 判断是否跳跃
            const endIndex = move.from[move.index] + moveSpace + (moveSpace > 1 ? -1 : 0);
            if (
                (endIndex) % 4 === playerIndex
                && endIndex !== tNotePoint.start
                && !move.noJump
                && move.from[move.index] + moveSpace - 1 !== tNotePoint.in
                && move.from[move.index] !== tNotePoint.in
            ) {
                const jumpSize = 4 + (moveSpace > 1 ? 0 : 1);
                moveSpace += jumpSize;
                move.to += jumpSize;
            }
            if (moveSpace !== 1) {
                clock = setInterval(moveTo, 500);
            }
            return moveTo();
        }

        if (point) {
            chess.node.runAction(
                cc.moveTo(point[3] || duration, point[0], point[1]),
            );
            if (point[2] !== undefined) {
                chess.node.runAction(
                    cc.rotateTo(duration, point[2]),
                );
            }
            this.setpNumber = -1;
        }
    }


    /**
     * 返回首页
     */ 
    backHome() {
        const { roomInfo, node, popupPrefab } = this;
        // cc.director.loadScene('Home');
        // return;
        // console.log(State, playersData);
        if (!roomInfo.players.length || roomInfo.players.length === 1) {
            return this.gameOver(false);
        }
        const popup = cc.instantiate(popupPrefab);
        const scriptPopup = popup.getComponent('popup');
        node.parent.addChild(popup);
        roomInfo.players.forEach((item, index: number) => {
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
