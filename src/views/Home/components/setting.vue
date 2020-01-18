<template>
  <div>
    设置区域暂不开放
    <slider />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import slider from '@/components/slider.vue';

@Component({
  components: {
    slider,
  },
})
export default class HomeSetting extends Vue {
  private created() {
    console.log(123465);
  }
}
</script>

<style scoped lang="scss">
  
</style>
