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
// 初始化棋子
let initS = !1;
let clock = null;
const cooling = 5 * 60;

@ccclass
export default class GoBangMainService extends cc.Component {
    // 棋子资源
    @property(cc.Prefab) qz: cc.Prefab = null;
    // 结算界面资源
    @property(cc.Prefab) chessPrefab: cc.Prefab = null;
    // 房间号
    @property(cc.Label) roomCode: cc.Label = null;
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
    }[] = [];
    // 棋子数据
    picecArray: any = [];
    // 房间数据
    roomInfo = {};
    roomJoinEvent = () => this.fetchRoomInfo()

    /**
     * 界面加载时
     */
    onLoad() {
        // 获取房间数据并且绑定事件
        State.io.on('rommjoin', this.roomJoinEvent);
        this.fetchRoomInfo();
        State.io.on('room/data', this.roomData);
        State.io.on('rommleave', (data) => {
            console.log(data);
            this.gameOver(data);
        });
    }


    /**
     * 下棋时
     */
    roomData(data) {
        const arr = this.picecArray;
        data = JSON.parse(data);
        const targetPiece = arr[data.y][data.x];
        const senderID = data.s;
        const senderUser = this.playersData[senderID];
        const senderPlayer = this.Players[senderID];
        if (targetPiece) {
            targetPiece.script.ioClick(senderID);
        }
        senderUser.timeOut = 0;
        senderUser.setp++;
        senderPlayer.timeOut.string = timeFrom(0);
        senderPlayer.setp.string = String(this.playersData[data.s].setp);

        this.playersData[senderID ? 0 : 1].timeOut = cooling;
    }


    /**
     * 获取房间信息
     */
    fetchRoomInfo() {
        const that = this;
        const { Players } = that;
        axios.api('room_info').then(res => {
            if (res.status !== false && res.players) {
                that.roomInfo = res;
                that.roomCode.string = res.roomCode;
                that.playersData = [];
                (res.players || []).forEach((player) => this.playerJoin(player));
                State.gameData = res;
                !initS && this.initPiece();

                // 开始游戏判断
                if (res.isStart) {
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
                            } else if (player.timeOut === 0) {
                                Players[index].timeOut.string = timeFrom(0);
                            }
                        })
                    }, 1000));
                }
            } else {
                // 异常加入游戏房间，踢出到首页
                // cc.director.loadScene('Home');
                // 人机模式

                // this.gameOver({});
            }
        });
    }


    /**
     * 游戏场景销毁时
     */
    onDestroy() {
        // 接触IM玩家加入房间事件绑定
        State.io.off('rommjoin', this.roomJoinEvent);
        State.io.off('room/data', this.roomData);
        clock && clearInterval(clock);
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
            arr.push([]);
            for (let x = 0; x < 15; x++) {
                const newQz = cc.instantiate(this.qz);
                const qzScript = newQz.getComponent('qz');
                const Point = {
                    row: y,
                    col: x,
                    x: x * 36.5 - (36.5 * 7),
                    y: y * 36 - (36 * 7),
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
        initS = !0;
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
        }) - 1;
        const target = this.Players[userIndex];
        target.dataIndex = userIndex;
        loadImg(`${avatarBase}/${userInfo.avatarUrl ? userInfo.id : 'default'}.png`, (spriteFrame) => {
            target.avatar.spriteFrame = spriteFrame;
        });
        target.nickName.string = userInfo.nickname;
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
     * 游戏结束
     */
    gameOver(picec: any) {
        console.log('GAME OVER!!');
        console.log(picec);
        const { Players } = this;
        const chessPrefab = cc.instantiate(this.chessPrefab);
        this.node.parent.addChild(chessPrefab);
        const chessScript = chessPrefab.getComponent('overScript');
        chessScript.init({
            players: [{ 
                nickname: 'shilaimu',
                avatarUrl: Players[0].avatar.spriteFrame,
                score: '10',
                item: {
                    allTime: 12,
                },
                winner: !0,
            }],
            itemKey: [],
            time: 1581941094008,
            roomId: 1,
        })
    }

    // update (dt) {}
}

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


interface Point {
    row: number;
    col: number;
    pieceType: ( 0 | 1 | -1 )
}