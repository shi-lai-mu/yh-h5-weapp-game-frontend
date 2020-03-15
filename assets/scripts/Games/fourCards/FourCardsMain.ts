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
import { loadImg } from '../../utils/tool';
import { ioOnData, CardList, FourCardsPlayers, SendCardData, UserData } from '../../interface/game/fourCard';
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
const FourCardsPlayersItem = cc.Class({
    name: 'FourCardsPlayers',
    properties: {
        nickname: cc.Label,    // 昵称
        score: cc.Label,       // 分数
        noteScore: cc.Label,   // 抓分分数
        cardCount: cc.Label,   // 剩余扑克牌数量
        avatarUrl: cc.Sprite,  // 头像
        cardPoint: cc.Node,    // 发牌位置
    },
});
let clock = null;          // 计时器
let cardList = {};         // 选中的扑克牌
let countDownClock = null; // 倒计时

@ccclass
export default class FourCardsGame extends cc.Component {
    /**
     * 发牌位置
     */
    @property(cc.Node) cardBox: cc.Node = null;
    /**
     * 房间号节点
     */
    @property(cc.Label) roomIdLabel: cc.Label = null;
    /**
     * 玩家节点数据
     */
    @property(FourCardsPlayersItem) FourCardsPlayers: FourCardsPlayers[] = [];
    /**
     * 扑克牌遮罩节点
     */
    @property(cc.Prefab) cardsMask: cc.Prefab = null;
    /**
     * 结算界面资源
     */
    @property(cc.Prefab) chessPrefab: cc.Prefab = null;
    /**
     * 等待加入中 文字
     */
    @property(cc.Node) wait_player_join: cc.Node = null;
    /**
     * 弹窗资源
     */
    @property(cc.Prefab) popupPrefab: cc.Prefab = null;
    /**
     * 倒计时 时钟载体
     */
    @property(cc.Node) clockBox: cc.Node = null;
    /**
     * 倒计时 时钟内容
     */
    @property(cc.Label) clockContent: cc.Label = null;
    /**
     * 发牌按钮
     */
    @property(cc.Button) setpBtn: cc.Button = null;
    /**
     * 跳过的按钮
     */
    @property(cc.Button) skipBtn: cc.Button = null;
    /**
     * 不出文字
     */
    @property(cc.SpriteFrame) skipSpriteFrame: cc.SpriteFrame = null;

    /**
     * 桌面机制
     */
    desktop: { score: number; card: cc.Node[]; } = {
        score: 0,
        card: [],
    };

    /**
     * 玩家数据
     */
    playersData: UserData[] = [];
    
    /**
     * 房间数据
     */
    roomInfoData: any = {};

    /**
     * 已有扑克牌
     */
    cardList: CardList[] = [];

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

    onLoad() {
        // // 创建房间伪逻辑
        // axios.api('create_room', {
        //     params: {
        //         gameName: 'fourCards',
        //     },
        //     data: {
        //         people: 0,
        //         frequency: 1,
        //         payType: 0,
        //         pwdType: 0,
        //     },
        // }).then((res) => {
        //     if (res.status) {
        //         this.fetchRoomInfo();
        //     }
        // });
        const that = this;
        const { setpBtn, skipBtn } = that;

        that.fetchRoomInfo();
        State.io.on('fourcard/gameData', that.onGameData.bind(that));
        State.io.on('rommjoin', that.fetchRoomInfo.bind(that));
        State.io.on('room/data', that.roomData.bind(that));
        State.io.on('rommleave', that.rommleave.bind(that));
        State.observer.on('socketConnect', that.onSocketConnect.bind(that));
        setpBtn.node.active = false;
        skipBtn.node.active = false;
        // clockBox.active = false;
    }


    /**
     * 接收到游戏数据时
     * @param data - IO数据
     */
    onGameData(data: any) {
        data = typeof data === 'string' ? JSON.parse(data) : data;
        console.log(typeof data, data);
        data.callback && data.msg && this[data.callback](data.msg);
    }


    /**
     * 允许当前玩家发牌时
     */
    currentUser(data: any) {
        const { setpBtn, skipBtn } = this;
        setpBtn.node.active = true;
        setpBtn.interactable = false;
        skipBtn.node.active = true;

        console.log(data);
        // 不可选择的扑克牌屏蔽
        if (data && data.prveCard[0] >= 0) { 
            let prveMaskShow = !1;
            const prveCardLength = data.prveCard.length;
            const prveCardNumber = data.prveCard[0];
            console.log(data.prveCard);

            // 王炸处理[必须为7线及以上]    0为大王（红）   0.1为小王（黑）
            // (4个混王: 7线, 5个混王: 8线, 6个混王: 9线)
            // (4个纯王开始，多一个王加2线)(5个10线, 6个12线, 7个14线, 8个16线)
            if ((prveCardNumber === 0 || prveCardNumber === 0.1) && prveCardLength >= 4) {
                console.log(data.prveCard);
            }

            // 普通扑克牌处理
            this.cardList.forEach((card) => {
                if (card.node.children.length === 2) {
                    const label = card.node.children[1].getComponent(cc.Label);
                    if (label) {
                        const cardNumber = Number(label.string);
                        console.log(card.number, cardNumber);
                        prveMaskShow = !1;
                        if (
                            (prveCardLength >= 4 &&                                                 // 炸弹: 牌数必须大于出牌者的炸弹数量
                                    cardNumber < prveCardLength                                     //       如果牌数量大于等于出牌者 
                                || (cardNumber === prveCardLength && prveCardNumber <= card.number) //       如果牌数量等于出牌者，且牌值小于等于出牌者
                            ) || (
                                   (prveCardLength < 4 && cardNumber < 4)                           // 小于4张非炸弹 且 不能组成炸弹
                                && (cardNumber !== prveCardLength || prveCardNumber <= card.number  // 牌数必须与出牌者相等，并且值大于出牌者
                                )
                            )
                        ) {
                            prveMaskShow = !0;
                        }
                    }
                }

                if (prveMaskShow) {
                    card.node.children[0].active = true;
                    card.node.getComponent(cc.Button).interactable = false;
                }
            });
        }
    }


    /**
     * 允玩家发牌时
     * @param data - IO数据
     */
    userSendCard(data: SendCardData) {
        const { clockBox, clockContent, playersData, FourCardsPlayers } = this;
        // 上次出牌的玩家出牌显示
        if (data.userId !== undefined && data.userId !== this.roomInfoData.playerIndex) {
            this.outCardActuin(data.params, playersData[data.userId]);
        }

        const { index } = data.next;
        if (index !== undefined) {
            let outTime = 60;
            
            // 倒计时时钟位置
            const dataIndex = this.playersData[index].index;
            const { x, y } = dataIndex !== 0
                ? FourCardsPlayers[dataIndex].cardCount.node.parent
                : { x: -85, y: -50 }
            ;
            clockBox.runAction(
                cc.moveTo(.5, x + (clockBox.width * (dataIndex === 1 ? -1 : 1)), y).easing(cc.easeBackOut()),
            );

            // 房主负责与服务器通讯
            countDownClock && clearInterval(countDownClock);
            countDownClock = setInterval(() => {
                clockContent.string = (--outTime < 0 ? 0 : outTime).toString();
                if (outTime <= 0) {
                    // 如果为房主则执行io emit否则清除状态
                    if (playersData[0].id === State.userInfo.id) {
                        this.skip();
                    } else {
                        this.resetCard();
                    }
                }
            }, 1000);
        }
    }


    /**
     * 开始游戏
     * @param cardData - 卡牌数组
     */
    gameStart(cardData: Array<{ [key: number]: number }>) {
        const { Card } = this;
        const CardKey = Object.keys(Card);
        this.wait_player_join.active = !1;
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
        console.log(sortCard, cardData);
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
                mask.active = false;
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
                // console.log(mainColor, mainChildColor, row);
                cardCount++;
            }
        }

        let updatePoint = 0;
        let clock = setInterval(() => {
            const target = cardList[updatePoint];
            if (target && updatePoint < cardList.length) {
                target.node.x = target.x;
                target.node.y = target.y;
                updatePoint++;
            } else {
                clearInterval(clock);
            }
        }, 50);

    }


    /**
     * 扑克牌点击事件
     * @param e         - 事件体
     * @param cardIndex - 扑克牌下标
     */
    onClickCard(e, cardIndex: string | number) {
        // 判断是为当前玩家的回合
        if (!this.setpBtn.node.active && e) return;
        const groupCardList = this.cardList;
        const cardInfo = groupCardList[cardIndex];
        if (!cardInfo) return;

        // 如果之前未点击牌则全选当前种类的牌
        const cardListKeys = Object.keys(cardList);
        if (!cardListKeys.length && e) {
            this.cardList.forEach((card, index) => {
                if (card.number === cardInfo.number) {
                    this.onClickCard(false, index);
                }
            });
            return !0;
        } else {
            // 如果选中的牌不同则重选
            const first = cardList[cardListKeys[0]];
            if (first && first.number && first.number !== cardInfo.number) {
                this.cardList.forEach((card, index) => {
                    if (card.number === first.number && groupCardList[index].isSelect) {
                        this.onClickCard(e, index);
                    }
                });
                this.onClickCard(e, cardIndex);
                return !0;
            }
        }
        const targetNode = cardInfo.node;
        targetNode.runAction(
            cc.moveTo(.2, targetNode.x, targetNode.y + (cardInfo.isSelect ? -20 : 20 )).easing(cc.easeBackOut()),
        );
        (cardInfo.isSelect = !cardInfo.isSelect)
            ? cardList[cardIndex] = cardInfo
            : delete cardList[cardIndex]
        ;
        
        this.setpBtn.interactable = !!Object.keys(cardList).length;
    }


    /**
     * Socket 连接时[通常情况下为重连]
     */
    onSocketConnect() {
        // this.node.removeAllChildren();
        // window.history.go(0);
    }


    /**
     * 游戏场景销毁时
     */
    onDestroy() {
        // 接触IM玩家加入房间事件绑定
        State.io.off('rommjoin', this.fetchRoomInfo.bind(this));
        State.io.off('room/data', this.roomData.bind(this));
        State.io.off('rommleave', this.rommleave.bind(this));
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
        const numberCard = [];
        this.cardList.forEach((item, index) => {
            if (item.isSelect) {
                selectCard.push(index);
                numberCard.push({
                    r: item.row,
                    c: item.col,
                    n: item.number,
                });
            }
            item.node.children[0].active = false;
        });
        this.resetCard();
        cardList = {};
        State.io.emit('fourCards/setp', numberCard);
        this.outCardActuin(selectCard, this.playersData[this.roomInfoData.playerIndex]);
    }


    /**
     * 跳过本轮
     */
    skip() {
        this.resetCard();
        State.io.emit('fourCards/setp', '');
    }


    /**
     * 恢复初始状态
     */
    resetCard() {
        console.log('clear  cards');
        this.setpBtn.node.active = false;
        this.skipBtn.node.active = false;
        
        this.cardList.forEach((item, index) => {
            item.node.children[0].active = false;
            item.node.getComponent(cc.Button).interactable = true;
            if (item.isSelect) {
                this.onClickCard(false, index);
            }
        });
    }


    /**
     * 发牌动作
     */
    outCardActuin(cards, player) {
        const { index } = player;
        const { cardList } = this;
        // console.log(this.FourCardsPlayers[index]);
        const { cardPoint } = this.FourCardsPlayers[index];
        const cardsReverse = [];
        // console.log(index, player);
        if (index === 0) {
            cards.reverse().forEach((card) => {
                cardsReverse.push(cardList.splice(card, 1));
            });
            cardsReverse.reverse().forEach((card, offset) => {
                if (card[0]) {
                    const node = card[0].node;
                    // 出牌后删除纸牌上的数字
                    if (node.children.length === 2) {
                        node.children[1].destroy();
                    }
                    // 扑克牌缓动效果
                    node.runAction(
                        cc.moveTo(.2, cardPoint.x + (15 * offset) - 400, cardPoint.y).easing(cc.easeBackOut()),
                    );
                    this.desktop.card.push(node);
                }
            });
        } else {
            const cardKey = Object.keys(this.Card);
            cardPoint.removeAllChildren();
            (cards || []).forEach((card, offset) => {
                // console.log(cardKey[card.r], cardKey, card.r, this.Card[cardKey[card.r]]);
                const targetFrame = this.Card[cardKey[card.r]][card.c];
                const newNode = new cc.Node();
                newNode.scale = .4;
                newNode.x += 10 * offset;
                newNode.y = cardPoint.y;
                const nodeSprice = newNode.addComponent(cc.Sprite);
                nodeSprice.spriteFrame = targetFrame;
                cardPoint.addChild(newNode);
            });
        }

        if (!cards) {
            const newNode = new cc.Node();
            newNode.addComponent(cc.Sprite).spriteFrame = this.skipSpriteFrame;
            newNode.scale = .6;
            cardPoint.addChild(newNode);
            if (index === 0) {
                newNode.x = 0;
                newNode.y = 0;
            }
            setTimeout(() => {
                newNode.destroy();
            }, 1500);
        }
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
                if (prevNode) {
                    // 如果为全部的最后一张牌
                    if (index == cardList.length - 1 && prevNumber !== card.number) { 
                        if (card.node.children.length !== 2) {
                            console.log(prevNumber, 1);
                            this.addCardNumber('1', card.node, prevNumber);
                        } else {
                            const labelNode = card.node.children[1].getComponent(cc.Label);
                            if (labelNode.string && labelNode.string !== '1') {
                                labelNode.string = '1';
                                console.log(prevNumber, 1);
                            }
                        }
                    }
                    // 如果目标扑克牌存在文本节点则修改内容 否则 创建文本节点
                    let prevCountStr = prevCount.toString();
                    if (prevNode.node.children.length !== 2) {
                        this.addCardNumber(prevCountStr, prevNode.node, prevNumber);
                        console.log(prevNumber, prevCountStr);
                    } else {
                        const labelNode = prevNode.node.children[1].getComponent(cc.Label);
                        if (labelNode.string && labelNode.string !== prevCountStr) {
                            if (index == cardList.length - 1) {
                                prevCountStr = (++prevCount).toString();
                            }
                            labelNode.string = prevCountStr;
                            console.log(prevNumber, prevCountStr);
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
        const avatarBase = 'https://perfergame.oss-cn-beijing.aliyuncs.com/avatar';
        const MyUserData = State.userInfo;
        axios.api('room_info').then(res => {
            console.log(res);
            // 检测是否已经开始游戏
            if (res.isStart && res.players[res.playerIndex]) {
                this.gameStart(res.players[res.playerIndex].card);
                let outherPlayer = 1;

                loadImg(`${avatarBase}/${MyUserData.avatarUrl ? MyUserData.id : 'default'}.png`, (spriteFrame) => {
                    this.FourCardsPlayers[0].avatarUrl.spriteFrame = spriteFrame;
                });
                this.playersData = res.players.map((player, index) => {
                    if (index !== res.playerIndex) {
                        const target = this.FourCardsPlayers[outherPlayer];
                        player.index = outherPlayer;
                        target.nickname.string = player.nickname;
                        loadImg(`${avatarBase}/${player.avatarUrl ? player.id : 'default'}.png`, (spriteFrame) => {
                            target.avatarUrl.spriteFrame = spriteFrame;
                        });
                        outherPlayer++;
                    } else {
                        player.index = 0;
                    }
                    return player;
                });

                // 判断自己是否可以先手出牌
                const sendData: any = {
                    next: {
                        index: res.gameData.target,
                    }
                };
                this.userSendCard(sendData);
                if (res.gameData.target === res.playerIndex) {
                    this.currentUser();
                }
            }
            this.roomInfoData = res;
            this.roomIdLabel.string = `房间号: ${res.roomCode || '错误'}`;
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


    /**
     * 游戏结束
     */
    gameOver(data: any) {
        console.log('gameOver!', data);
        cc.director.loadScene('Home');
    }
    


    /**
     * 返回首页
     */
    backHome() {
        const { playersData, node, popupPrefab } = this;
        console.log(State, playersData);
        if (!playersData.length || playersData.length === 1) {
            return this.gameOver({});
        }
        const popup = cc.instantiate(popupPrefab);
        const scriptPopup = popup.getComponent('popup');
        node.parent.addChild(popup);
        playersData.forEach((item, index: number) => {
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
     * 为扑克牌添加数量
     * @param number     - 扑克牌数量
     * @param newNode    - 扑克牌节点
     * @param cardNumber - 扑克牌点数
     */
    addCardNumber(number: string, newNode: any, cardNumber = number) {
        console.log(cardNumber);
        const labelNode = new cc.Node();
        const label = labelNode.addComponent(cc.Label);
        label.string = number;
        labelNode.x = -50   ;
        labelNode.y += 20;
        labelNode.color = cardNumber ? cc.color(63, 110, 146) : cc.color(222, 222, 222);
        label.fontSize = 30;
        newNode.addChild(labelNode);
    }
}
