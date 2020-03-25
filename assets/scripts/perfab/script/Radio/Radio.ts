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

    @property(cc.Label)
    title: cc.Label = null;

    @property({ visible: !1 })
    string: string = null;

    @property(cc.Toggle)
    radio1: cc.Toggle = null;

    @property(cc.Toggle)
    radio2: cc.Toggle = null;

    @property(cc.Toggle)
    radio3: cc.Toggle = null;

    @property(cc.Toggle)
    radio4: cc.Toggle = null;

    start() {
        const { radio1, radio2, radio3, radio4 } = this;
        const target = radio1.isChecked
            ? radio1 : radio2.isChecked
            ? radio2 : radio3.isChecked
            ? radio3 : radio4.isChecked
            ? radio4 : false
        ;

        radio1.getComponent('toggle').parent = this
        radio2.getComponent('toggle').parent = this
        radio3.getComponent('toggle').parent = this
        radio4.getComponent('toggle').parent = this

        if (target) {
            const script = target.getComponent('toggle');
            script.onClick();
        }
    }


    /**
     * 初始化组合选项
     * @param title  - 标签
     * @param option - 参数
     */
    init(title:string, option: string[]) {
        [1, 2, 3, 4].forEach((index: number) => {
            const targetRadio: cc.Toggle = this[`radio${index}`];
            if (option[index - 1]) {
                const toggleScript = targetRadio.getComponent('toggle');
                toggleScript.text.string = option[index - 1];
            } else {
                targetRadio.node.scale = 0;
            }
        });
        this.title.string = title + ':';
    }


    /**
     * 切换选值事件
     * @param value  - 值
     * @param string - 字符串
     */
    toggleEvent(value: string, string: string) {
        this.value = value;
        this.string = string;
    }

    // update (dt) {}
}
