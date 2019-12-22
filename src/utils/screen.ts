import { ScreenInterface } from '@/interface/screen.interface';
// let fullscreen = false


// 强制设置界面横屏
const screenUtil = {

  /**
   * 强制设置横屏显示
   */
  setLandscape: () => {
    const { clientWidth, clientHeight } = document.documentElement;
    const width: number = clientWidth;
    const height: number = clientHeight;
    let landscape!: ScreenInterface;
    if (width < height) {
      landscape = {
        'width': height + 'px',
        'height': width + 'px',
        'top': (height - width) / 2 + 'px',
        'left': 0 - (height - width) / 2 + 'px',
        'transform': 'rotate(90deg)',
        'transform-origin':  '50% 50%',
      };
    }
    return landscape || {};
  },


  /**
   * 强制设置竖屏显示
   */
  setVertical: () => {
    const { clientWidth, clientHeight } = document.documentElement;
    const width: number = clientWidth;
    const height: number = clientHeight;
    let landscape!: ScreenInterface;
    if (width > height) {
      landscape = {
        'width': height + 'px',
        'height': width + 'px',
        'top': (height - width) / 2 + 'px',
        'left': 0 - (height - width) / 2 + 'px',
        'transform': 'rotate(90deg)',
        'transform-origin':  '50% 50%',
      };
    }
    return landscape || {};
  },

  renderResize: (): ScreenInterface => {
    // 判断横竖屏
    let landscape: ScreenInterface;
    const clientWidth: number = document.documentElement.clientWidth;
    const clientHeight: number = document.documentElement.clientHeight;
    if (clientWidth > clientHeight) {
      // 横屏
      landscape = {
        'width': clientWidth + 'px',
        'height': clientHeight + 'px',
        'top': 0 + 'px',
        'left': 0 + 'px',
        'transform': 'none',
        'transform-origin':  '50% 50%',
      };
    } else {
       // 竖屏
       landscape = {
        'width': clientHeight + 'px',
        'height': clientWidth + 'px',
        'top': (clientHeight - clientWidth) / 2 + 'px',
        'left': 0 - (clientHeight - clientWidth) / 2 + 'px',
        'transform': 'rotate(90deg)',
        'transform-origin':  '50% 50%',
      };
    }
    return landscape;
  },


  /**
   * 全屏切换
   */
  fullScreen: (isFullScreen: boolean = true) => {
    const el = document.documentElement;
    const dom = document || void 0;
    // 屏幕同步错误
    if (screenUtil.isFullScreen() !== isFullScreen) {
      isFullScreen = !isFullScreen;
    }

    const target: any = isFullScreen ? dom : el;
    const cancel_open_list = isFullScreen
      ? ['exitFullscreen', 'mozCancelFullScreen', 'webkitCancelFullScreen']
      : ['requestFullscreen', 'webkitRequestFullScreen', 'mozRequestFullScreen', 'msRequestFullscreen']
    ;
    for (const n of cancel_open_list) {
      if (target[n]) {
        target[n]();
        break;
      }
    }
    return !isFullScreen;
  },


  /**
   * 是否为全屏状态
   */
  isFullScreen: () => {
    const doc: any = document;
    return doc.isFullScreen || doc.mozIsFullScreen || doc.webkitIsFullScreen;
  }
};


export default screenUtil;