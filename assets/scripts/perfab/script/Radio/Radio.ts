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
    @property({ visible: !1 })
    value: string = null;

    @property(cc.Toggle)
    radio1: cc.Toggle = null;

    @property(cc.Toggle)
    radio2: cc.Toggle = null;

    @property(cc.Toggle)
    radio3: cc.Toggle = null;

    @property(cc.Toggle)
    radio4: cc.Toggle = null;

    onLoad () {
        const { radio1, radio2, radio3, radio4 } = this;
        const target = radio1.isChecked
            ? radio1 : radio2.isChecked
            ? radio2 : radio3.isChecked
            ? radio3 : radio4.isChecked
            ? radio4 : false
        ;
        if (target) {
            target.getComponent('toggle').onClick();
        }
    }

    toggleEvent(value: string) {
        this.value = value;
    }

    // update (dt) {}
}
