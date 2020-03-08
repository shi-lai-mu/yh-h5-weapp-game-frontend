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
import axios from '../../utils/axiosUtils';

/**
 * 游戏房间配置
 */
const gameOption = {
    gobang: {
        name: '五子棋',
        room: [
            ['人数', '1人', '5人', '10人'],
            ['支付方式', 'aa', 'bb', 'cc'],
        ],

    },
    fourCards: {
        name: '四副牌',
        room: [
            []
        ],
    },
}
/**
 * 选项实例
 */
const radioOption = [];

@ccclass
export default class CreateRoom extends cc.Component {

    /**
     * 主盒子
     */
    @property(cc.Node)
    mainBox: cc.Node = null;

    /**
     * 左侧盒子
     */
    @property(cc.Node)
    leftTopBox: cc.Node = null;

    /**
     * 大内容盒子
     */
    @property(cc.Node)
    ContentBox: cc.Node = null;

    /**
     * 大内容内容区域
     */
    @property(cc.Node)
    ContentBoxView: cc.Node = null;

    /**
     * 选项组资源
     */
    @property(cc.Prefab)
    radioGroup: cc.Prefab = null;

    /**
     * 列表资源
     */
    @property(cc.Prefab)
    listItem: cc.Prefab = null;

    /**
     * 项目资源
     */
    @property(cc.SpriteFrame)
    itemSpriteFrame: cc.SpriteFrame[] = [];

    prevPrefab: cc.Prefab = null;

    Canvas: cc.Canvas;

    start() {
        this.popupShow();
        let prveClick = null;
        // 创建按钮实例化
        Object.keys(gameOption).forEach((key, index) => {
            const item = gameOption[key];
            const itemInstantiate = cc.instantiate(this.listItem);
            const ListItem = itemInstantiate.getComponent('ListItem');
            ListItem.init({
                id: index,
                scale: .5,
                title: item.name,
                sprite: this.itemSpriteFrame[index],
            });
            itemInstantiate.x -= itemInstantiate.x;
            itemInstantiate.y -= index * 40;
            this.leftTopBox.addChild(itemInstantiate);

            ListItem.clickEvent = () => {
                prveClick && prveClick.blur();
                this.loadPrefab(key);
                prveClick = ListItem;
            }

            if (index === 0) {
                ListItem.onClick();
            }
        });
        // 默认载入五子棋
        // this.loadPrefab('gobang');
    }


    /**
     * 加载创建房间的设置资源
     * @param prefabName - 游戏名
     */
    loadPrefab(prefabName: string) {
        this.ContentBoxView.destroyAllChildren();
        const gameOpt = gameOption[prefabName];
        if (gameOpt) {
            gameOpt.room.forEach((opt: string[], index) => {
                opt = Object.assign([], opt);
                const optGroup = cc.instantiate(this.radioGroup);
                const radioScript = optGroup.getComponent('Radio');
                radioScript.init(opt.shift(), opt);
                this.ContentBoxView.addChild(optGroup);
                optGroup.y -= index * 60 - 210;
                radioOption.push({
                    instantiate: optGroup,
                    script: radioScript,
                    config: opt,
                });
            });
        }
    }


    /**
     * 界面显示
     * @param Action - 是否显示动画
     */
    popupShow() {
        const { leftTopBox } = this;
        this.ContentBox.scale = 0;
        leftTopBox.x = leftTopBox.x + leftTopBox.width;
        this.ContentBox.runAction(
            cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut()),
        );
    }

    
    /**
     * 界面隐藏
     * @param Action - 是否显示动画
     */
    popupHide() {
        this.ContentBox.runAction(
            cc.sequence(
                cc.scaleTo(0.5, .5, .5).easing(cc.easeBackIn()),
                cc.callFunc(() => this.node.destroy(), this),
            ),
        );
    }


    /**
     * 创建房间按钮 按下事件
     */
    onCreateRoom() {
        radioOption.forEach((item) => {
            console.log(item.script.value);
        });
        // axios.api('create_room', {
        //     params: {
        //         gameName: 'gobang',
        //     },
        //     data: {
        //         people: peopleNumber.value,
        //         frequency: frequencyNumber.value,
        //         payType: payType.value,
        //         pwdType: pwdType.value,
        //     },
        // }).then((res) => {
        //     const popup = cc.instantiate(this.popupPrefab);
        //     this.Canvas.node.addChild(popup);
        //     const scriptPopup = popup.getComponent('popup');
        //     scriptPopup.init('创建中...');
        //     if (res.status) {
        //         cc.director.preloadScene('gamesGoBang');
        //         axios.api('room_info').then(res => {
        //             scriptPopup.message(`创建成功!\n房间号: ${res.roomCode}`);
        //             scriptPopup.setEvent('success', () => {
        //                 cc.director.loadScene('gamesGoBang');
        //             });
        //         });
        //     } else {
        //         scriptPopup.message(`创建失败!\n${res.msg}`);
        //         scriptPopup.setEvent('reset', () => {
        //             this.createRoomClick();
        //         });
        //         scriptPopup.setEvent('close', () => {});
        //     }
        // });
    }

    // update (dt) {}
}
