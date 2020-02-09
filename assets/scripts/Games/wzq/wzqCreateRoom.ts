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

    /**
     * 人数Radio
     */
    @property(cc.Node)
    peopleNumber: cc.Node = null;

    /**
     * 局数Radio
     */
    @property(cc.Node)
    frequencyNumber: cc.Node = null;


    /**
     * 支付方式Radio
     */
    @property(cc.Node)
    payType: cc.Node = null;


    /**
     * 密码生成Radio
     */
    @property(cc.Node)
    pwdType: cc.Node = null;


    /**
     * 价格节点
     */
    @property(cc.Node)
    priceNode: cc.Node = null;

    /**
     * 价格计算
     */
    @property
    price: number = 0;

    start () {
        // this.peopleNumber.node.on('callback', (data) => console.log(data))
        // this.frequencyNumber.node.on('callback', (data) => console.log(data))
        // this.payType.node.on('callback', (data) => console.log(data))
        // this.pwdType.node.on('callback', (data) => console.log(data))
    }

    test(param) {
        console.log(param.target.getComponent('toggle').label);
    }
    // update (dt) {}
}
