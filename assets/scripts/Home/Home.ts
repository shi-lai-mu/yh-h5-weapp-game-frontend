// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import socket from '../utils/socketIO';
import State from '../utils/state';
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    ActivityNode: cc.Node = null;

    @property(cc.Prefab)
    EmailPrefab: cc.Prefab = null;

    onLoad () {
        // 登录检测
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            cc.director.loadScene('loginPage');
            return !1;
        } else {
            // 数据失效恢复
            State.io.emit('connect/test');
        }
    }


    /**
     * 打开游戏
     * @param _event   - 事件体
     * @param gameName - 游戏名
     */
    openGame(_event, gameName: string) {
        cc.director.loadScene(gameName);
    }


    /**
     * 打开弹窗
     * @param _event    - 事件体
     * @param popupName - 弹窗名
     */
    openPopup(_event, popupName: string) {
        console.log(popupName);
        this.node.addChild(cc.instantiate(this[popupName]))
    }


    // update (dt) {}
}
