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
export default class NewClass extends cc.Component {

    @property(cc.ProgressBar)
    ProgressBar: cc.ProgressBar = null;

    @property(cc.Label)
    ProgressText: cc.Label = null;
    
    progress: number = 0;
    
    startLoadingCallBack: any;
    endLoadingCallBack: any;

    start () {
        // setInterval(() => {
        //     this.updateValue(this.progress > 1 ? 0 : this.progress += 0.1)
        // }, 200)
    }

    startLoading(callback) {
        this.startLoadingCallBack = callback;
    }


    endLoading(callback) {
        this.endLoadingCallBack = callback;
    }


    updateValue(progress) {
        this.progress = progress;
        this.progressRender();
    }


    progressRender() {
        const progress = this.progress > 1 ? 1 : this.progress;
        this.ProgressBar.progress = progress;
        this.ProgressText.string = String(Math.round(progress * 100));
    }
}
