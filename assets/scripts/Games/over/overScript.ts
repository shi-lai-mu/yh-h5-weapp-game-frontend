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
import { dateFrom } from '../../lib/tool';
import axios from '../../utils/axiosUtils';

const ItemData = cc.Class({
    name: 'itemData',
    properties: {
        key: cc.Label,
        value: cc.Label,
    },
})

const UserItem = cc.Class({
    name: 'userItem',
    properties: {
        nickname: cc.Label,
        avatarUrl: cc.Sprite,
        score: cc.Label,
        item: {
            default: [],
            type: ItemData,
        },
        winner: cc.Node,
        Node: cc.Node,
    },
})

@ccclass
export default class GameOver extends cc.Component {

    @property(UserItem) UserItem: {
        nickname: cc.Label;
        avatarUrl: cc.Sprite;
        score: cc.Label;
        item: { key: cc.Label; value: cc.Label }[],
        winner: cc.Node;
        Node: cc.Node;
    }[] = [];
    // 房间ID
    @property(cc.Label) roomId: cc.Label = null;
    // 时间
    @property(cc.Label) Time: cc.Label = null;
    // 预览节点
    @property(cc.Sprite) preview: cc.Sprite = null;
    // 预览容器
    @property(cc.Node) previewBox: cc.Node = null;
    // 预览状态
    privateState: boolean = false;
    // 预览节点 图像
    @property(cc.SpriteFrame) previewSprite: cc.SpriteFrame[] = [];

    onLoad () {
        this.UserItem.forEach(item => (item.Node.scale = 0));
    }

    /**
     * 初始化
     * @param players - 玩家
     * @param time    - 结束时间
     * @param roomId  - 房间号
     */
    init(initData: {
        players: { 
            nickname: string;
            avatarUrl: cc.SpriteFrame;
            score: number;
            item: { [key: string]: string },
            winner: Boolean;
        }[],
        itemKey: string[],
        time: number,
        roomId: number,
    }) {
        const { UserItem } = this;
        const { players } = initData;
        players.forEach((item, index) => {
            const userItem = UserItem[index];
            setTimeout(() => {
                userItem.Node.runAction(
                    cc.scaleTo(1, 0.314, 0.456).easing(cc.easeBackOut()),
                );
            }, index * 100);
            userItem.nickname.string = item.nickname;
            console.log(item.score);
            userItem.score.string = String(item.score);
            userItem.avatarUrl.spriteFrame = item.avatarUrl;

            // 得分项目
            const params = item.item;
            let i = 0;
            for (const key in params) {
                const keyName = initData.itemKey[key] || key;
                const keyValue = params[key];
                userItem.item[i].key.string = keyName;
                userItem.item[i].value.string = keyValue;
                i++;
            }

            // 赢家
            if (item.winner) {
                userItem.winner.opacity = 255;
            }
        });
        this.roomId.string = '房间号：' + ( '000000' + initData.roomId).substr(-6);
        this.Time.string = dateFrom('yyyy/MM/dd HH:mm:ss', initData.time);
    }


    /**
     * 预览切换
     */
    previewToggle() {
        const { privateState } = this;
        this.previewBox.active = privateState;
        this.preview.spriteFrame = this.previewSprite[privateState ? 0 : 1];
        this.privateState = !privateState;
    }


    /**
     * 返回大厅
     */
    backHome() {
        cc.director.loadScene('Home');
        axios.api('room_exit', {
            data: {
                roomCode: this.roomId.string,
            },
        }).then(() => {});
    }

    // update (dt) {}
}
