// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite) kitty: cc.Sprite = null;

    material;
    time: number = 0;

    start () {
        this.material = this.kitty.getMaterial(0);
        this.schedule(this.upd, 0, cc.macro.REPEAT_FOREVER, 1);
    }

    upd() {
        this.time += 0.01;
        this.material.effect.setProperty('time', this.time);
        if (this.time > 1.2) {
            this.unschedule(this.upd);
        }
        console.log(1);
    }

    // update (dt) {}
}
