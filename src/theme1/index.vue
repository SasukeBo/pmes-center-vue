<template>
  <div class="theme_1-app">
    <div class="app-header">
      <img src="~@/assets/fortunta-logo.png" class="company-logo" />
    </div>

    <div class="app-body">
      <router-view></router-view>
    </div>
  </div>
</template>
<style lang="scss">
.theme_1-app {
  height: 100%;
  background: #ececef;
  overflow-y: auto;
  overflow-x: hidden;

  .app-header {
    z-index: 1000;
    height: 64px;
    background: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    padding: 0 360px;
    box-sizing: border-box;
    position: fixed;
    width: 100%;
    top: 0;

    .company-logo {
      width: 45px;
      height: 48px;
      margin: 8px 0;
      display: inline-block;
    }
  }

  .app-body {
    margin: 0 360px;
    padding-top: 64px;
  }
}
</style>
