<template>
  <div class="yh-gui-channel channel-box">
    <div class="yh-gui-title yh-gui-template">
      <div class="yh-gui-channel channel-title"></div>
    </div>
    <div class="yh-gui-channel channel-room-type">
      <div class="yh-gui-channel channel-button left-button">
        <div class="yh-gui-channel room-tag"></div>
      </div>
      <div class="yh-gui-channel channel-button right-button blur">
        <div class="yh-gui-channel world-tag"></div>
      </div>
    </div>
    <div class="channel-join-type">
      <div class="yh-gui-channel join-button" data-click="click">
        <span class="yh-gui-channel text-tag btn-icon join-icon"></span>
        <span class="yh-gui-channel text-tag btn-text join-room"></span>
      </div>
      <div class="yh-gui-channel join-button" data-click="click">
        <span class="yh-gui-channel text-tag btn-icon create-icon"></span>
        <span class="yh-gui-channel text-tag btn-text create-room"></span>
      </div>
      <div class="yh-gui-channel join-button" data-click="click">
        <span class="yh-gui-channel text-tag btn-icon random-icon"></span>
        <span class="yh-gui-channel text-tag btn-text random-room"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Channel extends Vue {}
</script>

<style scoped lang="scss">
  .channel-box {
    position: absolute;
    top: 15%;
    left: 3.5em;
    height: 19.5em;
    width: 16em;
    background-size: auto 100%;

    .yh-gui-channel {
      background-size: 445px;
    }

    .channel-title {
      width: 3em;
      height: 1.5em;
      margin-top: -.3em;
      background-position: -21.2em -10.2em;
    }

    .channel-room-type {
      width: 11em;
      height: 1.9em;
      margin: 5px auto;
      background-position: -15.5em -3.8em;

      .channel-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        transition: .5s;

        &:active {
          filter: brightness(1.1);
        }
      }

      .left-button {
        width: 5.3em;
        height: 1.9em;
        background-position: -21.1em -6em;
      }

      .right-button {
        width: 5.5em;
        height: 1.9em;
        background-position: -15.5em -6em;
      }

      .room-tag {
        width: 2em;
        height: .9em;
        background-position: -20.9em -12em;
        pointer-events: none;
      }

      .world-tag {
        width: 2em;
        height: .9em;
        background-position: -24.3em -10.1em;
        pointer-events: none;
      }

      .blur {
        filter: grayscale(1);
      }
    }

    .channel-join-type {
      width: 13em;
      height: 14em;
      margin: 0 auto;

      .join-button {
        position: relative;
        display: flex;
        width: 12em;
        height: 3.4em;
        margin: 0 auto;
        background-position: -15.5em 0;
        justify-content: center;
        align-items: center;

        &:active {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      }

      .text-tag {
        display: inline-block;
        pointer-events: none;
      }

      .btn-icon {
        position: absolute;
        left: -.5em;
        width: 2.4em;
        height: 2.4em;
      }

      .btn-text {
        width: 5.4em;
        height: 1.5em;
      }

      .join-room { background-position: -15.5em -10.1em; }
      .join-icon { background-position: -15.6em -12em; }

      .create-room { background-position: -21.3em -8.2em; }
      .create-icon { background-position: -15.6em -14.6em; }

      .random-room { background-position: -15.5em -8.2em }
      .random-icon { background-position: -18.3em -12em; }
    }
  }
</style>
