<template>
  <div class="popup" v-show="popupShow">
    
    <div class="popup-content vertical-horizontal-center">
      <i class="game game-solid-close" data-click="click" @click="hiddenPopup"></i>

      <div class="popup-title">
        <span class="title">{{ title }}</span>
      </div>

      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Popup extends Vue {
  public popupShow: boolean = false;

  @Prop(String) private title!: string;

  // 关闭弹框
  public hiddenPopup() {
    this.popupShow = false;
  }
}
</script>
<style lang="scss" scoped>
  .popup-content {
    position: absolute;
    z-index: 1000;
    width: 70%;
    height: auto;
    padding: 8px;
    background-color: rgba($color: #fff, $alpha: .4);
    border-radius: 5px;

    .popup-title {
      height: 40px;
      font-size: 19px;
      font-weight: bold;
      color: #FFF4D6;
      text-align: center;
      
      .title {
        text-shadow: 0px 0px 5px #A56C49;
      }
    }

    .content {
      height: 200px;
      background-color: #FFF4D6;
      border-radius: 5px;
    }
  }
</style>