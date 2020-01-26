import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import axios from '@/utils/axios';
// import Vant from 'vant';
import { Overlay } from 'vant';
import Popup from '@/components/public/popup.vue';
import 'vant/lib/index.css';
import obServer from '@/utils/observer';
import socketIO from '@/utils/socketIO';


Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
obServer.use(Vue);
socketIO.use(Vue);

// Vue.use(Vant);
Vue.use(Overlay);
Vue.component('popup', Popup);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// router.beforeEach((to, from, next) => {
//   if (to.name === 'home') {
//     const userInfo: any = store.state.userInfo;
//     if (!userInfo.token) {
//       next({ name: 'login' });
//       return;
//     }
//   }
//   next();
// });