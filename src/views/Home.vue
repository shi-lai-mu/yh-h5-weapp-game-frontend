<template>
  <div :style="home" class="home">
    <img src="https://yanxuan.nosdn.127.net/14943267735961674.jpg" alt="">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import landscape from '@/utils/screen';
import { ScreenInterface } from '@/interface/screen.interface';

@Component({
  components: {
  },
})
export default class Home extends Vue {
  // 根组件样式
  private home = {};

  // 监听横竖屏变化的方法
  private renderResize() {
    const resize: any = landscape.renderResize();
    this.home = resize;
  }

  // 强制设置横屏显示，且添加监听方法
  private mounted() {
    const resize: any = landscape.setLandscape();
    window.addEventListener('resize', this.renderResize, false);
    this.home = resize;
  }

  private beforeDestroy() {
    // 移除监听
    window.removeEventListener('resize', this.renderResize, false);
  }
}
</script>
<style lang="scss" scoped>
  .home {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  img {
    width: 100%;
    height: 100%;
  }
</style>
