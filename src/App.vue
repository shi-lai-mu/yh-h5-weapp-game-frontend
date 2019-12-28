<template>
  <div id="app" @click="handleSound">
    <clickMusic ref="clickMusic"/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import clickMusic from '@/components/public/clickMusic.vue';
import { Component, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { Toast } from 'vant';
let loginStateTimeout;

@Component({
  components: {
    clickMusic,
  },
})
export default class App extends Vue {
  @Action private SET_USER!: (data: any) => void;
  @State private userInfo!: any;

  private created() {
    const to = this.filterLoginState();
    if (to && typeof to !== 'boolean') {
      this.$router.push(to);
    }

    this.$router.beforeEach((to, from, next) => {
      const toPage = this.filterLoginState();
      if (!['login', 'register'].includes(to.name || '') && typeof toPage !== 'boolean') {
        next(toPage);
      }
      next();
    });
  }


  /**
   * 路由守卫 登陆检测
   */
  private filterLoginState() {
    if (this.userInfo.id) {
      return true;
    }
    let userInfo: any = localStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    let to;

    // 登陆过期
    if (!userInfo || !userInfo.token) {
      to = { name: 'login' };
    } else if (userInfo.last_login_time + 86400000 < Date.now()) {
      to = { name: 'login' };
      Toast('您的登陆已过期, 请重新登陆!');
    } else {
      this.SET_USER(userInfo);
    }

    let userAccount: any = localStorage.getItem('userAccount');
    if (userAccount) {
      userAccount = JSON.parse(userAccount);
      const { account, password } = userAccount;
      let toast: any;
      const clock = setTimeout(() => {
        toast = Toast.loading({
          duration: 0,
          forbidClick: true,
          message: '授权登陆中...',
        });
        loginStateTimeout = setTimeout(() => {
            toast && toast.clear();
            Toast.fail('登陆超时，请稍后再试!');
        }, 5000);
      }, 500);
      // 重新登陆
      this
        .$axios
        .api('login', {
          data: {
            account,
            password,
          },
        })
        .then((res: any) => {
          clock && clearTimeout(clock);
          if (res.id) {
            this.SET_USER(res);
            toast && toast.clear();
            this.$router.push({
              name: 'home',
            });
          } else {
            Toast.fail(res.msg ? res.error + ': ' + res.msg : '登陆失败，账号数据异常!');
            // 缓存密码错误 ?
            if (/密码错误/.test(res.msg)) {
              localStorage.clear();
            }
          }
        })
        .catch(() => {
          toast && toast.clear();
          clock && clearTimeout(clock);
        });
    }
    return to;
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
<<<<<<< HEAD
    font-size: 15px;
=======
    color: #333;
  }

  // 小分辨率适配
  @media screen and (max-height: 350px) {
    #app .content >  * {
      zoom: .8;
    }
>>>>>>> 0ee7c34260d616e3f9bb133a5085f761a53e5423
  }
</style>
