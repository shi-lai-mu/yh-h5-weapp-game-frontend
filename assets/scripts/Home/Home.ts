// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import State from '../utils/state';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Home extends cc.Component {

    @property(cc.Prefab)
    ActivityPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    EmailPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    ShopPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    UserCenter: cc.Prefab = null;

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.Sprite)
    bg2: cc.Sprite = null;

    @property(cc.Node)
    bgIcon: cc.Node = null;

    @property(cc.Node)
    bg2Icon: cc.Node = null;

    bgStatus = true;

    onLoad () {
        // 登录检测
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            cc.director.loadScene('loginPage');
            return !1;
        }
    }


    /**
     * 打开游戏
     * @param _event   - 事件体
     * @param gameName - 游戏名
     */
    openGame(_event, gameName: string) {
        console.log(gameName);
        cc.director.loadScene(gameName);
    }


    /**
     * 打开弹窗
     * @param _event    - 事件体
     * @param popupName - 弹窗名
     */
    openPopup(_event, popupName: string) {
        console.log(popupName);
        this.node.addChild(cc.instantiate(this[popupName]));
    }


    /**
     * 背景切换
     */
    backageSwitch() {
        this.bgStatus = !this.bgStatus;
        const bgStatus = this.bgStatus;
        this.bg.node.runAction(
            !bgStatus ? cc.fadeOut(1) : cc.fadeIn(1),
        );
        this.bg2.node.runAction(
            bgStatus ? cc.fadeOut(1) : cc.fadeIn(1),
        );
        this.bgIcon.scale = bgStatus ? 1 : 0;
        this.bg2Icon.scale = bgStatus ? 0 : 1;
    }


    // update (dt) {}
}
