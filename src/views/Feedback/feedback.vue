<template>
  <div class="container">
    <div class="head">
      <div class="title flex-row">
        <icon name="arrow-left" @click="$router.go(-1)" />
        <i class="game game-logo-y"></i>
        <span>游惠小游戏</span>
      </div>
      <div class="notice">欢迎您给游惠小游戏提出任何建议，非常感谢！！！</div>
    </div>

    <CellGroup>
      <Field v-model="contact" label="联系方式"  placeholder="手机号或邮箱"/>
      <Field
        v-model="content"
        rows="1"
        autosize
        maxlength="200"
        label="建议描述"
        type="textarea"
        placeholder="请输入您的建议"
      />
    </CellGroup>

    <div class="content" @click="showPopup">
      <span class="span">反馈类型：{{ type }}</span>
      <i class="game game-arrow-right"></i>
      <ActionSheet v-model="show" :actions="feedBackType" @select="onSelect" />
    </div>

    <Button type="info" round @click="handleSubmit">提交</Button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Toast, Button, Field, ActionSheet, CellGroup, Icon } from 'vant';
import { ScreenInterface } from '@/interface/screen.interface';

@Component({
  components: {
    Button,
    ActionSheet,
    Field,
    CellGroup,
    Icon,
  },
})
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

  // 提交反馈
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
          window.history.go(-1);
        }
      });
  }
}
</script>
<style lang="scss" scoped>
  .container {
    position: fixed;
    width: 100%;
    height: 100%;
    transition: all 550ms ease-in-out;
  }
  .head {
    .title {
      background: #3498db;
      font-size: 17px;
      color: #fff;
      line-height: 55px;

      .van-icon-arrow-left {
        width: 50px;
        line-height: 55px;
        text-align: center;
        background-color: rgba($color: #fff, $alpha: .05);
      }

      .game-logo-y {
        font-size: 50px;
      }
    }

    .notice {
      padding: 8px 10px;
      background: #fff;
      font-size: 14px;
      color: #999;
    }
  }

  .content{
    display: flex;
    padding: 10px;
    margin: 8px 5px;
    background: #fff;
    border-radius: 5px;
    justify-content: space-between;
    align-items: center;

    .span {
      color: #666;
    }

    .game-arrow-right {
      color: #666;
    }

    .row {
      &:last-child {
        margin-top: 20px;
      }

      input {
        height: 25px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }

      textarea {
        display: block;
        width: 100%;
        height: 100px;
        padding: 5px;
        border: 1px solid #ccc;
        margin-top: 10px;
        border-radius: 5px;

        &::placeholder {
          color: #ddd;
        }
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
