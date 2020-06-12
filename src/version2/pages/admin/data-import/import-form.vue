<template>
  <div class="console-import-data__import-form">
    <div class="import-form__header">
      添加文件
    </div>

    <div class="import-form__body"></div>
    <div class="import-form__footer">
      <FButton size="small" @click="cancel" type="plain">取消</FButton>
      <FButton size="small" @click="save">保存</FButton>
    </div>
  </div>
</template>
<script>
import FButton from '@/version2/components/FButton.vue'
export default {
  components: { FButton },
  methods: {
    save() {},
    cancel() {}
  }
}
</script>
<style lang="scss">
.console-import-data__import-form {
  height: 100%;

  .import-form__body {
    height: calc(100% - 128px);
  }

  .import-form__header {
    height: 64px;
    line-height: 64px;
    box-sizing: border-box;
    margin: 0;
    padding: 0 24px;
    color: #6a6a6a;
    font-size: 20px;
    font-weight: bold;
    background: #f3f4f4;
  }

  .import-form__footer {
    height: 64px;
    line-height: 64px;
    box-sizing: border-box;
    text-align: center;
    border-top: 1px solid #cacaca;

    .el-button {
      width: 88px;
      margin: 0 16px;
    }
  }
}
</style>
