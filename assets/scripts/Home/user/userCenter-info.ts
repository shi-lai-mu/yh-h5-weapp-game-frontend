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
import { loadImg, uploadFile } from '../../lib/tool';
import axios from '../../utils/axiosUtils';

@ccclass
export default class NewClass extends cc.Component {
    // 账号id
    @property(cc.Label) id: cc.Label = null;
    // 昵称
    @property(cc.EditBox) nickName: cc.EditBox = null;
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
        loadImg(avatarUrl, spriteFrame => {
            this.avatar.spriteFrame = spriteFrame;
        }, 'avatar', id);
        const emptyRadio = this.woman.spriteFrame;
        gender === 1
            ? (this.woman.spriteFrame = this.man.spriteFrame) && (this.man.spriteFrame = emptyRadio)
            : null
        ;

        this.mobile.string = mobile;
    }


    /**
     * 退出登录
     */
    outLogin() {
        localStorage.clear();
        State.io.disconnect();
        cc.director.loadScene('loginPage');
    }


    /**
     * 更换头像
     */
    resetAvatar() {
        axios.api('get_reset_avatar').then(res => {
            uploadFile(res, State.userInfo.id)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                })
            ;
        });
    }

    
    close() {
        this.node.destroy();
    }

    // update (dt) {}
}
