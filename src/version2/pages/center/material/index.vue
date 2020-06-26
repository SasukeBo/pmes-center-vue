<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="概览" name="material-overview"></el-tab-pane>
      <el-tab-pane label="设备" name="material-device"></el-tab-pane>
      <el-tab-pane label="检测项" name="material-detect-item"></el-tab-pane>
    </el-tabs>

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
      activeName: 'material-overview'
    }
  },
  methods: {
    handleClick({ name }) {
      this.$router.push({ name, params: { id: this.id } })
    }
  },
  created() {
    this.activeName = this.$route.name
  }
}
</script>
