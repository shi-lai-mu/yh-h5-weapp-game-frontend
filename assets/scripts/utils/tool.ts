/**
 * 检测旋转屏幕
 */
export const testingRotate = () => {
    const { width, height } = cc.view.getFrameSize();
    cc.view.setFrameSize(width, width < height ? height / 3 : height);
    if (width < height) {
      alert('请横屏游玩!');
    }
}