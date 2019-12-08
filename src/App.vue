<template>
  <div id="app" @click="handleSound">
    <clickMusic ref="clickMusic"/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import clickMusic from '@/components/public/clickMusic.vue';

@Component({
  components: {
    clickMusic,
  },
})
export default class App extends Vue {
  @Action private SET_USER!: (data: any) => void;
  @State private userInfo!: any;

  private created() {
    // 登陆数据检测并读取
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo: any = JSON.parse(userInfoString);
      this.SET_USER(userInfo);
    }
  }

  // 事件委托, 点击音效
  private handleSound(e: any) {
    if (e.target.dataset.click === 'click') {
      const click: any = this.$refs.clickMusic;
      click.sound();
    }
  }

}
</script>

<style lang="scss">
  #app {
    font-size: 13px;
  }
@import url('./static/style.scss');
@import url('./static/icon.css');
</style>
