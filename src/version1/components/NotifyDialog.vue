<template>
  <el-dialog :visible="visible" width="320px" custom-class="notify-dialog">
    <img class="banner" src="~@/assets/notify-dialog@2x.png" />
    <div class="content">抱歉，此操作需要登录</div>
    <div class="confirm-btn">
      <el-button type="primary" size="small" @click="confirm">确 定</el-button>
    </div>
    <div class="cancel-btn">
      <img
        class="btn-icon"
        src="~@/assets/pi-quxiao@2x.png"
        @click="$emit('update:visible', false)"
      />
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ['visible'],
  methods: {
    confirm() {
      this.$emit('confirm')
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss">
.theme_1-app .notify-dialog {
  border: none;
  border-radius: 4px;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
    text-align: center;

    .cancel-btn {
      position: absolute;
      left: 0;
      right: 0;

      .btn-icon {
        display: block;
        margin: auto;
        width: 24px;
        cursor: pointer;
        margin-top: 32px;
      }
    }

    img.banner {
      display: block;
      width: 100%;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    .content {
      color: #666;
      font-size: 16px;
      font-weight: bold;
      line-height: 16px;
      padding: 16px 0;
    }

    .confirm-btn {
      padding: 0 32px;

      .el-button {
        width: 100%;
        border: none;
        background: #5e83f2;
        box-shadow: 0px 3px 6px rgba(94, 131, 242, 0.5);
        margin-bottom: 56px;
      }
    }
  }
}
</style>
