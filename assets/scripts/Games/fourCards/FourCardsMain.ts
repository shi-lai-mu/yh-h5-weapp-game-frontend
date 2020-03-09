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
import State from '../../utils/state';
/**
 * 扑克牌
 */
const CardItem = cc.Class({
    name: 'cardItem',
    properties: {
        plum: [ cc.SpriteFrame ],  // 梅花
        heart: [ cc.SpriteFrame ], // 红心
        block: [ cc.SpriteFrame ], // 方块
        Spade: [ cc.SpriteFrame ], // 黑桃
        joker: [ cc.SpriteFrame ], // 大小王
    }
});
/**
 * 玩家
 */
const FourCardsPlayers = {
    nickname: cc.Label,    // 昵称
    score: cc.Label,       // 分数
    noteScore: cc.Label,   // 抓分分数
    cardCount: cc.Label,   // 剩余扑克牌数量
    avatarUrl: cc.Sprite,  // 头像
    cardPoint: cc.Node,    // 发牌位置
}
const FourCardsPlayersItem = cc.Class({
    name: 'FourCardsPlayers',
    properties: FourCardsPlayers,
});
let clock = null; // 计时器

@ccclass
export default class FourCardsGame extends cc.Component {

    /**
     * 发牌位置
     */
    @property(cc.Node)
    cardBox: cc.Node = null;

    /**
     * 玩家节点数据
     */
    @property(FourCardsPlayersItem)
    FourCardsPlayers: typeof FourCardsPlayers[] = [];

    /**
     * 扑克牌遮罩节点
     */
    @property(cc.Prefab)
    cardsMask: cc.Prefab = null;

    /**
     * 桌面机制
     */
    desktop: {
        score: number;
        card: cc.Node[];
    } = {
        score: 0,
        card: [],
    };

    /**
     * 玩家数据
     */
    playersData: {
        id: number,
        nickname: string;
        avatarUrl: number;
        setp: number;
        timeOut: number;
        time: number,
    }[] = [];

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
    };

    // 已有扑克牌
    cardList = [];

    // 下棋事件容器
    roomDataEevent = (data) => this.roomData(data);
    // 离开事件容器
    roomExitEevent = (data) => this.rommleave(data);

    onLoad () {
        // 创建房间伪逻辑
        // axios.api('create_room', {
        //     params: {
        //         gameName: 'fourCards',
        //     },
        //     data: {
        //         people: 4,
        //         frequency: 1,
        //         payType: 0,
        //         pwdType: 0,
        //     },
        // }).then((res) => {
        //     if (res.status) {
        //         this.fetchRoomInfo();
        //     }
        // });
        this.fetchRoomInfo();
        State.io.on('rommjoin', this.fetchRoomInfo.bind(this));
        State.io.on('room/data', this.roomDataEevent);
        State.io.on('rommleave', this.roomExitEevent);
        State.observer.on('socketConnect', this.onSocketConnect.bind(this))
    }


    /**
     * 开始游戏
     * @param cardData - 卡牌数组
     */
    gameStart (cardData: Array<{ [key: number]: number }>) {
        // // 随机的卡牌
        // const randomCard = [];
        const { Card } = this;
        const CardKey = Object.keys(Card);
        // 模拟发牌
        const { node, cardList } = this;
        const screenHeight = node.height;
        // 扑克牌当前张数
        let cardCount = 0;
        // 排序
        const sortCard = [];
        if (cardData.length === 4) {
            cardData.unshift({});
        }
        for (let num = 0; num < 13; num++) {
            sortCard[num] = [];
            for (let row = 0; row < cardData.length - 1; row++) {
                const targetCard = cardData[row][num];
                if (Object.keys(cardData[row]).length) {
                    targetCard && sortCard[num].push(...Array(targetCard).fill(row));
                }
            }
        }
        // 大小王
        let jokers = cardData[4];
        if (jokers) {
            sortCard.unshift([]);
            Object.keys(jokers).forEach((num) => {
                jokers[num] && sortCard[0].push(...Array(jokers[num]).fill(num));
            });
        }
        if (!Object.keys(cardData[0]).length) {
            sortCard[0] = [];
        }
        for (let row = 0; row < sortCard.length; row++) {
            const rowItem = sortCard[row];
            for (let col = 0; col < rowItem.length; col++) {
                // 主颜色
                let mainColor = row !== 0 ? rowItem[col] : 4;
                // 子颜色
                let mainChildColor = row !== 0 ? row - 1 : rowItem[col];
                // 当前颜色的扑克牌张数
                const targetFrame = this.Card[CardKey[mainColor]][mainChildColor];
                const newNode = new cc.Node();
                const mask = cc.instantiate(this.cardsMask);
                newNode.addChild(mask);
                mask.opacity = 0;
                newNode.scale = .6;
                const nodeSprice = newNode.addComponent(cc.Sprite);
                nodeSprice.spriteFrame = targetFrame;
                let x, y = 0;
                // 30: 每张牌可见距离， 0.5: 屏幕左侧开始  100: 安全距离
                x = (cardCount * 15) - 400;
                y = 50;
                
                // 三行判断
                var clickEventHandler = new cc.Component.EventHandler();
                //这个 node 节点是你的事件处理代码组件所属的节点
                clickEventHandler.target = this.node; 

                //这个是代码文件名
                clickEventHandler.component = "FourCardsMain";
                clickEventHandler.handler = "onClickCard";
                clickEventHandler.customEventData = cardCount.toString();
                const newButton = newNode.addComponent(cc.Button);
                newButton.clickEvents.push(clickEventHandler);
                this.cardBox.addChild(newNode);

                // 放置到屏幕最上方
                newNode.y = newNode.height + screenHeight;

                // 显示数字
                if (col === 0 && row !== 0) {
                    this.addCardNumber(rowItem.length, newNode);
                }

                cardList.push({
                    node: newNode,
                    x,
                    y,
                    number: row,
                    row: mainColor,
                    col: mainChildColor,
                    buttonScipt: newButton,
                    clickEventHandler,
                    mask,
                });
                cardCount++;
            }
        }
        
        // setTimeout(() => {
        //     this.outCard([0, 6, 10, 15, 30, 31], this.playersData[0])
        // }, 3000)

        let updatePoint = 0;
        let clock = setInterval(() => {
            const target = cardList[updatePoint];
            if (target && updatePoint < cardList.length) {
                target.node.x = target.x;
                target.node.y = target.y;
                // target.node.x = target.x - 60;
                // target.node.runAction(cc.moveTo(.03, target.x, target.y));
                updatePoint++;
            } else {
                clearInterval(clock);
            }
        }, 50);

    }


    /**
     * 扑克牌点击事件
     * @param _e        - 事件体
     * @param cardIndex - 扑克牌下标
     */
    onClickCard(_e, cardIndex: string) {
        const cardInfo = this.cardList[cardIndex];
        const targetNode = cardInfo.node;
        targetNode.runAction(
            cc.moveTo(.2, targetNode.x, targetNode.y + ( cardInfo.isSelect ? -20 : 20 )).easing(cc.easeBackOut()),
        );
        // cardInfo.buttonScipt.interactable = false;
        // cardInfo.mask.opacity = 255;
        cardInfo.isSelect = !cardInfo.isSelect;
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
        State.io.off('rommjoin', this.fetchRoomInfo);
        State.io.off('room/data', this.roomDataEevent);
        State.io.off('rommleave', this.roomExitEevent);
        clock && clearInterval(clock);
    }


    /**
     * 发牌
     *  - 选中的牌进行发牌操作
     */
    dealCards() {
        // 销毁桌前的扑克牌
        if (this.desktop.card.length) {
            this.desktop.card.forEach((card) => card.destroy());
        }
        const selectCard = [];
        this.cardList.forEach((item, index) => {
            if (item.isSelect) {
                selectCard.push(index);
            }
        });
        this.outCard(selectCard, this.playersData[0]);
    }


    /**
     * 发牌动作
     */
    outCard(cards, player) {
        const { id, index } = player;
        const { cardList } = this;
        const cardsBox = this.FourCardsPlayers[index].cardPoint;
        const cardsReverse = [];
        cards.reverse().forEach((card ) => {
            cardsReverse.push(cardList.splice(card, 1));
        })
        cardsReverse.reverse().forEach((card, offset) => {
            if (card[0]) {
                const node = card[0].node;
                // 出牌后删除纸牌上的数字
                if (node.children.length === 2) {
                    node.children[1].destroy();
                }
                // 扑克牌缓动效果
                node.runAction(
                    cc.moveTo(.2,  cardsBox.x + (15 * offset) - 400, cardsBox.y).easing(cc.easeBackOut()),
                );
                this.desktop.card.push(node);
            }
        });
        this.updateCardPoint();
    }


    /**
     * 重新刷新扑克牌位置
     */
    updateCardPoint() {
        const { cardList } = this;
        let prevNumber = -1; // 上类扑克牌标识
        let prevCount = 0;   // 上类扑克牌数量
        let prevNode = null; // 上类扑克牌节点
        cardList.forEach((card, index) => {
            // card.node.x = index * 15;
            const { node } = card;
            card.clickEventHandler.customEventData = index;

            // 如果判定到位最后一张非同类牌 进行重置
            if (prevNumber !== card.number || index === cardList.length - 1) {
                if (prevNode && prevNumber !== 0) {
                    // 如果为全部的最后一张牌
                    if (index == cardList.length - 1 && prevNumber !== card.number) { 
                        if (card.node.children.length !== 2) {
                            this.addCardNumber('1', card.node);
                        } else {
                            const labelNode = card.node.children[1].getComponent(cc.Label);
                            if (labelNode.string && labelNode.string !== '1') {
                                labelNode.string = '1';
                            }
                        }
                    }
                    // 如果目标扑克牌存在文本节点则修改内容 否则 创建文本节点
                    const prevCountStr = prevCount.toString();
                    if (prevNode.node.children.length !== 2) {
                        this.addCardNumber(prevCountStr, prevNode.node);
                    } else {
                        const labelNode = prevNode.node.children[1].getComponent(cc.Label);
                        if (labelNode.string && labelNode.string !== prevCountStr) {
                            labelNode.string = prevCountStr;
                        }
                    }
                }
                prevNumber = card.number;
                prevCount = 0;
                prevNode = card;
            }
            prevCount++;
            node.runAction(
                cc.moveTo(.5, index * 15 - 400, node.y).easing(cc.easeBackOut()),
            )
        });
    }

    
    /**
     * 当玩家加入房间时
     */
    fetchRoomInfo() {
        axios.api('room_info').then(res => {
            console.log(res);
            // 检测是否已经开始游戏
            if (res.isStart && res.players[res.playerIndex]) {
                this.gameStart(res.players[res.playerIndex].card);
                this.playersData = res.players.map((player, index) => {
                    player.index = index;
                    return player;
                });
            }
        });
    }


    /**
     * 房间内接收到数据时
     * @param data - 房间内数据
     */
    roomData(data) {
        console.log(data);
    }


    /**
     * 玩家离开游戏时
     * @param data - 数据
     */
    rommleave(data) {
        console.log(data);
    }
    // update (dt) {}


    /**
     * 为扑克牌添加数量
     * @param number  - 扑克牌数量
     * @param newNode - 扑克牌节点
     */
    addCardNumber(number: string, newNode: any) {
        const labelNode = new cc.Node();
        const label = labelNode.addComponent(cc.Label);
        label.string = number;
        labelNode.x = -50   ;
        labelNode.y += 20;
        labelNode.color = cc.color(63, 110, 146);
        label.fontSize = 30;
        newNode.addChild(labelNode);
    }
}
