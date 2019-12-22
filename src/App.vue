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
    let userInfo: any = localStorage.getItem('userInfo');
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      const { last_login_time } = userInfo;

      // 身份过期清空
      if (last_login_time && last_login_time + 86400000 < Date.now()) {
        let userAccount: any = localStorage.getItem('userAccount');
        userAccount = JSON.parse(userAccount);
        const { account, password } = userAccount;
        // 重新登陆
        this.$axios
          .api('login', {
            data: {
              account,
              password,
              token: false,
            },
          }).then( (res: any) => {
            if (res.id) {
              this.SET_USER(res);
            }
          });
      } else {
        this.SET_USER(userInfo);
      }
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
  @import url('./static/style.scss');
  @import url('./static/icon.css');

  #app {
    color: #333;
  }

  // 小分辨率适配
  @media screen and (max-height: 350px) {
    #app .content >  * {
      zoom: .8;
    }
  }
</style>
