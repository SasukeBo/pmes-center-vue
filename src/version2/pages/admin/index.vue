<template>
  <div class="admin-entry">
    <AdminMenu></AdminMenu>
    <div class="admin-main">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import AdminMenu from '@/version2/components/AdminMenu.vue'
export default {
  components: {
    AdminMenu
  }
}
</script>
<style lang="scss">
.admin-entry {
  height: 100%;
  background: #f3f4f4;
}
</style>
