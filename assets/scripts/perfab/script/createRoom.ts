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
            [ '人数', '2人' ],
            [ '局数', '1局' ],
            [ '支付', '房主支付' ],
            [ '密码', '公开' ],
        ],
        keyword: [ 'people' ,'frequency' ,'payType' ,'pwdType' ],
        scene: 'gamesGoBang',
    },
    fourCards: {
        name: '四副牌',
        room: [
            [ '人数', '4人', '2人(测试用)' ],
            [ '局数', '1局' ],
            [ '支付', '房主支付' ],
            [ '密码', '公开' ],
        ],
        keyword: [ 'people' ,'frequency' ,'payType' ,'pwdType' ],
        scene: 'gameFourCards',
    },
    flightChess: {
        name: '飞行棋',
        room: [
            [ '人数', '2人', '3人', '4人' ],
            [ '局数', '1局' ],
            [ '起飞', '6点', '3点', '3、6点' ],
            [ '密码', '公开' ],
        ],
        keyword: [ 'people' ,'frequency' ,'takeOff' ,'pwdType' ],
        scene: 'gameFlightChess',
    },
}
/**
 * 选项实例
 */
let radioOption: any = [];

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

    /**
     * 弹窗
     */
    @property(cc.Prefab)
    popupPrefab: cc.Prefab = null;

    /**
     * 当前选中的游戏名
     */
    _ROOM_NAME_: string = '';

    /**
     * 当前选中的GAME
     */
    _GANE_: any = {};

    /**
     * 项目节点列表
     */
    listItems = {};

    start() {
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
            itemInstantiate.y -= (index * 50) + itemInstantiate.height;
            this.leftTopBox.addChild(itemInstantiate);

            ListItem.clickEvent = () => {
                prveClick && prveClick.blur();
                this.loadPrefab(key);
                prveClick = ListItem;
                this._ROOM_NAME_ = key;
            }

            if (index === 0) {
                ListItem.onClick();
            }

            this.listItems[key] = ListItem;
        });
    }


    /**
     * 加载创建房间的设置资源
     * @param prefabName - 游戏名
     */
    loadPrefab(prefabName: string) {
        this.ContentBoxView.destroyAllChildren();
        const gameOpt = gameOption[prefabName];
        if (gameOpt) {
            radioOption = [];
            this.ContentBoxView.height = 70;
            gameOpt.room.forEach((opt: string[], index) => {
                opt = Object.assign([], opt);
                const optGroup = cc.instantiate(this.radioGroup);
                const radioScript = optGroup.getComponent('Radio');
                radioScript.init(opt.shift(), opt);
                this.ContentBoxView.addChild(optGroup);
                optGroup.y -= index * 60 - 150;
                radioOption.push({
                    instantiate: optGroup,
                    script: radioScript,
                    config: opt[0],
                    keyword: gameOpt.keyword[index],
                });
                this.ContentBoxView.height += 70;
            });
            this._GANE_ = gameOpt;
            cc.director.preloadScene(gameOpt.scene);
        }
    }


    /**
     * 界面隐藏
     * @param Action - 是否显示动画
     */
    popupHide() {
        this.node.destroy();
    }


    /**
     * 创建房间按钮 按下事件
     */
    async onCreateRoom() {
        const query = {};
        radioOption.forEach(item => {
            query[item.keyword] = item.script.value - 1;
        });

        return new Promise((resolve, reject) => {
            axios.api('create_room', {
                params: {
                    gameName: this._ROOM_NAME_,
                },
                data: query,
            }).then((res) => {
                const popup = cc.instantiate(this.popupPrefab);
                this.node.addChild(popup);
                const scriptPopup = popup.getComponent('popup');
                scriptPopup.init('创建中...');
                if (res.status) {
                    axios.api('room_info').then(res => {
                        scriptPopup.message(`创建成功!\n房间号: ${res.roomCode}`);
                        scriptPopup.setEvent('success', () => {
                            popup.destroy();
                            this.node.destroy();
                            cc.director.loadScene(this._GANE_.scene);
                        });
                        resolve(scriptPopup);
                    });
                } else {
                    scriptPopup.message(`创建失败!\n${res.msg}`);
                    // scriptPopup.setEvent('reset', () => {
                    //     this.createRoomClick();
                    // });
                    scriptPopup.setEvent('close', () => {});
                    reject(scriptPopup);
                }
            });
        });
    }

    onDestroy() {
        // console.log('createRoom');
        // cc.loader.setAutoReleaseRecursively('59616007-2ef5-4ce8-ab91-057f1ea39436', true);
    }

    // update (dt) {}
}
