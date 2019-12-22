<template>
  <div class="login">
    <div class="title">
      <span>账号登陆</span>
    </div>
    <div class="input">
      <input type="text" placeholder="请输入账号" v-model="account">
    </div>
    <div class="input">
      <input type="password" placeholder="请输入密码" v-model="pwd">
    </div>
    <van-button type="info" round @click="handleLogin">登陆</van-button>
    <div class="navigation forget">
      <router-link to="/resetPwd">
        <span>忘记密码 ？</span>
      </router-link>
    </div>
    <div class="navigation reg">
      <router-link to="/register">
        <span>没有账号，去注册</span>
        <van-icon name="arrow" />
      </router-link>
      <router-link to="/home">
        <span>没有账号，去注册</span>
        <van-icon name="arrow" />
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { Toast } from 'vant';

@Component
export default class Login extends Vue {
  private account: string = '';             // 用户登陆账号
  private pwd: string = '';                 // 注册密码

  @Action private SET_USER!: (data: any) => void;
  @State private userInfo!: any;

  // 登陆
  public handleLogin() {
    const account = this.account;
    const password = this.pwd;
    if (account === '') {
      Toast('账号不能为空！');
      return;
    } else if (password === '') {
      Toast('密码不能为空！');
      return;
    }
    this.$axios
      .api('login', {
        data: {
          account,
          password,
          token: false,
        },
      }).then( (res: any) => {
        if (res.id) {
          Toast('登陆成功');
          // 保存用户登陆的账号密码
          localStorage.setItem('userAccount', JSON.stringify({
            account,
            password,
          }));
          this.SET_USER(res);
          setTimeout(() => {
            this.$router.push({
              name: 'home',
            });
          }, 1500);
        } else {
          Toast(res.msg);
        }
      });
  }
}
</script>
<style lang="scss">
  .login {
    padding: 20px;

    .title {
      margin-bottom: 20px;
      font-size: 26px;
    }

    .input {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #f6f6f6;
      align-items: center;
      justify-content: space-between;

      input {
        width: 66%;
        border: 0;
        line-height: 40px;
        outline: none;
      }
    }

    .van-button {
      width: 100%;
      margin-top: 20px;
    }

    .reg {
      position: fixed;
      bottom: 5vh;
      left: 50%;
      transform: translateX(-50%);

      a {
        display: inline-block;
        width: 100%;
      }
    }

    .forget {     
      a {
        color: #b8b8b8 !important;
      }
    }
  }
</style>