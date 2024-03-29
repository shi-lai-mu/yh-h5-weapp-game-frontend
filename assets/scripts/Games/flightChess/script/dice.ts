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
let clock = null;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    dice: cc.Sprite[] = [];

    /**
     * 当前骰子下标
     */
    targetIndex: number = 0;

    /**
     * 点击时触发的事件
     */
    onClickEvent: any;

    /**
     * 旋转秒数[ms]
     */
    time: number = 50;

    /**
     * 事件
     */
    event;


    onLoad() {
        this.dice.forEach(dice => dice.node.active = false);
        this.dice[0].node.active = true;
    }


    async onClick(num: number) {
        if (this.event && !this.event()) return;
        return new Promise((resolve, reject) => {
            let updateCount = 0;
            clearInterval(clock);
            clock = setInterval(() => {
                updateCount++;
                this.dice[this.targetIndex].node.active = false;
                const random = typeof num === 'number' ? num : (Math.random() * 6 | 0);
                const target = this.dice[random];
                if (target) {
                    target.node.active = true;
                }
                this.targetIndex = random;
                if (updateCount === 30) {
                    resolve(random);
                    this.onClickEvent && this.onClickEvent(random, num);
                    clearInterval(clock);
                }
            }, this.time / 30);
        });
    }


    onDestroy() {
        clearInterval(clock);
    }

    // update (dt) {}
}
