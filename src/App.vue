<template>
  <div id="app" @click="handleSound">
    <router-view/>
    <clickMusic ref="clickMusic"/>
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
    if (/\?admin/.test(window.location.href)) {
      return;
    }

    const to = this.filterLoginState();
    if (to && typeof to !== 'boolean') {
      this.$router.push(to);
    }

    this.$router.beforeEach((to, from, next) => {
      const toPage = this.filterLoginState(to);
      if (!['login', 'register'].includes(to.name || '') && typeof toPage !== 'boolean') {
        return next(toPage);
      }
      next();
    });
  }


  /**
   * 路由守卫 登陆检测
   */
  private filterLoginState(toRouter?: any) {
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
    const targetRouter = (window.location.pathname.match(/(?<=\/|)(\w+)(?=\/|\?|)/) || [])[0];
    
    // 免拦截位置
    if ([ 'login', 'loginStay', 'register', 'resetPwd' ].includes(targetRouter)) {
      to = !0;
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
  @import url('./assets/css/style.scss');
  @import url('./assets/css/icon.css');

  #app {
    color: #333;
    user-select: none;
  }


  // 400 小分辨率适配
  @media screen and (max-height: 400px) {
    #app .content >  * {
      zoom: .8;
    }
  }

  // 350 小分辨率适配
  @media screen and (max-height: 350px) {
    #app .content >  * {
      zoom: .7;
    }
  }

  // 300 小分辨率适配
  @media screen and (max-height: 300px) {
    #app .content >  * {
      zoom: .6;
    }
  }


  // 500 中分辨率适配
  @media screen and (min-height: 500px) {
    #app .content >  * {
      zoom: 1.05;
    }
  }

  // 600 中分辨率适配
  @media screen and (min-height: 600px) {
    #app .content >  * {
      zoom: 1.1;
    }
  }

  // 700 大分辨率适配
  @media screen and (min-height: 700px) {
    #app .content >  * {
      zoom: 1.15;
    }
  }

  // 800 大分辨率适配
  @media screen and (min-height: 800px) {
    #app .content >  * {
      zoom: 1.2;
    }
  }

  // 900 大分辨率适配
  @media screen and (min-height: 900px) {
    #app .content >  * {
      zoom: 1.25;
    }
  }
</style>
