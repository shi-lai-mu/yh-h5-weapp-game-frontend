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
      <div>
        <span>联系方式（必填）</span>
        <input type="tel">
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Feedback extends Vue {

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
      font-size: 14px;
      color: #999;
    }
  }
</style>
