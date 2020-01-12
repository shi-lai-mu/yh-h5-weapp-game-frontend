import Vue from 'vue';
import Router from 'vue-router';

import LoginRoutes from '@/views/Login/routes';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    // 游戏页
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home/Home.vue'),
    },
    // 登陆页
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      children: LoginRoutes,
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
      component: () => import('@/views/Shop/Shop.vue'),
    },
  ],
});

