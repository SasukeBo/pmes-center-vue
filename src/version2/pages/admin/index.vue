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
      </div>

      <div class="page-body">
        <div class="page-title">
          <img src="~@/version2/assets/images/title-bg.png" />
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
import AdminMenu from '@/version2/pages/admin/components/AdminMenu.vue'
import { mapState } from 'vuex'
export default {
  components: {
    AdminMenu
  },
  computed: {
    ...mapState({
      pageTitle: (state) => state.pageTitle
    })
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss">
.admin-entry {
  overflow: hidden;
  height: 100%;
  display: flex;
  background: #f3f4f4;

  .admin-main {
    flex: 1;

    .el-breadcrumb {
      padding: 26px 32px;
      line-height: 13px;

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
        }
      }
    }
  }
}
</style>
