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
import { luanchOptions, onShow, offShow } from '../../lib/tool';
import State from '../../utils/state';

@ccclass
export default class HomeGames extends cc.Component {
    // 创建房间资源
    @property(cc.Prefab) createRoomPrefab: cc.Prefab = null;
    // 滚动消息条
    @property(cc.Node) MessageBox: cc.Node = null;
    // 滚动消息内容
    @property(cc.Label) MessageContent: cc.Label = null;
    // 游戏列表
    @property(cc.PageView) GameList: cc.PageView = null;
    // 滚动消息列表
    messageList: Array<{ id: number; content: string; }> = [];
    // 当前消息ID
    messageId: number = 0;


    start() {
        axios.api('get_home_message').then(messageList => this.messageList = messageList);
        if (State.IS_WECHAT) {
            onShow(this.wxShow, this);
        }
        // 加入房间检测
        this.joinUserRoom();
    }


    /**
     * 销毁时
     */
    onDestroy() {
        if (State.IS_WECHAT) {
            offShow(this.wxShow, this);
        }
    }


    /**
     * 显示为前台时
     * @param option 参数
     */
    wxShow(option) {
        luanchOptions.query = option.query;
        this.joinUserRoom();
    }


    jumpPage(e, pageIndex: number) {
        this.GameList.scrollToPage(Number(pageIndex), .5);
        // this.GameList.setCurrentPageIndex(pageIndex);
    }


    /**
     * 加入用户房间检测
     */
    joinUserRoom() {
        if (luanchOptions.query.fn === 'joinRoom' && luanchOptions.query.roomCode) {
            this.joinRoomEvent(luanchOptions.query.roomCode);
            luanchOptions.query = {};
        }
    }


    /**
     * 加入房间
     */
    joinRoom() {
        const that = this;
        cc.loader.loadRes('prefab/subpack/keyboard', cc.Prefab, (err, prefab) => {
            if (prefab) {
                const joinRoomPopup = cc.instantiate(prefab);
                cc.director.getScene().addChild(joinRoomPopup);
                joinRoomPopup && (joinRoomPopup.getComponent('keyboard').parentClass = {
                    emit: that.joinRoomEvent,
                });
            }
        });
    }


    /**
     * 加入房间事件
     * @param roomCode 房间号
     */
    joinRoomEvent(roomCode: number) {
        axios.api('room_join', {
            data: {
                roomCode,
            },
        }).then(({ status, msg }) => {
            if (status && msg && msg.scene) {
                cc.director.loadScene(msg.scene);
            } else {
                cc.loader.loadRes('prefab/popup', cc.Prefab, (_err, prefab) => {
                    if (prefab) {
                        const popup = cc.instantiate(prefab);
                        cc.director.getScene().addChild(popup);
                        const scriptPopup = popup.getComponent('popup');
                        scriptPopup.init('加入房间失败!\n' + msg);
                        scriptPopup.setEvent('close', () => {});
                    }
                });
            }
        });
    }


    /**
     * 随机加入房间
     */
    roomRandom() {
        axios.api('room_random').then(({ status, msg }) => {
            if (status && msg && msg.scene) {
                cc.director.loadScene(msg.scene);
            } else {
                cc.loader.loadRes('prefab/popup', cc.Prefab, (_err, prefab) => {
                    if (prefab) {
                        const popup = cc.instantiate(prefab);
                        cc.director.getScene().addChild(popup);
                        const scriptPopup = popup.getComponent('popup');
                        scriptPopup.init('加入房间失败!\n' + msg);
                        scriptPopup.setEvent('close', () => {});
                    }
                });
            }
        });
    }


    /**
     * 创建房间点击事件
     */
    showCreateRoomPopup(_e, gameName?: string) {
        const createRoomPrefab = cc.instantiate(this.createRoomPrefab);
        cc.director.getScene().addChild(createRoomPrefab);
        const createRoom = createRoomPrefab.getComponent('CreateRoom');
        if (typeof gameName === 'string') {
            setTimeout(async () => {
                createRoom.listItems[gameName].onClick();
                const popup = await createRoom.onCreateRoom();
                setTimeout(() => {
                    popup.success();
                }, 200);
            }, 500);
        }
    }


    update() {
        const { messageId, messageList, MessageContent } = this;
        const MessageBoxWidth = this.MessageBox.width;
        if (messageList[messageId]) {
            //  如果完全超出最右方
            if (MessageContent.node.x < -MessageContent.node.width) {
                MessageContent.string = messageList[messageId].content;
                MessageContent.node.x = MessageBoxWidth;
                this.messageId++;
            } else {
                MessageContent.node.x -= 1;
            }
        } else {
            this.messageId = 0;
        }
    }
}
