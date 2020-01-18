<template>
  <ul class="yh-gui-home-aside home-aside-top-bottom">
    <li data-click="click" class="yh-gui-home-aside email" @click="$emit('asideClick', 'email')"></li>
    <li data-click="click" class="yh-gui-home-aside friends"></li>
    <li data-click="click" class="yh-gui-home-aside backpack"></li>
    <li data-click="click" class="yh-gui-home-aside record"></li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class NavigationIndex extends Vue {
  
}
</script>

<style scoped lang="scss">
  .home-aside-top-bottom {
    position: absolute;
    display: flex;
    right: .5em;
    bottom: 0;
    width: 22.6em;
    height: 5.3em;
    background-size: 22.5em;
    justify-content: space-around;
    align-items: center;
    zoom: .9;

    li {
      width: 3.8em;
      height: 5em;
      background-position: 0 -6em;
      zoom: .8;
      
      &:active {
        filter: brightness(1);
        transform: scale(1.2);
      }
    }

    .email {
      background-position-x: -.1em;
    }

    .friends {
      width: 3.7em;
      background-position-x: -3.795em;
    }

    .backpack {
      width: 3.1em;
      background-position-x: -7.5em;
    }

    .record {
      background-position-x: -10.5em;
    }
    
  }
</style>
