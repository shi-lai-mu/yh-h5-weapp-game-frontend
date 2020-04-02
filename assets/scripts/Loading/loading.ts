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

@ccclass
export default class ProgressLoading extends cc.Component {
    // 进度条
    @property(cc.ProgressBar) ProgressBar: cc.ProgressBar = null;
    // 进度百分比节点
    @property(cc.Label) ProgressText: cc.Label = null;
    // 加载状态信息
    @property(cc.Label) ProgressMessage: cc.Label = null;
    // 当前进度
    progress: number = 0;
    // 开始时的回调
    startLoadingCallBack: any;
    // 结束时的回调
    endLoadingCallBack: any;

    // start () {
    //     // setInterval(() => {
    //     //     this.updateValue(this.progress > 1 ? 0 : this.progress += 0.01)
    //     // }, 50)
    // }


    /**
     * 完成时
     * @param callback 回调
     */
    startLoading(callback) {
        this.startLoadingCallBack = callback;
    }


    /**
     * 进度完成时
     * @param callback 回调函数
     */
    endLoading(callback) {
        this.endLoadingCallBack = callback;
    }


    /**
     * 更新进度
     * @param progress 进度值
     * @param message  进度内容
     */
    updateValue(progress: number, message?: string) {
        this.progress = progress;
        this.progressRender();
        if (message) {
            this.ProgressMessage.string = message;
        }
    }


    /**
     * 加载渲染
     */
    progressRender() {
        const progress = this.progress > 1 ? 1 : this.progress;
        this.ProgressBar.progress = progress;
        this.ProgressText.string = String(Math.round(progress * 100));
    }
}
