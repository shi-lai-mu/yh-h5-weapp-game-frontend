<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

@Component
export default class App extends Vue {
  @Action private SET_USER!: (data: any) => void;
  @State private userInfo!: any;

  public created() {
    // 登陆数据检测并读取
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo: any = JSON.parse(userInfoString);
      this.SET_USER(userInfo);
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
