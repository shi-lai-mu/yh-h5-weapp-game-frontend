import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // 游戏页
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home/Home.vue'),
    },
    // 注册页
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Login/Register.vue'),
    },
    // 登陆页
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/Login.vue'),
    },
    // 重置密码页
    {
      path: '/resetPwd',
      name: 'resetPwd',
      component: () => import('@/views/Login/ResetPwd.vue'),
    },
    // 反馈页
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('@/views/Feedback/feedback.vue'),
    },
    // 商城页
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/views/Shop/shop.vue'),
    },
    // 登陆选择页
    {
      path: '/loginStay',
      name: 'loginStay',
      component: () => import('@/views/LoginStay/index.vue'),
    },
  ],
});

