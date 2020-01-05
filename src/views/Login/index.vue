<template>
  <router-view />
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class LoginView extends Vue {
  created() {
    console.log(111111111);
  }
}
</script>
