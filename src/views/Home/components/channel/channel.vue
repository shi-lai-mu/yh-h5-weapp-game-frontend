<template>
  <div class="yh-gui-channel channel-box">
    
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

    li {
      width: 100%;
      height: 80px;
      margin-bottom: 1vh;

      &:active {
        transform: scale(1.05);
      }
    }
  }
</style>
