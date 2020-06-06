<template>
  <div class="theme_1-app">
    <div class="app-header">
      <div class="app-header__inner">
        <img
          src="~@/assets/fortunta-logo.png"
          class="company-logo"
          @click="$router.push({ path: '/' })"
        />
        <div
          v-if="$store.state.currentUser"
          class="float-right user-account"
          @click="logout"
        >
          <i class="el-icon-user-solid"></i>
          {{ $store.state.currentUser.account }}
        </div>
        <el-button
          v-if="!$store.state.currentUser"
          class="float-right"
          size="small"
          type="primary"
          @click="$store.commit('SET_LOGIN_DIALOG_VISIBLE', true)"
          >登录</el-button
        >
      </div>
    </div>

    <div class="app-body">
      <router-view></router-view>
    </div>

    <LoginDialog></LoginDialog>
  </div>
</template>
<script>
import LoginDialog from '@/version1/components/LoginDialog.vue'
import gql from 'graphql-tag'

export default {
  components: { LoginDialog },
  apollo: {
    currentUser: {
      query: gql`
        query {
          currentUser {
            id
            account
            admin
          }
        }
      `
    }
  },
  data() {
    return {
      currentUser: undefined
    }
  },
  watch: {
    currentUser(nv) {
      if (nv) {
        this.$store.commit('LOGIN', nv)
      }
    }
  },
  methods: {
    logout() {
      this.$confirm('确定退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation {
                logout
              }
            `
          })
          .then(() => {
            this.$message({ type: 'success', message: '退出登录成功' })
            this.$store.commit('LOGIN', undefined)
          })
          .catch((e) => {
            this.$message({
              type: 'error',
              message: e.message.replace('GraphQL error:', '')
            })
          })
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
    z-index: 1000;
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

    .float-right {
      float: right;
      margin: 16px 0px;
    }

    .user-account {
      float: right;
      height: 100%;
      line-height: 64px;
      margin: 0;
      padding: 0 8px;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: #999;
      }
    }
  }

  .app-body {
    max-width: 1200px;
    margin: auto;
    padding-top: 64px;
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
