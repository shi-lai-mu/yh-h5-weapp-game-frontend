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
import { CardList, FourCardsPlayers, SendCardData, UserData } from '../../interface/game/fourCard';
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
     * 桌面分数
     */
    @property(cc.Label) desktopScore: cc.Label = null;

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
    bindonGameData = (data) => this.onGameData(data);
    bindfetchRoomInfo = (data) => this.fetchRoomInfo(data);
    bindrommleave = (data) => this.rommleave(data);
    history = [];

    onLoad() {
        const that = this;
        const { setpBtn, skipBtn } = that;

        setpBtn.node.active = false;
        skipBtn.node.active = false;

        that.fetchRoomInfo(false);
        State.io.on('fourcard/gameData', that.bindonGameData);
        State.io.on('rommjoin', that.bindfetchRoomInfo);
        State.io.on('rommleave', that.bindrommleave);
        cc.loader.setAutoReleaseRecursively('fc30fbe0-1668-4af2-8dcb-a798b469719b', true);
    }


    /**
     * 游戏场景销毁时
     */
    onDestroy() {
        // 接触IM玩家加入房间事件绑定
        State.io.off('fourcard/gameData', this.bindonGameData);
        State.io.off('rommjoin', this.bindfetchRoomInfo);
        State.io.off('rommleave', this.bindrommleave);
        clock && clearInterval(clock);
        countDownClock && clearInterval(countDownClock);
    }


    /**
     * 接收到游戏数据时
     * @param data - IO数据
     */
    onGameData(data: any) {
        data = typeof data === 'string' ? JSON.parse(data) : data;
        console.log(data.msg);
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

        // 玩家不出牌时
        if (data && data.prveCard && !data.prveCard.length) {
            const { history } = this;
            data.prveCard = history[2] || history[1] || history[0] || [];
            console.log(data.prveCard, history);
        }

        // console.log(data);
        // 不可选择的扑克牌屏蔽
        if (data && data.prveCard && data.prveCard.length) { 
            let prveMaskShow = !1;
            const prveCardLength = data.prveCard.length;
            const prveCardNumber = data.prveCard[0];
            // console.log(data.prveCard);

            // 王炸处理[必须为7线及以上]    0为大王（红）   0.1为小王（黑）
            // (4个混王: 7线30分, 5个混王: 8线60分, 6个混王: 9线90分)
            // (4个纯王开始，多一个王加2线)(5个10线120分, 6个12线180分, 7个14线240分, 8个16线300分)
            if ((prveCardNumber === 0 || prveCardNumber === 0.1) && prveCardLength >= 4) {
                let redJoker = 0;
                let blackJoker = 0;
                let lintScore = 0;
                data.prveCard.forEach((num: number) => num === 0 ? redJoker++ : blackJoker++);

                // 4纯王 + 其他王
                if ((redJoker === 4 || blackJoker === 4) && prveCardLength >= 5) {
                    lintScore = 10 + ((prveCardLength - 5) * 2);
                } else { // 混王
                    lintScore = 7 + (prveCardLength - 4);
                }

                // 王炸模拟牌数 并调至最大牌
                data.prveCard = new Array(lintScore).fill(0);
                console.log(lintScore + '线');
            }

            // 普通扑克牌处理
            this.cardList.forEach((card) => {
                if (card.node.children.length === 2) {
                    const label = card.node.children[1].getComponent(cc.Label);
                    if (label) {
                        const cardNumber = Number(label.string);
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
     * 玩家发牌时
     * @param data - IO数据
     */
    userSendCard(data: SendCardData) {
        const { clockBox, clockContent, playersData, FourCardsPlayers } = this;
        const targetUserId = data.userId || 0;
        // const userPointId = this.playersData[targetUserId].index;
        // const targetUser = FourCardsPlayers[userPointId];
        // 上次出牌的玩家出牌显示
        if (targetUserId !== undefined && targetUserId !== this.roomInfoData.playerIndex) {
            this.outCardActuin(data.params, playersData[targetUserId]);
        }
        if (data.next.prveCard) {
            const { history } = this;
            const prevCard = data.next.prveCard;
            history.push(prevCard.length ? prevCard : '');
            if (history.length === playersData.length) history.shift();
            if (history.join('') === '') this.history = [];
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

        // 桌面分数显示
        if (data.desktopScore !== undefined) {
            this.desktopScore.string = data.desktopScore.toString();
        }

        // 判断是否为当前玩家发牌阶段
        if (data.next.index === this.roomInfoData.playerIndex) {
            this.currentUser(data.next);
        }

        // 分数修改
        if (data.score) {
            this.playersData.forEach((player, i) => {
                const target = FourCardsPlayers[player.index];
                target.score.string = data.score[i].toString();
                target.noteScore.string = data.noteScore[i].toString();
                if (target.cardCount) {
                    target.cardCount.string = data.cardCount[i].toString();
                }
            });
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
            cardData.push({});
        }
        console.log(cardData.length);
        for (let num = 0; num < 13; num++) {
            sortCard[num] = [];
            for (let row = 0; row < cardData.length - 1; row++) {
                const targetCard = cardData[row][num];
                targetCard && sortCard[num].push(...Array(targetCard).fill(row));
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
                newNode.y = newNode.height + (screenHeight * 2);

                newNode.x =x;
                newNode.y =y;
                // 显示数字
                if (col === 0 && row !== 0) {
                    this.addCardNumber(rowItem.length, newNode, row);
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

        // let updatePoint = 0;
        // let clock = setInterval(() => {
        //     const target = cardList[updatePoint];
        //     if (target && updatePoint < cardList.length && target.node) {
        //         target.node.x = target.x;
        //         target.node.y = target.y;
        //         console.log(target.x);
        //         updatePoint++;
        //     } else {
        //         clearInterval(clock);
        //     }
        // }, 50);
        this.updateCardPoint();
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
     * 发牌
     *  - 选中的牌进行发牌操作
     */
    dealCards() {
        // 销毁桌前的扑克牌
        if (this.desktop.card.length) {
            this.desktop.card.forEach((card) => card.destroy());
            this.desktop.card = [];
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
        if (!player) return;
        const { index } = player;
        const { cardList } = this;
        const { cardPoint } = this.FourCardsPlayers[index];
        const cardsReverse = [];

        if (index === 0) {
            console.log(cards);
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
                            this.addCardNumber('1', card.node, prevNumber);
                        } else {
                            const labelNode = card.node.children[1].getComponent(cc.Label);
                            if (labelNode.string && labelNode.string !== '1') {
                                labelNode.string = '1';
                            }
                        }
                    }
                    // 如果目标扑克牌存在文本节点则修改内容 否则 创建文本节点
                    let prevCountStr = prevCount.toString();
                    if (prevNode.node.children.length !== 2) {
                        this.addCardNumber(prevCountStr, prevNode.node, prevNumber);
                    } else {
                        const labelNode = prevNode.node.children[1].getComponent(cc.Label);
                        if (labelNode.string && labelNode.string !== prevCountStr) {
                            if (index == cardList.length - 1) {
                                prevCountStr = (++prevCount).toString();
                            }
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
    fetchRoomInfo(data) {
        const avatarBase = 'https://perfergame.oss-cn-beijing.aliyuncs.com/avatar';
        const MyUserData = State.userInfo;
        axios.api('room_info').then(res => {
            this.playersData = [];
            const myPlayer = this.FourCardsPlayers[0];
            let outherPlayer = 1;
            loadImg(`${avatarBase}/${MyUserData.avatarUrl ? MyUserData.id : 'default'}.png`, (spriteFrame) => {
                myPlayer.avatarUrl.spriteFrame = spriteFrame;
                myPlayer.noteScore.string = '0';
                myPlayer.cardCount && (myPlayer.cardCount.string = '54');
                myPlayer.score.string = '0';
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

            // 检测是否已经开始游戏
            if (res.isStart && res.players[res.playerIndex]) {
                this.gameStart(res.players[res.playerIndex].card);

                // 判断自己是否可以先手出牌
                const sendData: any = {
                    next: {
                        index: res.gameData.target,
                    }
                };
                this.userSendCard(sendData);
                if (res.gameData.target === res.playerIndex) {
                    this.currentUser(false);
                }
            }
            this.roomInfoData = res;
            this.roomIdLabel.string = `房间号: ${res.roomCode || '错误'}`;
        });
    }


    /**
     * 玩家离开游戏时
     * @param data - 数据
     */
    rommleave(ioData) {
        ioData = JSON.parse(ioData);
        if (ioData && ioData.data && ioData.data.id === this.playersData[0].id) {
            this.gameOver({ type: 0 });
        }
    }


    /**
     * 游戏结束
     * @param data
     *  - false: 房主离开游戏触发
     * 
     */
    gameOver(data: any | false) {
        console.log(data);
        const { playersData, node, popupPrefab, FourCardsPlayers } = this;
        if (data && data.type !== 0) {
            this.gameOver = () => {};
            const chessPrefab = cc.instantiate(this.chessPrefab);
            const chessScript = chessPrefab.getComponent('overScript');
            const chessData: any = [];
            console.log(data.gameData, data.gameData.score);
            playersData.forEach((player, index) => {
                const gamedata = data.gameData;
                console.log(index);
                chessData.push({
                    nickname: player.nickname,
                    avatarUrl: FourCardsPlayers[index].avatarUrl.spriteFrame,
                    score: gamedata.score[index],
                    item: {
                        noteScore: gamedata.noteScore[index],
                    },
                });
            });
            chessScript.init({
                players: chessData,
                itemKey: {
                    noteScore: '抓分',
                },
                time: data.gameData.createTime,
                roomId: data.roomCode,
            });
            this.node.addChild(chessPrefab);
        } else if (this.roomInfoData.playerIndex !== 0) {
            const popup = cc.instantiate(popupPrefab);
            const scriptPopup = popup.getComponent('popup');
            node.parent.addChild(popup);
            scriptPopup.init('房主已将房间解散!');
            scriptPopup.setEvent('success', () => {
                popup.destroy();
                this.roomExit();
                cc.director.loadScene('Home');
            });
        } else if (this.playersData.length === 1) {
            this.roomExit();
            cc.director.loadScene('Home');
        }

        console.log(this.playersData.length);
    }

    
    /**
     * 退出房间
     */
    roomExit() {
        axios.api('room_exit', {
            data: {
                roomCode: this.roomInfoData.id,
            },
        }).then(() => {});
    }


    /**
     * 返回首页
     */
    backHome() {
        const { playersData, node, popupPrefab } = this;
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
                    this.roomExit();
                    cc.director.loadScene('Home');
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
    addCardNumber(number: string, newNode: any, cardNumber: number) {
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
