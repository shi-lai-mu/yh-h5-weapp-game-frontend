// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import socket from './utils/socketIO';
import State from './utils/state';
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    ActivityNode: cc.Node = null;

    onLoad () {
        // 登录检测
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            cc.director.loadScene('loginPage');
        }

        // 数据失效恢复
        if (!State.userInfo.token) {
            State.userInfo = JSON.parse(userInfo);
        }

        // io连接
        // console.log(io);
        // console.log(socekt.use(socketClient));
        State.io = socket.use;
    }


    /**
     * 打开游戏
     * @param _event   - 事件体
     * @param gameName - 游戏名
     */
    openGame(_event, gameName: string) {
        cc.director.loadScene(gameName);
    }


    start () {
        // console.log(this.ActivityNode.getComponent('Activity'));
        // this.ActivityNode.getComponent('Activity').activityPopupShow();
    }

    // update (dt) {}
}
