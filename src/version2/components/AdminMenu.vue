<template>
  <div class="admin-menu">
    <div class="logo-link">
      <img src="~@/version2/assets/images/logo.png" />
    </div>

    <div class="tab-btns">
      <div
        :class="['tab-item', isActive('console-materials') ? 'is-active' : '']"
        @click="$router.push({ name: 'console-materials' })"
      >
        <img
          :src="isActive('console-materials') ? activeItemBg : normalItemBg"
          class="bg-img"
        />
        <div class="btn-content">
          <img
            class="manage-icon"
            src="~@/version2/assets/images/material-manage.png"
          />
          <div class="manage-label">料号管理</div>
        </div>
      </div>

      <div
        :class="['tab-item', isActive('console-devices') ? 'is-active' : '']"
        @click="$router.push({ name: 'console-devices' })"
      >
        <img
          class="bg-img"
          :src="isActive('console-devices') ? activeItemBg : normalItemBg"
        />
        <div class="btn-content">
          <img
            class="manage-icon"
            src="~@/version2/assets/images/device-manage.png"
          />
          <div class="manage-label">设备管理</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import activeItemBg from '@/version2/assets/images/menu-item-active.png'
import normalItemBg from '@/version2/assets/images/menu-item-normal.png'

export default {
  data() {
    return {
      activeItemBg,
      normalItemBg,
      activeIndex: 0
    }
  },
  methods: {
    isActive(name) {
      return this.$route.matched.findIndex((m) => m.name === name) !== -1
    }
  }
}
</script>
<style lang="scss">
.admin-menu {
  text-align: center;
  height: 100%;
  width: 160px;
  box-sizing: border-box;
  padding-top: 16px;

  .logo-link {
    padding: 6px;
    margin-bottom: 8px;

    img {
      width: 112px;
      height: 112px;
      margin-right: 45px;
    }
  }

  .tab-btns {
    margin-top: 28px;
  }

  .tab-btns .tab-item {
    width: 100%;
    height: 153px;
    position: relative;
    cursor: pointer;

    .bg-img {
      position: relative;
      left: -45px;
      top: -71px;
    }

    .btn-content {
      width: 124px;
      height: 153px;
      padding: 28px 18px;
      box-sizing: border-box;
      position: absolute;
      z-index: 1000;
      top: 0;

      .manage-icon {
        width: 88px;
        height: 80px;
      }

      .manage-label {
        color: #666;
        font-size: 12px;
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 36px;
      }
    }

    &.is-active {
      .bg-img {
        z-index: 100;
      }

      .manage-label {
        color: #fff;
      }
    }
  }
}
</style>
