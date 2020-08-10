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
  components: { LoginDialog },
  created() {
    this.checkLogin()
  },
  watch: {
    '$route.name': function() {
      this.checkLogin()
    }
  },
  methods: {
    checkLogin() {
      var _this = this
      this.$store
        .dispatch('fetchCurrentUser', _this)
        .then(({ data: { response } }) => {
          _this.$store.commit('LOGIN', response)
        })
        .catch((e) => {
          if (_this.$route.name !== 'login-page') {
            _this.$GraphQLError(e)
            _this.$router.push({
              name: 'login-page',
              query: {
                returnTo: _this.$route.name,
                params: _this.$route.params
              }
            })
          }
        })
    }
  }
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
