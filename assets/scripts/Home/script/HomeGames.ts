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

cc.view.setResizeCallback((e) => {
  const { width, height } = cc.winSize;
  console.log()
  if (width < height) {
    console.log(cc.macro.ORIENTATION_LANDSCAPE)
    cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT)
  }
})

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


    /**
     * 跳转到指定页面
     * @param pageIndex 页面下标
     */
    jumpPage(_e, pageIndex: number) {
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
                      if (msg === '房间不存在!') {
                        msg = '没有可用的房间!';
                      }
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
        const prefabScript = createRoomPrefab.getComponent('Room');
        if (!gameName) {
            return prefabScript.typeRoomModel();
        }
        if (typeof gameName === 'string') {
            const createRoom = prefabScript.createNode;
            const Room = createRoom.getComponent('CreateRoom');
            prefabScript.createRoomModel();
            Room.renderCallBack = () => {
                console.log(Room.listItems[gameName], gameName);
                const current = Room.listItems[gameName];
                if (current) {
                    current.onClick();
                    const popup = Room.onCreateRoom(() => popup.success());
                }
            }
        }
    }


    update() {
        // 消息滚动逻辑
        const { messageId, messageList, MessageContent } = this;
        if (MessageContent && messageList[messageId]) {
            const { node } = MessageContent;
            const MessageBoxWidth = this.MessageBox.width;
            //  如果完全超出最右方
            if (node.x < -node.width) {
                MessageContent.string = messageList[messageId].content;
                node.x = MessageBoxWidth;
                this.messageId++;
            } else {
                node.x -= .5;
            }
        } else {
            this.messageId = 0;
        }
    }
}
