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

@ccclass
export default class GobangCreateRoom extends cc.Component {

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
     * 弹窗
     */
    @property(cc.Prefab)
    popupPrefab: cc.Prefab = null;

    /**
     * 价格计算
     */
    @property
    price: number = 0;

    Canvas: cc.Canvas;

    createRoomClick() {
        const peopleNumber = this.peopleNumber.getComponent('Radio');
        const frequencyNumber = this.frequencyNumber.getComponent('Radio');
        const payType = this.payType.getComponent('Radio');
        const pwdType = this.pwdType.getComponent('Radio');

        axios.api('create_room', {
            params: {
                gameName: 'gobang',
            },
            data: {
                people: peopleNumber.value,
                frequency: frequencyNumber.value,
                payType: payType.value,
                pwdType: pwdType.value,
            },
        }).then((res) => {
            const popup = cc.instantiate(this.popupPrefab);
            this.Canvas.node.addChild(popup);
            const scriptPopup = popup.getComponent('popup');
            scriptPopup.init('创建中...');
            if (res.status) {
                cc.director.preloadScene('gamesGoBang');
                axios.api('room_info').then(res => {
                    scriptPopup.message(`创建成功!\n房间号: ${res.roomCode}`);
                    scriptPopup.setEvent('success', () => {
                        cc.director.loadScene('gamesGoBang');
                    });
                });
            }
        });
    }
}
