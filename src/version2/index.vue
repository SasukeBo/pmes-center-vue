<template>
  <div class="index">
    <router-view></router-view>
  </div>
</template>
<script>
import Vue from 'vue'
import GraphQLError from './utils/graphql_error'
Vue.prototype.$GraphQLError = GraphQLError
export default {
  created() {
    var _this = this
    this.$store
      .dispatch('fetchCurrentUser', _this)
      .then(({ data: { response } }) => {
        _this.$store.commit('LOGIN', response)
      })
      .catch((e) => console.log(e))
  }
}
</script>
<style lang="scss">
html {
  background: #ececef;
  font-family: source-han-sans-simplified-c, sans-serif;
}

.index {
  height: 100%;
}
</style>
