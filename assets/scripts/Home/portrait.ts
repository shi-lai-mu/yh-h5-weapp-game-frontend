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
export default class NewClass extends cc.Component {

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
        this.id.string = 'ID: ' + id.toString();
        this.diamond.string = diamond.toString();
        this.gold.string = gold.toString();

        // 头像在线加载
        // avatarUrl === 1 时加载ID的头像否则加载Default头像
        cc.loader.load(`https://perfergame.oss-cn-beijing.aliyuncs.com/avatar/${avatarUrl ? id : 'default'}.png`, (error, texture) => {
            if (error) return;
            var spriteFrame = new cc.SpriteFrame(texture);
            this.avatar.spriteFrame = spriteFrame;
        });
    }

    // update (dt) {}
}
