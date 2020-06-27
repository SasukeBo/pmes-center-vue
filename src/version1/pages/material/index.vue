<template>
  <div class="material-page">
    <div class="tab-panels-header">
      <el-tabs v-model="activePanel" @tab-click="handlePanelChange" stretch>
        <el-tab-pane label="料号总览" name="material-overview"></el-tab-pane>
        <el-tab-pane label="设备" name="material-device"></el-tab-pane>
        <el-tab-pane label="检测尺寸" name="material-size"></el-tab-pane>
      </el-tabs>
    </div>

    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'MaterialPage',
  props: {
    id: [Number, String]
  },
  data() {
    return {
      activePanel: 'material-overview'
    }
  },
  methods: {
    handlePanelChange(val) {
      this.$router.push({ name: val.name, params: { id: this.id } })
    }
  }
}
</script>
<style lang="scss">
.material-page {
  margin-bottom: 32px;

  .tab-panels-header {
    padding-top: 16px;

    .el-tabs .el-tabs__nav {
      background: #fff;
      border-radius: 4px;
    }
  }
}
</style>
