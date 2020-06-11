<template>
  <div class="index">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  created() {
    var _this = this
    this.$store
      .dispatch('fetchCurrentUser', _this)
      .then(({ data: { response } }) => {
        _this.$store.commit('LOGIN', response)
      })
      .catch((e) => {
        _this.$message({ type: 'error', message: e.message })
      })
  }
}
</script>
<style lang="scss">
* {
  box-sizing: border-box;
}

html {
  background: #ececef;
  font-family: source-han-sans-simplified-c, sans-serif;
}

.index {
  height: 100%;
}
</style>
