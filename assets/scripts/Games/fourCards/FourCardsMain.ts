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
import axios from '../../utils/axiosUtils';
import State from '../../utils/State';

const CardItem = cc.Class({
    name: 'cardItem',
    properties: {
        plum: [ cc.SpriteFrame ],
        heart: [ cc.SpriteFrame ],
        block: [ cc.SpriteFrame ],
        Spade: [ cc.SpriteFrame ],
        joker: [ cc.SpriteFrame ],
    }
});
let clock = null; // 计时器

@ccclass
export default class FourCardsGame extends cc.Component {

    @property(CardItem)
    Card = {
        /**
         * 梅花
         */
        plum: [],
        /**
         * 红心
         */
        heart: [],
        /**
         * 方块
         */
        block: [],
        /**
         * 黑桃
         */
        Spade: [],
        /**
         * 大小王
         */
        joker: [],
    }

    // 加入事件容器
    roomJoinEvent = () => this.fetchRoomInfo();
    // 下棋事件容器
    roomDataEevent = (data) => this.roomData(data);
    // 离开事件容器
    roomExitEevent = (data) => this.rommleave(data);

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 创建房间伪逻辑
        axios.api('create_room', {
            params: {
                gameName: 'fourCards',
            },
            data: {
                people: 4,
                frequency: 1,
                payType: 0,
                pwdType: 0,
            },
        }).then((res) => {
            console.log(res);
            if (res.status) {
                this.fetchRoomInfo();
            }
        });
        State.io.on('rommjoin', this.roomJoinEvent);
        State.io.on('room/data', this.roomDataEevent);
        State.io.on('rommleave', this.roomExitEevent);
        State.observer.on('socketConnect', this.onSocketConnect.bind(this))
    }


    /**
     * 开始游戏
     * @param cardData - 卡牌数组
     */
    gameStart (cardData: Array<{ [key: number]: number }>[]) {
        // // 随机的卡牌
        // const randomCard = [];
        const { Card } = this;
        const CardKey = Object.keys(Card);

        // // 随机牌
        // for (let i = 0; i < 54; i++) {
        //     let randomMain = Math.random() * 5 | 0;
        //     const randomChild = Math.random() * Card[CardKey[randomMain]].length | 0;

        //     // 如果非大小王
        //     if (randomMain === 4) {
        //         randomMain = 13;
        //     }
        //     if (!randomCard[randomChild]) randomCard[randomChild] = {};
        //     const cardIndex = randomCard[randomChild];
        //     if (!cardIndex[randomMain]) cardIndex[randomMain] = 0;
        //     cardIndex[randomMain]++;
        // }
        // console.log(randomCard);
        console.log(cardData[0]);

        // 模拟发牌
        const { node } = this;
        const screenWidth = node.width;
        const screenHeight = node.height;
        const cardList = [];
        // 断点行
        let startX = 0;
        // 扑克牌当前张数
        let cardCount = 0;
        for (let row = 0; row < cardData.length; row++) {
            const rowItem = cardData[row];
            const rowCard = Object.keys(rowItem);
            for (let col = 0; col < rowCard.length; col++) {
                // 主颜色
                let mainColor = row;
                // 子颜色
                let mainChildColor = rowCard[col];
                // 当前颜色的扑克牌张数
                const targetCardCount = rowItem[rowCard[col]];
                for (let renderIndex = 0; renderIndex < targetCardCount; renderIndex++) {
                    const targetFrame = this.Card[CardKey[mainColor]][mainChildColor];
                    const newNode = new cc.Node();
                    const nodeSprice = newNode.addComponent(cc.Sprite);
                    nodeSprice.spriteFrame = targetFrame;
                    let x, y = 0;
                    // 30: 每张牌可见距离， 0.5: 屏幕左侧开始  100: 安全距离
                    x = cardCount * 30 - (screenWidth * .5) + 100;
                    y -= (screenHeight * .5 - (newNode.height * .5));
        
                    // 一行占满 换行判断
                    if (x >= screenWidth * .5 - 100) {
                        // 断点开始换行
                        if (!startX) startX = cardCount;
                        x -= startX * 30;
                        // 60为往下
                        y -= 60;
                        // 三行判断
                        if (x >= screenWidth * .5 - 100) {
                            x -= startX * 30;
                            y -= 60;
                        }
                    }
                    newNode.x = 0;
                    newNode.y = 0;
                    
                    // 三行判断
                    this.node.addChild(newNode);
                    cardList.push({
                        node: newNode,
                        x,
                        y,
                    });
                    cardCount++;
                }
            }

            // setTimeout(() => {
            //     newNode.x = x;
            //     newNode.y = y;
            // }, i * 50);
            // let clock = setInterval(() => {
            // }, 100);

            // 全拍展示 【测试案例】
            // mainChildColor++;
            // if (mainChildColor === this.Card[CardKey[mainColor]].length) {
            //     mainColor++;
            //     mainChildColor = 0;
            // }
        }
        console.log(cardCount);

        let updatePoint = 0;
        let clock = setInterval(() => {
            const target = cardList[updatePoint];
            if (target && updatePoint < 54) {
                target.node.x = target.x;
                // target.node.x = target.x - 60;
                target.node.y = target.y;
                // target.node.runAction(cc.moveTo(.5, target.x, target.y));
                updatePoint++;
            } else {
                clearInterval(clock);
            }
        }, 50);

    }


    /**
     * Socket 连接时[通常情况下为重连]
     */
    onSocketConnect() {
        this.node.removeAllChildren();
        this.onLoad();
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
     * 当玩家加入房间时
     */
    private fetchRoomInfo() {
        axios.api('room_info').then(res => {
            console.log(res);
            // 检测是否已经开始游戏
            if (res.isStart && res.gameData && res.gameData.card) {
                this.gameStart(res.gameData.card[0]);
            }
        });
    }


    /**
     * 房间内接收到数据时
     * @param data - 房间内数据
     */
    private roomData(data) {
        console.log(data);
    }


    /**
     * 玩家离开游戏时
     * @param data - 数据
     */
    private rommleave(data) {
        console.log(data);
    }
    // update (dt) {}
}
