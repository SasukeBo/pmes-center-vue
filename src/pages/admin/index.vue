<template>
  <div class="admin-entry">
    <AdminMenu></AdminMenu>
    <div class="admin-main">
      <div class="admin-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="r in $route.matched"
            :key="r.name"
            :to="{ name: r.name }"
          >
            {{ r.meta.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>

        <div class="login-entry">
          <span v-if="currentUser" class="user-account" @click="logout">
            <i class="el-icon-user-solid" style="padding-right: 4px"></i>
            <span>{{ currentUser.name || currentUser.account }}</span>
          </span>

          <el-button
            v-if="!currentUser"
            size="small"
            type="text"
            icon="el-icon-user-solid"
            @click="$store.commit('SET_LOGIN_DIALOG_VISIBLE', true)"
            >登录</el-button
          >
        </div>
      </div>

      <div class="page-body">
        <div class="page-title">
          <img src="~@//assets/images/title-bg.png" />
          <div class="page-title__context">
            {{ pageTitle || $route.meta.name }}
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import AdminMenu from '@//pages/admin/components/AdminMenu.vue'
import { mapState } from 'vuex'
export default {
  name: 'AdminPageRoot',
  components: {
    AdminMenu
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.currentUser,
      pageTitle: (state) => state.pageTitle
    })
  },
  data() {
    return {}
  },
  methods: {
    logout() {
      this.$confirm('确定退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          var _this = this
          var req = new XMLHttpRequest()
          req.open('GET', '/auth/logout')
          req.onreadystatechange = function() {
            if (req.readyState === 4) {
              if (req.status >= 200 && req.status < 400) {
                var res = JSON.parse(req.responseText || '')
                if (res.errors) {
                  _this.$GraphQLError(res.errors[0])
                } else {
                  _this.$message({ type: 'success', message: '退出登录成功' })
                  _this.$store.commit('LOGIN', undefined)
                  _this.$router.push({ path: '/' })
                }
              } else {
                _this.$message({ type: 'error', message: req.statusText })
              }
            }
          }
          req.send()
        })
        .catch(() => undefined)
    }
  },
  created() {
    document.title = '数据中心 - 后台管理'
    var _this = this
    this.$store
      .dispatch('fetchCurrentUser', _this)
      .then(({ data: { response } }) => {
        _this.$store.commit('LOGIN', response)
      })
      .catch((e) => _this.$GraphQLError(e))
  }
}
</script>
<style lang="scss">
.admin-entry {
  overflow: hidden;
  height: 100%;
  display: flex;
  background: #f3f4f4;

  .el-button--primary {
    background-color: #5e83f2;
    border-color: #5e83f2;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(94, 131, 242, 0.7);
      border-color: rgba(94, 131, 242, 0.7);
    }
  }

  .admin-main {
    flex: 1;
    overflow: hidden;

    .admin-header {
      display: flex;
      align-items: center;
      padding: 16px 32px;
      padding-right: 64px;

      .login-entry {
        min-width: 100px;
        text-align: center;

        .user-account {
          color: #666;
          height: 100%;
          margin: 0;
          cursor: pointer;
          transition: color 0.3s ease;
          width: 100%;
          display: inline-block;
          text-align: right;

          &:hover {
            color: #999;
          }
        }
      }

      .el-breadcrumb {
        line-height: 13px;
        flex: auto;

        .el-breadcrumb__item:last-child .el-breadcrumb__inner {
          color: #5e83f2;
        }

        .el-breadcrumb__inner,
        .el-breadcrumb__separator {
          color: #999;
          font-size: 12px;
          font-weight: normal;
        }
      }
    }

    .page-body {
      position: relative;
      margin: 64px 28px 28px;
      height: calc(100% - 156px);
      box-sizing: border-box;
      background: rgba(255, 255, 255, 1);
      border-radius: 0px 32px 32px 32px;

      .page-title {
        position: absolute;
        top: -64px;

        .page-title__context {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          position: absolute;
          width: 233px;
          text-align: center;
          left: 0;
          top: 0;
          padding: 22px 16px;
          box-sizing: border-box;
          color: #6a6a6a;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
