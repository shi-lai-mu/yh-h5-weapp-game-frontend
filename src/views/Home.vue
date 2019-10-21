<template>
  <div class="home">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
  },
})
export default class Home extends Vue {
  public created() {
    console.log(this);
  }
}
</script>
