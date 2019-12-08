<template>
  <div>
    <audio ref="click"></audio>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BgMusic extends Vue {
  public mounted() {
    // 加载点击音效
    const click: any = this.$refs.click;
    click.src = 'https://perfergame.oss-cn-beijing.aliyuncs.com/H5Game/click.mp3';
    click.preload = 'auto';
  }

  // 点击播放
  public sound() {
    const click: any = this.$refs.click;
    click.play();
  }
}
</script>