// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { info } from '../../utils/gameSetting';
import axios from '../../utils/axiosUtils';
const {ccclass, property} = cc._decorator;

@ccclass
export default class EliminatingScene extends cc.Component {
    /**
     * 游戏信息
     */
    get info() {
        return info('消消乐');
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

    backHome() {
        cc.director.loadScene('Home');
    }

    scrollScent(e) {
        console.log(e);
    }
}
