<template>
  <div :style="home">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ScreenInterface } from '@/interface/screen.interface';
import { Action } from 'vuex-class';
import landscape from '@/utils/screen';

@Component
export default class GameLayout extends Vue {
  /**
   * 根组件样式
   */
  private home: ScreenInterface = {
    'width': '',
    'height': '',
    'top': '',
    'left': '',
    'transform': '',
    'transform-origin': '',
  };
  /**
   * 判断是否全屏
   */
  private isFullScreen: boolean = false;
  @Action private SET_SCREEN!: (screenData: any) => void;


  /**
   * 强制设置横屏显示，且添加监听方法
   */
  public mounted() {
    const resize: any = landscape.setLandscape();
    this.home = resize;
    this.SET_SCREEN(resize);
    window.addEventListener('resize', this.renderResize, false);
  }


  /**
   * 移除监听
   */
  public beforeDestroy() {
    window.removeEventListener('resize', this.renderResize, false);
  }


  /**
   * 监听横竖屏变化的方法
   */
  public renderResize() {
    const resize: any = landscape.renderResize();
    this.home = resize;
    this.SET_SCREEN(resize);
  }


  /**
   * 设置全屏显示
   */
  public fullScreen() {
    const result = landscape.fullScreen(this.isFullScreen);
    this.isFullScreen = result;
  }
}
</script>
