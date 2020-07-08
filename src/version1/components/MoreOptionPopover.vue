<template>
  <div class="more-options">
    <el-popover placement="left" trigger="hover">
      <div class="operation-options">
        <el-button size="mini" type="text" @click="$emit('edit')"
          >编辑</el-button
        >
        <span> | </span>
        <el-button size="mini" type="text" @click="confirm">删除</el-button>
      </div>
      <el-button slot="reference" icon="el-icon-more" size="mini"></el-button>
    </el-popover>
  </div>
</template>
<script>
export default {
  methods: {
    confirm() {
      this.$confirm('确定删除此料号数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete')
      })
    }
  }
}
</script>
<style lang="scss">
.el-popover {
  min-width: 0 !important;
  padding: 0 5px !important;
}

.operation-options {
  color: #999;

  .el-button {
    color: #999;
  }
}

.theme_1-app .more-options {
  position: absolute;
  top: 22px;
  right: 16px;

  .el-button {
    border: none;
    background: #ececef;
    border-radius: 4px;
    width: 28px;
    height: 16px;
    padding: 0;
  }
}
</style>
