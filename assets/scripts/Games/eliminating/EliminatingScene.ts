// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import axios from '../../utils/axiosUtils';
import State from '../../utils/state';
const {ccclass, property} = cc._decorator;

@ccclass
export default class EliminatingScene extends cc.Component {
    /**
     * 游戏信息
     */
    get info() {
        return State.system.info('消消乐');
    }

    mapData = [];


    start () {
        console.log(this.info);
        this.node.on(cc.Node.EventType.TOUCH_START, event => {
            console.log(this, event);
           // this.voiceNode.active = true;
        }, this);

        axios.api('game_record', {
            params: {
                gameId: this.info.id,  
            },
        }).then(res => {
            console.log(res);
        });
    }


    /**
     * 返回大厅
     */
    backHome() {
        cc.director.loadScene('Home');
    }


    /**
     * 滚动场景时
     * @param e 事件
     */
    scrollScent(e) {
        console.log(e);
    }
}
