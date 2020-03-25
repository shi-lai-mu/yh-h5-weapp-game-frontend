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
import State from '../../utils/state';
import axios from '../../utils/axiosUtils';

/**
 * 玩家数据
 */
const PlayerItem = {
    dataIndex: 0,
    nickName: cc.Label,
    avatar: cc.Sprite,
    setp: cc.Label,
    timeOut: cc.Label,
};
const Player = cc.Class({
    name: 'PlayerItem',
    properties: PlayerItem,
})

let clock = null;         // 计时器
let count = 0;            // 总共赢的数量572种
const cooling = 5 * 60;   // 冷却时间
const box = [];           // 全部落子点
const wins = [];          // 全部赢的方法 三维数组
const myWin = [];         // 玩家落棋位置
const computerScore = []; // 电脑分数
const computerWin = [];   // 电脑落棋位置


@ccclass
export default class GoBangMainService extends cc.Component {
    // 棋子资源
    @property(cc.Prefab) qz: cc.Prefab = null;
    // 结算界面资源
    @property(cc.Prefab) chessPrefab: cc.Prefab = null;
    // 房间号
    @property(cc.Label) roomCode: cc.Label = null;
    // 弹窗
    @property(cc.Prefab) popupPrefab: cc.Prefab = null;
    // 主节点
    @property(cc.Canvas) Canvas: cc.Canvas = null;
    // 玩家
    @property(Player) Players: {
        dataIndex: number;
        nickName: cc.Label;
        avatar: cc.Sprite;
        setp: cc.Label;
        timeOut: cc.Label;
    }[] = [];
    // 玩家数据
    playersData: {
        id: number,
        nickname: string;
        avatarUrl: number;
        setp: number;
        timeOut: number;
        time: number,
    }[] = [];
    // 棋子数据
    picecArray: any = [];
    // 房间数据
    roomInfo: any = {};
    // 加入事件容器
    roomJoinEvent = () => this.fetchRoomInfo();
    // 下棋事件容器
    roomDataEevent = (data) => this.roomData(data);
    // 离开事件容器
    roomExitEevent = (data) => this.rommleave(data);
    // 是否为人机模式
    isMachine: boolean = !1;


    /**
     * 界面加载时
     */
    onLoad() {
        // 获取房间数据并且绑定事件
        console.log(State.io);
        State.io.on('rommjoin', this.roomJoinEvent);
        this.fetchRoomInfo();
        State.io.on('room/data', this.roomDataEevent);
        State.io.on('rommleave', this.roomExitEevent);
        cc.loader.setAutoReleaseRecursively('fc30fbe0-1668-4af2-8dcb-a798b469719b', true);
    }


    /**
     * 游戏场景销毁时
     */
    onDestroy() {
        // 接触IM玩家加入房间事件绑定
        State.io.off('rommjoin', this.roomJoinEvent);
        State.io.off('room/data', this.roomDataEevent);
        State.io.off('rommleave', this.roomExitEevent);
        clock && clearInterval(clock);
    }


    /**
     * 返回首页
     */
    backHome() {
        const popup = cc.instantiate(this.popupPrefab);
        this.Canvas.node.addChild(popup);
        const scriptPopup = popup.getComponent('popup');
        console.log(State, this.playersData);
        this.playersData.forEach((item, index: number) => {
            if (item.id === State.userInfo.id) {
                console.log(index);
                scriptPopup.init('是否要返回大厅?\n' + (index ? '将退出房间' : '房间将被解散'));
                scriptPopup.setEvent('success', () => {
                    this.gameOver({ type: index ? 0 : 1 });
                });
                scriptPopup.setEvent('close', () => {});
            }
        });
    }


    /**
     * 开始游戏
     */
    startGame() {
        this.initPiece();
        const { Players } = this;
        Players.forEach((player: any, index) => {
            player.setp.string = 0;
            player.timeOut.string = timeFrom(0);
            this.playersData[0].timeOut = cooling;
        });
        !clock && (clock = setInterval(() => {
            this.playersData.forEach((player, index) => {
                if (player.timeOut) {
                    player.timeOut--;
                    Players[index].timeOut.string = timeFrom(player.timeOut);
                    if(player.timeOut === 0) {
                        this.gameOver({
                            type: index ? 0 : 1,
                        });
                    }
                } else if (player.timeOut === 0) {
                    Players[index].timeOut.string = timeFrom(0);
                }
            })
        }, 1000));
    }


    /**
     * 游戏结束
     * @param point - 棋子坐标
     */
    gameOver(picec: any) {
        const { Players, playersData } = this;
        const chessPrefab = cc.instantiate(this.chessPrefab);
        this.node.parent.addChild(chessPrefab);
        const chessScript = chessPrefab.getComponent('overScript');
        const winnerUser = playersData[picec.type];
        const loserUser = playersData[picec.type ? 0 : 1];
        axios.api('room_exit', {
            data: {
                roomCode: this.roomInfo.id,
            },
        }).then(() => {});

        if (!winnerUser) {
            cc.director.loadScene('Home');
            return;
        }

        chessScript.init({
            players: [{ 
                nickname: winnerUser.nickname,
                avatarUrl: Players[picec.type].avatar.spriteFrame,
                score: winnerUser.setp
                    ? Math.round(winnerUser.setp + ((cooling - (winnerUser.time || 1) / winnerUser.setp) || 0))
                    : 0,
                item: {
                    setp: winnerUser.setp + 1,
                    time: winnerUser.setp ? Math.floor(winnerUser.time / winnerUser.setp) + 's' : 0,
                },
                winner: !0,
            },{ 
                nickname: loserUser.nickname,
                avatarUrl: Players[picec.type ? 0 : 1].avatar.spriteFrame,
                score: loserUser.setp
                    ? Math.round(loserUser.setp + ((cooling / 2 - (loserUser.time || 1) / loserUser.setp) || 0))
                    : 0,
                item: {
                    setp: loserUser.setp,
                    time: loserUser.setp ? Math.floor(loserUser.time / loserUser.setp) + 's' : 0,
                },
                winner: !1,
            }],
            itemKey: {
                setp: '步数',
                time: '平均耗时',
            },
            time: State.gameData.gameData.createTime,
            roomId: State.gameData.roomCode,
        });
    }


    /**
     * 离开房间事件
     * @param data - 离开房间数据
     */
    rommleave(data) {
        data = typeof data === 'string' ? JSON.parse(data) : data;
        this.gameOver({
            type: data.id ? 0 : 1,
        });
    }


    /**
     * 获取房间信息
     */
    fetchRoomInfo() {
        const that = this;
        axios.api('room_info').then(res => {
            if (res.status !== false && res.players) {
                that.roomInfo = res;
                that.roomCode.string = res.roomCode;
                that.playersData = [];
                (res.players || []).forEach((player) => this.playerJoin(player));
                State.gameData = res;

                // 开始游戏判断
                if (res.isStart) {
                    this.startGame();
                }
            } else {
                // 异常加入游戏房间，踢出到首页
                // cc.director.loadScene('Home');
                // 人机模式
                this.playerJoin(State.userInfo);
                this.playerJoin({
                    id: -1,
                    nickname: '电脑玩家',
                    avatarUrl: 0,
                });
                State.gameData = {
                    id: 1,
                    gameName: 'gobang',
                    name: '五子棋 人机对战',
                    peopleMax: 0,
                    frequency: 0,
                    payType: 0,
                    pwdType: 0,
                    roomCode: "------",
                    roomPwd: -1,
                    gameData: { createTime: Date.now(), blackSetp: 0, whiteSetp: 0, target: 0 },
                    players: this.playersData,
                    isStart: !0,
                }
                this.isMachine = !0;
                this.startGame();
                this.initModel();
            }
        });
    }

    
    /**
     * 玩家加入房间
     * @param userInfo - 玩家数据
     */
    playerJoin(userInfo: { id: number; nickname: string; avatarUrl: number; }) {
        const avatarBase = 'https://perfergame.oss-cn-beijing.aliyuncs.com/avatar';
        const userIndex = this.playersData.push({
            ...userInfo,
            setp: 0,
            timeOut: 0,
            time: 0,
        }) - 1;
        const target = this.Players[userIndex];
        target.dataIndex = userIndex;
        loadImg(`${avatarBase}/${userInfo.avatarUrl ? userInfo.id : 'default'}.png`, (spriteFrame) => {
            target.avatar.spriteFrame = spriteFrame;
        });
        target.nickName.string = userInfo.nickname;
    }


    /**
     * 下棋时
     * @param data - 棋子坐标
     */
    roomData(data: { x: number; y: number; s: number; }) {
        data = typeof data === 'string' ? JSON.parse(data) : data;
        console.log(data);
        if (!data || data.y === undefined || data.x === undefined || data.s === undefined) return;
        console.log(1);
        const arr = this.picecArray;
        const targetPiece = arr[data.y][data.x];
        const senderID = data.s;
        const senderUser = this.playersData[senderID];
        const senderPlayer = this.Players[senderID];
        if (targetPiece) {
            targetPiece.script.ioClick(senderID);
        }
        senderUser.time += cooling - senderUser.timeOut;
        senderUser.timeOut = 0;
        senderUser.setp++;
        senderPlayer.timeOut.string = timeFrom(0);
        senderPlayer.setp.string = String(this.playersData[data.s].setp);

        this.playersData[senderID ? 0 : 1].timeOut = cooling;
        box[data.y][data.x] = 1;
    }


    /**
     * 人机下棋
     * @param data - 棋子坐标
     */
    machineDownPiece(data: { x: number; y: number; s: number; }) {
        this.roomData(data);

        var myScore = []; //我方分数
        var max = 0; //最大分数
        var u = 0, v = 0; //最大分数点
        for(var k = 0; k<count; k++) {//第几种赢法
            if(wins[data.y][data.x][k]) {
                myWin[k]++;
                computerWin[k] = 999; //因为我方在这个点上已经落子，所以计算机不可能在这个点上赢，
                // if(myWin[k] == 5) {
                //     console.log('你赢了')
                // }
            }
        }
        for (var i = 0; i < 15; i++) {
            myScore[i] = [];
            computerScore[i] = [];
            for (var j = 0; j < 15; j++) {
                myScore[i][j] = 0;
                computerScore[i][j] = 0;
            }
        }
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if (box[i][j] == -1) { //每个空闲点上进行计算分数
                    for (var k = 0; k < count; k++) { //遍历所有可以赢的，数量
                        if (wins[i][j][k]) { //可以赢的点进行算分
                            if (myWin[k] == 1) {
                                myScore[i][j] += 200;
                            } else if (myWin[k] == 2) {
                                myScore[i][j] += 400;
                            } else if (myWin[k] == 3) {
                                myScore[i][j] += 2000;
                            } else if (myWin[k] == 4) {
                                myScore[i][j] += 10000;
                            }

                            if (computerWin[k] == 1) {
                                computerScore[i][j] += 220;
                            } else if (computerWin[k] == 2) {
                                computerScore[i][j] += 420;
                            } else if (computerWin[k] == 3) {
                                computerScore[i][j] += 2100;
                            } else if (computerWin[k] == 4) {
                                computerScore[i][j] += 20000;
                            }
                        }
                    }
                    //得出最大分数的点，并赋给u,v
                    if (myScore[i][j] > max) {
                        max = myScore[i][j];
                        u = i;
                        v = j;
                    } else if (myScore[i][j] == max) {
                        if (computerScore[i][j] > computerScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }

                    if (computerScore[i][j] > max) {
                        max = computerScore[i][j];
                        u = i;
                        v = j;
                    } else if (computerScore[i][j] == max) {
                        if (myScore[i][j] > myScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }

                }//所有空闲点上进行计算分数
            }
        }
        this.roomData({
            y: u,
            x: v,
            s: 1,
        });
        for (var k = 0; k < count; k++) {//第几种赢法
            if (wins[u][v][k]) {
                computerWin[k]++;
                myWin[k] = 999;
                // if (computerWin[k] == 5) {
                //     console.log('计算机赢了--')
                // }
            }
        }
    }


    /**
     * 渲染时
     */
    initPiece() {
        // 获取玩家棋子ID
        let poeceID = -1;
        State.gameData.players.forEach((player, index) => {
            if (player.id === State.userInfo.id) {
                poeceID = index;
            }
        });
        if (poeceID === -1) {
            return;
        }

        const arr = this.picecArray;
        // 预设棋盘棋子为透明定位至方格上
        for (let y = 0; y < 15; y++) {
            box[y] = [];
            wins[y] = [];
            arr.push([]);
            for (let x = 0; x < 15; x++) {
                box[y][x] = -1;
                wins[y][x] = [];
                const newQz = cc.instantiate(this.qz);
                const qzScript = newQz.getComponent('qz');
                const Point = {
                    row: y,
                    col: x,
                    x: x * 36.5 - (36.5 * 7),
                    y: y * 36 + (36 * 7) - (y * 2 * 36),
                    pieceType: -1,
                    script: qzScript,
                };
                qzScript.init(Point);
                qzScript.game = this;
                qzScript.pieceType = poeceID;

                this.node.addChild(newQz);
                newQz.x = Point.x;
                newQz.y = Point.y;

                arr[arr.length - 1].push(Point);
            }
        }
    }


    /**
     * 五子连通检测
     * @param point     - 棋子坐标
     * @param pieceType - 棋子类型 0：黑子  1：白子
     */
    checkConnectivity(point: Point, pieceType: ( 0 | 1 ) = 1) {
        const { picecArray } = this;
        // y轴判断是否连通
        const targetPiece = {
            type: pieceType,
            x: 0,
            y: 0,
            skewX: 0,
            skewY: 0,
        };
        // Y轴
        for (let y = -4; y <= 4; y++) {
            // Y轴
            const pointY = point.row + y;
            if (picecArray[pointY]) {
                const item = picecArray[pointY][point.col];
                if (targetPiece.type === item.pieceType) {
                    targetPiece.y++;
                    if (targetPiece.y === 5) return this.gameOver(targetPiece);
                } else {
                    targetPiece.y = 0;
                }
            }
            // X轴
            let pointX = point.col + y;
            if (picecArray[point.row][pointX]) {
                const item = picecArray[point.row][pointX];
                if (targetPiece.type === item.pieceType) {
                    targetPiece.x++;
                    if (targetPiece.x === 5) return this.gameOver(targetPiece);
                } else {
                    targetPiece.x = 0;
                }
            }
            // skew X
            if (picecArray[pointY] && picecArray[pointY][pointX]) {
                const item = picecArray[pointY][pointX];
                if (targetPiece.type === item.pieceType) {
                    targetPiece.skewX++;
                    if (targetPiece.skewX === 5) return this.gameOver(targetPiece);
                } else {
                    targetPiece.skewX = 0;
                }
            }
            // skew Y
            pointX = point.col + (- y);
            if (picecArray[pointY] && picecArray[pointY][pointX]) {
                const item = picecArray[pointY][pointX];
                if (targetPiece.type === item.pieceType) {
                    targetPiece.skewY++;
                    if (targetPiece.skewY === 5) return this.gameOver(targetPiece);
                } else {
                    targetPiece.skewY = 0;
                }
            }
        }
    }


    /**
     * 初始化模型
     */
    initModel() {
        for (var i = 0; i < 15; i++) {
            wins[i] = [];
            for (var j = 0; j < 15; j++) {
                wins[i][j] = [];
            }
        }
        //横向
        for (var a = 0; a < 15; a++) {
            for (var b = 0; b < 11; b++) {
                for (var c = 0; c < 5; c++) {
                    wins[a][b + c][count] = true;
                }
                count++;
            }
        }
        //纵向
        for (var a = 0; a < 15; a++) {
            for (var b = 0; b < 11; b++) {
                for (var c = 0; c < 5; c++) {
                    wins[b + c][a][count] = true;
                }
                count++;
            }
        }

        //斜 '\'
        for (var a = 0; a < 11; a++) {
            for (var b = 0; b < 11; b++) {
                for (var c = 0; c < 5; c++) {
                    wins[a + c][b + c][count] = true;
                }
                count++;
            }
        }
        //反斜 '/'
        for (var a = 0; a < 11; a++) {
            for (var b = 4; b < 15; b++) {
                for (var c = 0; c < 5; c++) {
                    wins[a + c][b - c][count] = true;
                }
                count++;
            }
        }

        for(var i = 0; i < count;i++) {
            myWin[i] = 0;
            computerWin[i] = 0;
        }
    }

    // update (dt) {}
}

/**
 * 转换时间为00:00的格式
 * @param time - 时间
 */
function timeFrom(time) {
    return `00${Math.floor(time / 60)}`.substr(-2) + ':' + `00${Math.floor(time % 60)}`.substr(-2);
}


/**
 * 加载图片
 * @param url      - 图片url
 * @param callback - 回调函数
 */
const loadImg = (url, callback) => {
    cc.loader.load(url, (_error, texture) => {
        callback(new cc.SpriteFrame(texture));
    });
}

/**
 * 棋子坐标
 */
interface Point {
    row: number;
    col: number;
    pieceType: ( 0 | 1 | -1 )
}