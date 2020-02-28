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

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    dice: cc.Sprite[] = [];

    /**
     * 当前骰子下标
     */
    targetIndex: number = 0;

    /**
     * 旋转秒数[ms]
     */
    time: number = 1000;

    start () {

    }

    async onClick() {
        return new Promise((resolve, reject) => {
            let updateCount = 0;
            const clock = setInterval(() => {
                updateCount++;
                this.dice[this.targetIndex].node.opacity = 0;
                const random = Math.random() * 6 | 0;
                this.dice[random].node.opacity = 255;
                this.targetIndex = random;
                if (updateCount === 30) {
                    resolve(random);
                    clearInterval(clock);
                }
            }, this.time / 30);
        });
    }

    // update (dt) {}
}
