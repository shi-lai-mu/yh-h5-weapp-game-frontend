// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass} = cc._decorator;
import { shareAppMessage } from '../../../../scripts/lib/tool';

@ccclass
export default class StopGames extends cc.Component {

    backEvent = null;

    backHomeEvent = null;

    /**
     * 分享数据
     */
    shareData = {
        title: '',
        imageUrl: undefined,
        query: undefined,
    }

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
        const { title, imageUrl, query } = this.shareData;
        shareAppMessage(title, imageUrl, query);
    }
}
