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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // 模拟发牌
        const { node } = this;
        const screenWidth = node.width;
        const screenHeight = node.height;
        const colorKey = Object.keys(this.Card);
        const cardList = [];
        // 主颜色
        let mainColor = 0;
        // 子颜色
        let mainChildColor = 0;
        // 断点行
        let startX = 0;
        for (let i = 0; i < 54; i++) {
            const targetFrame = this.Card[colorKey[mainColor]][mainChildColor];
            const newNode = new cc.Node();
            const nodeSprice = newNode.addComponent(cc.Sprite);
            nodeSprice.spriteFrame = targetFrame;
            let x, y = 0;
            // 30: 每张牌可见距离， 0.5: 屏幕左侧开始  100: 安全距离
            x = i * 30 - (screenWidth * .5) + 100;
            y -= (screenHeight * .5 - (newNode.height * .5));

            // 一行占满 换行判断
            if (x >= screenWidth * .5 - 100) {
                // 断点开始换行
                if (!startX) startX = i;
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

            // setTimeout(() => {
            //     newNode.x = x;
            //     newNode.y = y;
            // }, i * 50);
            // let clock = setInterval(() => {
            // }, 100);

            // 全拍展示 【测试案例】
            mainChildColor++;
            if (mainChildColor === this.Card[colorKey[mainColor]].length) {
                mainColor++;
                mainChildColor = 0;
            }
        }

        let updatePoint = 0;
        let clock = setInterval(() => {
            const target = cardList[updatePoint];
            // target.node.x = target.x;
            target.node.x = target.x - 60;
            target.node.y = target.y;
            target.node.runAction(cc.moveTo(.5, target.x, target.y));
            updatePoint++;
            if (updatePoint === 54) clearInterval(clock);
        }, 100);

    }

    // update (dt) {}
}
