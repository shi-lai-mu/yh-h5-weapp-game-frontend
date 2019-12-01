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
    bg.src = 'https://allselect.oss-cn-hangzhou.aliyuncs.com/mallAdmin/1574218188052.mp3';
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