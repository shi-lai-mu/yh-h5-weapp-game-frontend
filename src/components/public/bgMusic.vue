<template>
  <div>
    <audio ref="bg"></audio>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BgMusic extends Vue {
  public mounted() {
    // 设置背景音乐
    const bg: any = this.$refs.bg;
    bg.src = 'https://perfergame.oss-cn-beijing.aliyuncs.com/H5Game/bg-music.mp3';
    bg.autoplay = 'autoplay';
    bg.loop = 'loop';
    bg.preload = 'auto';
  }

  // 关闭音乐
  public suspended() {
    const bg: any = this.$refs.bg;
    bg.pause();
  }

  // 播放音乐
  public audioPlay() {
    const bg: any = this.$refs.bg;
    bg.play();
  }
}
</script>