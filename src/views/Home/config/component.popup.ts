export default {
  setting: {
    name: '设置',
    component: (resolve: any) => require([ '@Home/components/setting.vue' ], resolve),
  },
  service: {
    name: '客服',
    classStyle: 'component_popup_p',
    component: (resolve: any) => require([ '@Home/components/service.vue' ], resolve),
  },
  activity: {
    name: '活动',
    component: (resolve: any) => require([ '@Home/components/activity.vue' ], resolve),
  },
  email: {
    name: '邮件',
    classStyle: 'component_popup_p',
    component: (resolve: any) => require([ '@Home/components/email.vue' ], resolve),
  },
  account: {
    name: '账号设置',
    classStyle: 'component_popup_p',
    component: (resolve: any) => require([ '@Home/components/account/index.vue' ], resolve),
  },
}
