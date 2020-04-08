// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { shareAppMessage } from '../../../scripts/utils/tool';

@ccclass
export default class StopGames extends cc.Component {

    backEvent = null;

    backHomeEvent = null;

    /**
     * 继续按钮
     */
    back() {
        this.node.destroy();
        this.backEvent && this.backEvent();
    }


    /**
     * 返回首页
     */
    onHome() {
        this.back();
        this.backHomeEvent && this.backHomeEvent();
    }


    /**
     * 分享时
     */
    onShare() {
        shareAppMessage('测试', 'https://slmblog.com/LOGO.png', 'test=1');
    }
}
