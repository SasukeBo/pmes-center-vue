<template>
  <div class="app">
    <router-view></router-view>

    <LoginDialog></LoginDialog>
  </div>
</template>
<script>
import Vue from 'vue'
import GraphQLError from './utils/graphql_error'
import LoginDialog from '@//components/LoginDialog.vue'
Vue.prototype.$GraphQLError = GraphQLError
export default {
  name: 'App',
  components: { LoginDialog }
}
</script>
<style lang="scss">
html {
  background: #ececef;
  font-family: source-han-sans-simplified-c, sans-serif;
}

.app {
  height: 100%;
}
</style>
