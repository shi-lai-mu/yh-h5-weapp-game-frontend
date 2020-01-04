import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home/Home.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Login/Register.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/Login.vue'),
    },
    {
      path: '/resetPwd',
      name: 'resetPwd',
      component: () => import('@/views/Login/ResetPwd.vue'),
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('@Home/components/feedback.vue'),
    },
  ],
});

