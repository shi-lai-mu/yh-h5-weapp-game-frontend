<template>
  <div class="btn" :style="'bottom:' + bottom + '%;'" @click="handleSound">
    <div class="sik"></div>
    <i :class="'game game-' + iconClass"></i>
    <span class="icon-name">{{ iconName }}</span>
    <audio ref="click"></audio>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Toast } from 'vant';

@Component
export default class HandleBtn extends Vue {
  @Prop(String) private iconName!: string;
  @Prop(String) private iconClass!: string;
  @Prop(String) private bottom!: string;

  public mounted() {
    const click: any = this.$refs.click;
    click.src = 'https://allselect.oss-cn-hangzhou.aliyuncs.com/mallAdmin/1574517092874.mp3';
    click.preload = 'auto';
  }

  public handleSound() {
    const click: any = this.$refs.click;
    click.play();
  }
}
</script>

<style lang="scss">
  .btn {
    position: absolute;
    width: 3rem;
    height: 3rem;
    background-image: radial-gradient(circle, rgba(97, 107, 102, .5), rgba(85, 105, 121, .5));
    border: 1px solid #FBF4E5;
    text-align: center;
    border-radius: 50%;

    .sik {
      position: absolute;
      top: .5em;
      left: 1em;
      width: 5px;
      height: 8px;
      background: #FCFEFF;
      border-radius: 50%;
      transform: rotate(45deg);
    }

    .game{
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 27px;
      color: #FBF1DE;
      transform: translate(-50%, -50%);
    }

    .icon-name {
      position: absolute;
      bottom: -20%;
      left: 0;
      width: 40px;
      color: #FBF1DE;
    }
  }
</style>