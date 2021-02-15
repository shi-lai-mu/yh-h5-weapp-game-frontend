// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class UserCenterPopup extends cc.Component {

    @property(cc.Node) content: cc.Node = null;

    @property(cc.Prefab) itemUI: cc.Prefab[] = [];

    onLoad() {
        this.ItemOnClick(false, 0);
    }


    /**
     * item点击事件
     * @param loadPrefabIndex 加载资源下标
     */
    ItemOnClick(_e, loadPrefabIndex: number) {
        this.content.removeAllChildren();
        const instantiate = cc.instantiate(this.itemUI[loadPrefabIndex]);
        this.content.addChild(instantiate);
        this.content.height = instantiate.height;
        instantiate.width = this.content.width;
    }


    close() {
        this.node.destroy();
    }
}
