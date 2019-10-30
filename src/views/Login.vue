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
    <div class="reg">
      <router-link to="/reg">
        <span>没有账号，去注册</span>
        <van-icon name="arrow" />
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Toast } from 'vant';

@Component
export default class Login extends Vue {
  private account: string = '';             // 用户登陆账号
  private pwd: string = '';                 // 注册密码

  // 登陆
  public handleLogin(): void {
    const account = this.account;
    const password = this.pwd;
    if (account === '') {
      Toast('账号不能为空！');
      return;
    } else if (password === '') {
      Toast('密码不能为空！');
      return;
    }
    Toast.loading({
      message: '正在登陆',
      forbidClick: true,
    });
    this.$axios
      .api('login')
      .post({
        data: {
          account,
          password,
          token: false,
        },
      }).then( (res: any) => {
        Toast.clear();
        if (res.id) {
          Toast('登陆成功');
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
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f6f6f6;

      input {
        width: 66%;
        line-height: 40px;
        outline: none;
      }
    }

    .van-button {
      width: 100%;
      margin-top: 20px;
    }

    .reg {
      margin-top: 20px;
      text-align: center;

      a{
        position: relative;
        display: inline-block;
        width: 40%;

        .van-icon-arrow{
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
</style>