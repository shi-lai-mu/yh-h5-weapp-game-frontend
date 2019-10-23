<template>
  <div :style="home" class="home">
    <img src="https://yanxuan.nosdn.127.net/14943267735961674.jpg" alt="">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import screen from '@/utils/screen';
import { ScreenInterface } from '@/interface/screen.interface';

@Component({
  components: {
  },
})
export default class Home extends Vue {
  public home = {};
  public mounted() {
    const landscape: any = screen();
    this.home = landscape;
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
    width: 100vh;
    height: 100vw;
  }
</style>
