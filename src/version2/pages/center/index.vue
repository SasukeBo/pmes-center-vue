<template>
  <div class="theme_1-app">
    <div class="app-header">
      <div class="app-header__inner">
        <img
          src="~@/assets/fortunta-logo.png"
          class="company-logo"
          @click="$router.push({ path: '/' })"
        />
      </div>
    </div>

    <div class="app-body">
      <router-view></router-view>
      <div class="go-back-btn" @click="$router.go(-1)">
        <div class="btn_content">
          <i class="el-icon-back"></i><span>返回</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleDropdown(command) {
      switch (command) {
        case 'toConsole':
          this.toConsole()
          break
        case 'logout':
          this.logout()
          break
      }
    },
    toConsole() {
      this.$router.push({ name: 'console' })
    }
  }
}
</script>
<style lang="scss">
html {
  background: #ececef;
  font-family: source-han-sans-simplified-c, sans-serif;
}

.theme_1-app {
  position: relative;

  .el-button.el-button--primary {
    background: #5e83f2;
    transition: background 0.3s ease;

    &:hover {
      background: rgba(94, 131, 242, 0.7);
    }
  }

  .app-header {
    z-index: 2000;
    height: 64px;
    background: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    box-sizing: border-box;
    position: fixed;
    width: 100%;
    top: 0;

    .app-header__inner {
      max-width: 1200px;
      margin: auto;
    }

    .company-logo {
      width: 45px;
      height: 48px;
      margin: 8px 0;
      display: inline-block;
      cursor: pointer;
    }
  }

  .app-body {
    max-width: 1200px;
    margin: auto;
    padding-top: 64px;
    position: relative;

    .go-back-btn {
      position: fixed;
      border-radius: 9px;
      background: #5e82f2;
      width: 80px;
      height: 40px;
      display: flex;
      align-items: center;
      bottom: 20px;
      right: 20px;
      text-align: center;
      cursor: pointer;
      box-shadow: 0px 0px 13px rgba(0, 0, 0, 0.5);
      font-size: 14px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(94, 130, 242, 0.8);
      }

      .btn_content {
        flex: auto;
        color: #fff;
      }
    }
  }
}

@media only screen and (max-width: 1200px) {
  .theme_1-app .app-header .app-header__inner {
    margin: 0 24px;
  }

  .theme_1-app .app-body {
    margin: 0 24px;
  }
}
</style>
