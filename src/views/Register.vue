<template>
  <user-account title="快速登陆注册"  handle="register"/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import userAccount from '@/components/userAccount.vue';

@Component({
  components: {
    userAccount,
  },
})
export default class Register extends Vue {
}
</script>
<style lang="scss" scoped>
</style>
