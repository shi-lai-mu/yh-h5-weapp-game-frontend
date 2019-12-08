import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import axios from '@/lib/axios';
import Vant from 'vant';
import Popup from '@/components/public/popup.vue';
import 'vant/lib/index.css';
import { AxiosInstance } from 'axios';

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}


Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

Vue.use(Vant);
Vue.component('popup', Popup);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

router.beforeEach((to, from, next) => {
  to.matched.map( (item: any) => {
    // 路由判断
    if (item.name === 'home') {
      const userInfo: any = store.state.userInfo;
      console.log(userInfo);
      if (!userInfo.token) {
        next({ name: 'login' });
        return;
      }
    }
    next();
  });
});
