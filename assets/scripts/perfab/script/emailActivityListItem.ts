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

    @property()
    id: number = 0;

    @property(cc.Label)
    itemPrice: cc.Label = null;

    @property
    ParentClass: any = null;

    @property
    data: any = {};


    /**
     * 点击事件
     */
    onClick() {
        const { html, content } = this.data;
        console.log(this.ParentClass.mainContent, html);
        this.ParentClass.mainContent.string = html || content;
    }


    /**
     * 初始化数据
     * @param data  - 初始出具
     * @param index - 下标
     */
    init(data: any, index: number) {
        const { id, title } = data;
        console.log(data);
        this.id = id;
        this.itemPrice.string = title.length > 5 ? title.substr(0, 5) + '...' : title;
        data.index = index;
        this.data = data;
    }


    // update (dt) {}
}
