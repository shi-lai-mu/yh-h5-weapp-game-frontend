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
import State from '../utils/state';
import { loadImg } from '../lib/tool';

@ccclass
export default class Portrait extends cc.Component {

    /**
     * 账号id
     */
    @property(cc.Label)
    id: cc.Label = null;

    /**
     * 昵称
     */
    @property(cc.Label)
    nickName: cc.Label = null;

    /**
     * 头像
     */
    @property(cc.Sprite)
    avatar: cc.Sprite = null;

    /**
     * 钻石
     */
    @property(cc.Label)
    diamond: cc.Label = null;

    /**
     * 金币
     */
    @property(cc.Label)
    gold: cc.Label = null;


    start () {
        const { nickname, id, diamond, gold, avatarUrl } = State.userInfo;
        this.nickName.string = nickname;
        this.id.string = 'ID: ' + (id || '000000').toString();
        this.diamond.string = diamond.toString();
        this.gold.string = gold.toString();
        // 头像在线加载
        // avatarUrl === 1 时加载ID的头像否则加载Default头像
        loadImg(avatarUrl, spriteFrame => {
            this.avatar.spriteFrame = spriteFrame;
        }, 'avatar', id);
        State.observer.on('updateUserData', this.updateUserData.bind(this));
    }


    onDestroy() {
        State.observer.off('updateUserData', this.updateUserData.bind(this));
    }


    /**
     * 用户数据更新时
     */
    updateUserData(newUserData) {
        console.log(newUserData);
    }
}
