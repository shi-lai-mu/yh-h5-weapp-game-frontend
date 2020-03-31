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
import State from '../../utils/state';

@ccclass
export default class NewClass extends cc.Component {
    // 账号id
    @property(cc.Label) id: cc.Label = null;
    // 昵称
    @property(cc.Label) nickName: cc.Label = null;
    // 头像
    @property(cc.Sprite) avatar: cc.Sprite = null;
    // gender man
    @property(cc.Sprite) man: cc.Sprite = null;
    // gender woman
    @property(cc.Sprite) woman: cc.Sprite = null;
    // 账号
    @property(cc.Label) account: cc.Label = null;
    // 手机号
    @property(cc.Label) mobile: cc.Label = null;


    start () {
        const { nickname, id, avatarUrl, account, gender, mobile } = State.userInfo;
        this.nickName.string = nickname;
        this.id.string = 'ID: ' + (id || '000000').toString();
        this.account.string = account.toString();
        this.loadAvatarUrl(id, avatarUrl);
        const emptyRadio = this.woman.spriteFrame;
        gender === 1
            ? (this.woman.spriteFrame = this.man.spriteFrame) && (this.man.spriteFrame = emptyRadio)
            : null;

        this.mobile.string = mobile;
    }


    /**
     * 加载头像
     */
    loadAvatarUrl(id, avatarUrl) {
        // avatarUrl === 1 时加载ID的头像否则加载Default头像
        cc.loader.load(`https://perfergame.oss-cn-beijing.aliyuncs.com/avatar/${avatarUrl ? id : 'default'}.png`, (error, texture) => {
            if (error) return;
            var spriteFrame = new cc.SpriteFrame(texture);
            this.avatar.spriteFrame = spriteFrame;
        });
    }


    /**
     * 退出登录
     */
    outLogin() {
        State.userInfo = {
            id: '0000',
            nickname: '* * * * * *',
            diamond: 0,
            gold: 0,
            token: false,
            avatarUrl: false,
            signal: 0,
        };
        localStorage.clear();
        cc.director.loadScene('loginPage');
    }

    
    close() {
        this.node.destroy();
    }

    // update (dt) {}
}
