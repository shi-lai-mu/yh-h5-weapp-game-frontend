export default [
  // 登陆滞留
  {
    path: '',
    component: () => import('@views/Login/components/stay.vue'),
  },
  // 账号登陆
  {
    path: 'account',
    name: 'AccountLogin',
    component: () => import('@views/Login/components/account.vue'),
  },
  // 注册
  {
    path: 'register',
    name: 'AccountRegister',
    component: () => import('@views/Login/components/register.vue'),
  },
  // 重设密码
  {
    path: 'unset/password',
    name: 'AccountUnsetPassword',
    component: () => import('@views/Login/components/unPassword.vue'),
  },
];
