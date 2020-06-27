// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { setAutoRecursively } from '../lib/tool';
const {ccclass, property} = cc._decorator;
import { screenFringe } from '../lib/tool';
import State from '../utils/state';
import axios from '../utils/axiosUtils';
import socket from '../lib/socketIO';

// socket初始化
socket.init();
// 是否为第一次打开
let onlyOpen = false;

@ccclass
export default class Home extends cc.Component {
    // 活动资源
    @property(cc.Prefab) ActivityPrefab: cc.Prefab = null;
    // 邮件资源
    @property(cc.Prefab) EmailPrefab: cc.Prefab = null;
    // 商城资源
    @property(cc.Prefab) ShopPrefab: cc.Prefab = null;
    // 用户中心
    @property(cc.Prefab) UserCenter: cc.Prefab = null;
    // 背景一
    @property(cc.Sprite) bg: cc.Sprite = null;
    // 背景二
    @property(cc.Sprite) bg2: cc.Sprite = null;
    // 背景一 图标
    @property(cc.Node) bgIcon: cc.Node = null;
    // 背景二 图标
    @property(cc.Node) bg2Icon: cc.Node = null;
    // 右上角节点
    @property(cc.Node) rightTopBar: cc.Node = null;
    // 左侧栏目
    @property(cc.Node) leftBox: cc.Node = null;
    // 背景状态
    bgStatus = true;

    onLoad () {
        // 登录检测
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            cc.director.loadScene('loginPage');
            return !1;
        }
        axios.api('room_exit').then(() => {});

        // 如果非微信小游戏则不进行填充
        if (!State.IS_WECHAT) {
            this.rightTopBar.getComponent(cc.Widget).right = 0;
        }
    }


    start() {
        // 默认打开的内容
        if (!onlyOpen) {
            this.openPopup(false, 'ActivityPrefab', () => {
                setTimeout(() => {
                    // 回来提示
                    State.tips(`欢迎回来, ${State.userInfo.nickname}!`, 5, true);
                }, 700);
            });
            onlyOpen = true;
        }
        // 刘海兼容适配
        screenFringe([ this.leftBox ]);

        // BGM音量
        this.node.getComponent(cc.AudioSource).volume = State.system.config.volume.music;
    }


    /**
     * 打开游戏
     * @param _event   - 事件体
     * @param gameName - 游戏名
     */
    openGame(_event, gameName: string) {
        cc.loader.loadRes('prefab/GroupLoading', (_err, prefab) => {
            const instantiate = cc.instantiate(prefab);
            cc.director.getScene().addChild(instantiate);
            cc.director.preloadScene(gameName, (_err) => {
                instantiate.getComponent('GroupLoading').close();
                cc.director.loadScene(gameName);
            });
            // cc.director.loadScene(gameName);
        });
    }


    /**
     * 打开弹窗
     * @param _event    - 事件体
     * @param popupName - 弹窗名
     */
    openPopup(_event, popupName: string, closeCallBack?: any) {
        const instantiate = cc.instantiate(this[popupName]);
        const script = instantiate.getComponent(popupName.replace('Prefab', ''));
        if (closeCallBack && script) script.closeCallBack = closeCallBack;
        cc.director.getScene().addChild(instantiate);
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


    /**
     * 打开商城
     * @param _e        - 事件
     * @param shopIndex - 商城菜单
     */
    openShop(_e, shopIndex: string) {
        const instantiate = cc.instantiate(this.ShopPrefab);
        instantiate.getComponent('Shop').defaultTarget = shopIndex;
        cc.director.getScene().addChild(instantiate);
    }

    
    onDestroy() {
        setAutoRecursively([
            '68b61513-780a-4964-9622-adbea2867cda',
            '0b7da469-5226-4405-aad7-56210d04d191'
        ]);
    }
}
