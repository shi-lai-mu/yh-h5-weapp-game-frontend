<template>
  <div class="btn" :style="'bottom:' + bottom + '%;'" data-click="click">
    <div class="sik" data-click="click"></div>
    <i :class="'game game-' + iconClass" data-click="click"></i>
    <span class="icon-name" data-click="click">{{ iconName }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class HandleBtn extends Vue {
  @Prop(String) private iconName!: string;
  @Prop(String) private iconClass!: string;
  @Prop(String) private bottom!: string;
}
</script>

<style lang="scss">
  .btn {
    position: absolute;
    width: 2.4rem;
    height: 2.4rem;
    background-image: radial-gradient(circle, rgba(97, 107, 102, .5), rgba(85, 105, 121, .5));
    border: 1px solid #FBF4E5;
    text-align: center;
    border-radius: 50%;

    .sik {
      position: absolute;
      top: .4em;
      left: .5em;
      width: 4px;
      height: 6px;
      background: #FCFEFF;
      border-radius: 50%;
      transform: rotate(45deg);
    }

    .game{
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 24px;
      color: #FBF1DE;
      transform: translate(-50%, -50%);
    }

    .icon-name {
      position: absolute;
      bottom: -20%;
      left: 0;
      width: 36px;
      color: #FBF1DE;
    }
  }
</style>