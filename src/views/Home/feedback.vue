<template>
  <div class="container">
    <div class="head">
      <div class="title flex-row">
        <i class="game game-logo-y"></i>
        <span>游惠小游戏</span>
      </div>
      <div class="notice">欢迎您给游惠小游戏提出任何建议，非常感谢！！！</div>
    </div>

    <div class="content">
      <div class="row">
        <span class="span">联系方式（必填）</span>
        <input type="text" v-model="contact">
      </div>

      <div class="row">
        <span class="span">建议描述（必填）</span>
        <textarea maxlength="200" v-model="content" placeholder="请输入您的建议"></textarea>
      </div>
    </div>

    <div class="content">
      <span class="span">反馈类型：{{ type }}</span>
      <i class="game game-arrow-right" @click="showPopup"></i>
      <van-action-sheet v-model="show" :actions="feedBackType" @select="onSelect" />
    </div>

    <van-button type="info" round @click="handleSubmit">提交</van-button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Toast } from 'vant';

@Component
export default class Feedback extends Vue {
  private contact: string = '';
  private content: string = '';
  private feedBackType: any = [];
  private show: boolean = false;
  private type: string = '请选择';

  // 获取反馈类型
  public created() {
    this.$axios
      .api('get_feedBack')
      .then((res: any) => {
        this.feedBackType = res;
      });
  }

  // 选择反馈类型
  public onSelect( item: any ) {
    this.show = false;
    this.type = item.name;
  }

  // 打开反馈弹窗
  public showPopup() {
    this.show = true;
  }

  public handleSubmit() {
    const contact: string = this.contact;
    const content: string = this.content;
    const type: string = this.type;
    const regNull = /^\s*$/;
    if (regNull.test(contact)) {
      Toast('请输入您的联系方式！');
      return;
    } else if (regNull.test(content)) {
      Toast('请输入您的建议！');
      return;
    } else if (type === '请选择') {
      Toast('请选择反馈类型！');
      return;
    }
    this.$axios
      .api('user_feedBack', {
        data: {
          contact,
          content,
          type,
        },
      })
      .then((res: any) => {
        if (!res.status) {
          Toast(res.msg);
        } else {
          Toast('提交成功');
        }
      });
  }
}
</script>
<style lang="scss" scoped>
  .head {
    .title {
      height: 35px;
      padding: 10px;
      background: #3498db;
      color: #fff;

      .game-logo-y {
        font-size: 50px;
      }
    }

    .notice {
      padding: 8px 10px;
      background: #fff;
      font-size: 12px;
      color: #999;
    }
  }

  .content{
    padding: 10px;
    margin: 8px 5px;
    background: #fff;
    border-radius: 5px;

    .span {
      color: #666;
    }

    .game-arrow-right {
      float: right;
      color: #666;
    }

    .row {
      &:last-child {
        margin-top: 20px;
      }

      input {
        height: 25px;
        border: 1px solid #b8b8b8;
        border-radius: 5px;
      }

      textarea {
        display: block;
        width: 100%;
        height: 100px;
        border: 1px solid #b8b8b8;
        margin-top: 10px;
        border-radius: 5px;
      }
    }
  }
  .van-button {
    position: fixed;
    bottom: 10%;
    left: 50%;
    width: 80%;
    transform: translateX(-50%);
  }
</style>
