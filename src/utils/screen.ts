import { ScreenInterface } from '@/interface/screen.interface';
// 强制设置界面横屏
export default () => {
  const clientWidth: number = document.documentElement.clientWidth;
  const clientHeight: number = document.documentElement.clientHeight;
  if (clientWidth < clientHeight) {
    const landscape: ScreenInterface = {
      'width': clientHeight + 'px',
      'height': clientWidth + 'px',
      'top': (clientHeight - clientWidth) / 2 + 'px',
      'left': 0 - (clientHeight - clientWidth) / 2 + 'px',
      'transform': 'rotate(90deg)',
      'transform-origin':  '50% 50%',
    };
    return landscape;
  }
};
