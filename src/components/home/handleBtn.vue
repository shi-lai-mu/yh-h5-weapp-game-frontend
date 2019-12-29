<template>
  <div class="btn" :style="'bottom:' + bottom + '%;'" data-click="click">
    <i :class="'game game-' + iconClass"></i>
    <span class="icon-name" v-text="iconName"></span>
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

<style scoped lang="scss">
  .btn {
    position: absolute;
    width: 2.4rem;
    height: 2.4rem;
    background-image: radial-gradient(circle, rgba(85, 105, 121, .5), rgba($color: #FBF4E5, $alpha: .5));
    border: 1px solid #FBF4E5;
    text-align: center;
    border-radius: 50%;
    user-select: none;

    &::after {
      position: absolute;
      top: .4em;
      left: .5em;
      width: 4px;
      height: 6px;
      background-color: #FCFEFF;
      border-radius: 50%;
      transform: rotate(45deg);
      content: '';
    }

    .game {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 24px;
      color: #FBF1DE;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .icon-name {
      position: absolute;
      bottom: -30%;
      left: 0;
      width: 36px;
      font-size: .9em;
      font-weight: bold;
      color: #FBF1DE;
      -webkit-text-stroke-color: #644605;
      -webkit-text-stroke-width: .4px;
      pointer-events: none;
    }

    &:active {
      transform: scale(1.1);
    }
  }
</style>