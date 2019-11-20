<template>
  <div :style="home" class="home fixed-content">
    <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574008400633&di=229c72076f8bb09383019c1098d5d6db&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F3949d1f84afc0e8f255d3cdf112adbcc0103239230c72-cmXG2V_fw658">

    <div class="content fixed-content">
      <handleBtn iconName="全 屏" iconClass="fangda" bottom="60" @click.native="fullScreen"/>
      <handleBtn iconName="客 服" iconClass="kefu" bottom="45"/>
      <handleBtn iconName="设 置" iconClass="settings" bottom="30"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ScreenInterface } from '@/interface/screen.interface';
import handleBtn from '@/components/handleBtn.vue';
import landscape from '@/utils/screen';

@Component({
  components: {
    handleBtn,
  },
})
export default class Home extends Vue {
  // 根组件样式
  private home: ScreenInterface = {
    'width': '',
    'height': '',
    'top': '',
    'left': '',
    'transform': '',
    'transform-origin': '',
  };
  private isFullScreen: boolean = false;

  // 强制设置横屏显示，且添加监听方法
  private mounted() {
    const resize: any = landscape.setLandscape();
    this.home = resize;
    window.addEventListener('resize', this.renderResize, false);
  }

  private beforeDestroy() {
    // 移除监听
    window.removeEventListener('resize', this.renderResize, false);
  }

  // 监听横竖屏变化的方法
  private renderResize() {
    const resize: any = landscape.renderResize();
    this.home = resize;
  }

  // 设置全屏显示
  private fullScreen() {
    // 全屏事件
    const doc: any = document;
    const element: any = document.documentElement;
    if (this.isFullScreen) {
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

  }
}
</script>
<style lang="scss" scoped>
  .fixed-content {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .home {  
    z-index: 9;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .content {
    z-index: 10;
    padding: 15px;
  }
</style>
