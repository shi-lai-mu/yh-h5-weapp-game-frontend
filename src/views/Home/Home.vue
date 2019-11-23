<template>
  <div :style="home" class="home">
    <audio ref="bg"></audio>
    <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574008400633&di=229c72076f8bb09383019c1098d5d6db&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F3949d1f84afc0e8f255d3cdf112adbcc0103239230c72-cmXG2V_fw658">
    <div class="content">
      <handleBtn iconName="全 屏" iconClass="fangda" bottom="60" @click.native="fullScreen"/>
      <handleBtn iconName="客 服" iconClass="kefu" bottom="43" @click.native="suspended"/>
      <handleBtn iconName="设 置" iconClass="settings" bottom="26" @click.native="audioPlay"/>
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
  private isFullScreen: boolean = false; // 判断是否全屏

  // 强制设置横屏显示，且添加监听方法
  private mounted() {
    const resize: any = landscape.setLandscape();
    this.home = resize;
    window.addEventListener('resize', this.renderResize, false);
    // 设置背景音乐
    const bg: any = this.$refs.bg;
    bg.src = 'https://allselect.oss-cn-hangzhou.aliyuncs.com/mallAdmin/1574218188052.mp3';
    bg.autoplay = 'autoplay';
    bg.loop = 'loop';
  }

  private suspended() {
    const bg: any = this.$refs.bg;
    bg.pause();
  }

  private audioPlay() {
    const bg: any = this.$refs.bg;
    bg.play();
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
    const result = landscape.fullScreen(this.isFullScreen);
    this.isFullScreen = result;
  }
}
</script>
<style lang="scss" scoped>
  .home {
    position: fixed;
    width: 100%;
    height: 100%;
    transition: all 550ms ease-in-out;
  }
  img {
    width: 100%;
    height: 100%;
    transform: translate(-1px, 1px);
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-left: 30px;
  }
</style>
