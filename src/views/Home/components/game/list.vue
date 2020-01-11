<template>
  <div class="yh-gui-home-game-list home-game-ist">
    <div class="console-box">
      <span class="yh-gui-template console-arrow console-prev"></span>
      <span class="yh-gui-template console-arrow console-next"></span>
      <ul class="page-box">
        <li class="yh-gui-public page-number focus"></li>
        <li class="yh-gui-public page-number"></li>
        <li class="yh-gui-public page-number"></li>
        <li class="yh-gui-public page-number"></li>
      </ul>
    </div>
    <ul class="game-list">
      <li class="yh-gui-home-game-list">
        <span class="yh-gui-home-game-list game-icon icon-xxl" data-click="click"></span>
      </li>
      <li class="yh-gui-home-game-list">
        <span class="yh-gui-home-game-list game-icon icon-ddz lock" data-click="click"></span>
      </li>
      <li class="yh-gui-home-game-list">
        <span class="yh-gui-home-game-list game-icon icon-tcs" data-click="click"></span>
      </li>
      <li class="yh-gui-home-game-list"></li>
      <li class="yh-gui-home-game-list">
        <span class="yh-gui-home-game-list game-icon icon-wzq" data-click="click"></span>
      </li>
      <li class="yh-gui-home-game-list"></li>
      <li class="yh-gui-home-game-list">
        <span class="yh-gui-home-game-list game-icon icon-fxq" data-click="click"></span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HomeGameList extends Vue  {
  
}
</script>

<style scoped lang="scss">
  .home-game-ist {
    position: absolute;
    top: 15%;
    right: 1%;
    width: 22.6em;
    height: 13.5em;

    .game-list {
      height: 100%;
      padding: 1em;
      text-align: center;
      columns: 4;

      li {
        display: inline-block;
        width: 4.1em;
        height: 4.1em;
        margin-bottom: 1.2em;
        background-size: 33em;
        background-position: -29em 0;

        &:active {
          filter: brightness(1.1);
          transform: scale(1.05);
        }
      }

      .game-icon {
        position: relative;
        display: block;
        width: 3.4em;
        height: 3.6em;
        margin: .15em auto;
        background-size: 32.5em;

        &::after {
          position: absolute;
          z-index: 10;
          bottom: 0;
          left: 0;
          width: 3.8em;
          height: 1.3em;
          background: inherit;
          transform: translate(-5%, 120%);
          content: '';
        }

        &.lock {
          filter: grayscale(1);
        }
      }

      /**
       *   游戏列表
       */
      .icon-xxl {
        background-position: 0 -16.9em;
        &::after { background-position: -28.5em -5.7em; }
      }

      .icon-ddz {
        background-position: -3.6em -16.9em;
        &::after { background-position: -28.5em -7em; }
      }

      .icon-tcs {
        background-position: -7.2em -16.9em;
        &::after { background-position: -28.5em -4.5em; }
      }

      .icon-fxq {
        background-position: -14.3em -16.9em;
        &::after { background-position: -28.5em -4.5em; }
      }

      .icon-wzq {
        background-position: -10.79em -16.9em;
        &::after { background-position: -28.5em -9.9em; }
      }
    }

    .console-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      .console-arrow {
        position: absolute;
        width: 1.3em;
        height: 1.1em;
        margin: auto;
        background-size: 30em;
        filter: grayscale(1);
      }

      .console-prev {
        top: 0;
        left: 0;
        bottom: 0;
        background-position: -1.3em -13.35em;
        transform: translate(-30%, -30%) scale(1.5);

        &:active {
          filter: brightness(1.1);
          transform: translate(-30%, -30%) scale(1.6);
        }
      }

      .console-next {
        top: 0;
        right: 0;
        bottom: 0;
        background-position: 0 -13.35em;
        transform: translate(30%, -30%) scale(1.5);

        &:active {
          filter: brightness(1.1);
          transform: translate(30%, -30%) scale(1.6);
        }
      }

      .page-box {
        position: absolute;
        display: flex;
        right: 0;
        bottom: 0;
        left: 0;
        height: 1.8em;
        margin: auto;
        justify-content: center;
        align-items: center;
      }

      .page-number {
        width: 1em;
        height: 1em;
        background-position: -13.8em -.5em;

        &.focus {
          background-position-x: -13.1em;
        }
      }
    }
  }
</style>
