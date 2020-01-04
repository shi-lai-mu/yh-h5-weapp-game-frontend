<template>
  <div>
    123456
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class GameLayout extends Vue {}
</script>
