<template>
  <div id="app">
    <div class="a-header">
      <div class="a-header__inner">普创智控生产数据中心</div>
    </div>
    <div class="a-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">料号管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-body">
      <router-view></router-view>
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
  padding-top: 120px;
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
  font-size: 22px;
  padding: 0 60px;
  box-sizing: border-box;
  text-align: left;
}

.a-header .a-header__inner {
  max-width: 1000px;
  margin: auto;
}

#app .a-breadcrumb {
  position: fixed;
  top: 60px;
  width: 100%;
  z-index: 1000;
  background: #fff;

  .el-breadcrumb {
    max-width: 1000px;
    margin: auto;
    height: 60px;
    font-size: 18px;
    line-height: 60px;
  }
}

.page-body {
  max-width: 1000px;
  margin: auto;
  padding-top: 16px;
}
</style>
