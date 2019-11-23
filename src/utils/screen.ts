import { ScreenInterface } from '@/interface/screen.interface';
// let fullscreen = false


// 强制设置界面横屏
export default {

  setLandscape: () => {
    // 强制设置横屏显示
    const width: number = document.documentElement.clientWidth;
    const height: number = document.documentElement.clientHeight;
    if (width < height) {
      const landscape: ScreenInterface = {
        'width': height + 'px',
        'height': width + 'px',
        'top': (height - width) / 2 + 'px',
        'left': 0 - (height - width) / 2 + 'px',
        'transform': 'rotate(90deg)',
        'transform-origin':  '50% 50%',
      };
      return landscape;
    } else {
      return {};
    }
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

  fullScreen: (isFullScreen: boolean) => {
    // 全屏事件
    const doc: any = document;
    const element: any = document.documentElement;
    if (isFullScreen) {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    } else {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
    if (isFullScreen) {
      return false;
    } else {
      return true;
    }
  },
};
