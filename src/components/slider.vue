<template>
  <div class="slider-box">
    <div class="slider-progress" @click="jumpProgress" ref="progress">
      <div
        class="slider-color-progress"
        :style="{
          backgroundColor: color || '#1989fa',
          width: value + '%',
        }"
      >
        <div
          class="slider-round-touch"
          @touchstart="touchstart"
          @touchmove="touchmove"
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class sliderComponent extends Vue {
  /**
   * 进度条颜色
   */
  @Prop(String) color!: string;
  /**
   * 是否翻转
   */
  @State private screen!: any;
  /**
   * 屏幕是否翻转
   */
  private isOrientation: boolean = true;
  /**
   * 起始轴
   */
  private startPoint: number = 0;
  /**
   * 进度条宽度
   */
  private progressWidth: number = 0;
  /**
   * 进度条偏移度
   */
  private progressOffset: number = 0;
  /**
   * 当前进度数值
   */
  private value: number = 0;


  public mounted() {
    const refProgress: any = this.$refs.progress;
    const { height, top, width, left }: any = refProgress.getBoundingClientRect();
    const isOrientation = this.screen.isOrientation;
    this.isOrientation = isOrientation;
    this.progressWidth = isOrientation ? height : width;
    this.progressOffset = isOrientation ? top : left;
  }


  /**
   * 开始拖动
   */
  public touchstart(e: any) {
    this.startPoint = e.touches[0][this.isOrientation ? 'clientY' : 'clientX'];
  }


  /**
   * 拖动进度
   */
  public touchmove(e: any) {
    const { startPoint, progressOffset, progressWidth } = this;
    this.value = this.full(e.touches[0][this.isOrientation ? 'clientY' : 'clientX'] - progressOffset, progressWidth);
  }


  /**
   * 进度跳转
   */
  public jumpProgress(e: any) {
    const { isOrientation, progressOffset, progressWidth } = this;
    this.value = this.full(e[isOrientation ? 'clientY' : 'clientX'] - progressOffset, progressWidth);
  }


  /**
   * 吸附数值
   */
  private full(val: number, maxValue: number) {
    val = val < 0 ? 0 : val;
    let percentage = val / maxValue * 100 >>> 0;
    const value = percentage > 98 ? ++percentage : percentage;
    return value > 100 ? 100 : value;
  }
}
</script>

<style scoped lang="scss">
  .slider-box {
    padding: 15px 10px;

    .slider-progress {
      width: 100%;
      height: 5px;
      background-color: #ebedf0;
      border-radius: 5px;
    }

    .slider-round-touch {
      position: absolute;
      right: 0;
      width: 24px;
      height: 24px;
      margin: -10px -11px 0 0;
      background-color: #fff;
      border-radius: 50%;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .slider-color-progress {
      position: relative;
      width: 0%;
      height: 100%;
      border-radius: 5px;
    }
  }
</style>
