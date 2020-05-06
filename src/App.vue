<template>
  <div id="app">
    <div class="a-header">
      <div class="a-header__inner">
        <span class="title">富诚达生产数据中心</span>
        <span class="header-link" @click="$router.push({ path: '/' })"
          >首页</span
        >
      </div>
    </div>
    <div class="page-body">
      <router-view class="height-fix"></router-view>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background: #fff;
  height: 100%;
  padding-top: 80px;
  box-sizing: border-box;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.a-header {
  position: fixed;
  z-index: 1000;
  top: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #222;
  color: #fff;
  box-sizing: border-box;
  text-align: left;
}

.a-header .a-header__inner {
  .title {
    font-size: 22px;
    margin: 0 32px;
    padding-right: 32px;
  }

  .header-link {
    cursor: pointer;
  }
}

.page-body {
  margin: 0 32px;
  padding-top: 16px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;

  .height-fix {
    height: 100%;
    overflow: hidden;
  }
}
</style>
