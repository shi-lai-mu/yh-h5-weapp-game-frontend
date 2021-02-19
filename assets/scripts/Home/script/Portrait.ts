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
import axios from '../../utils/axiosUtils';
import { loadImg } from '../../lib/tool';
import { Utils } from '../../interface/index';

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
        this.updateUserData(State.userInfo);
        cc.game.on('updateUserData', this.updateUserData.bind(this));
    }


    onDestroy() {
       cc.game.off('updateUserData', this.updateUserData.bind(this));
    }


    /**
     * 用户数据更新时
     * @param userData 用户信息, 如果不传入则会自动去服务器更新
     */
    async updateUserData(userData?: Utils.State['userInfo']) {
        if (!userData) {
            const res: any = await axios.api('get_assets').then();
            userData = { ...State.userInfo, ...res };
        }

        const { nickname, id, diamond, gold, avatarUrl } = userData;
        this.nickName.string = nickname;
        this.id.string = 'ID: ' + (id || '000000').toString();
        this.diamond.string = diamond.toString();
        this.gold.string = gold.toString();
        // 头像在线加载
        // avatarUrl === 1 时加载ID的头像否则加载Default头像
        loadImg(avatarUrl, spriteFrame => {
            if (spriteFrame && this.avatar) {
                this.avatar.spriteFrame = spriteFrame;
            }
        }, 'avatar', id);
    }
}
