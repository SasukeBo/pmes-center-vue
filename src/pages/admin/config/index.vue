<template>
  <div class="admin-system-config">
    <el-row :gutter="28">
      <el-col :span="4">
        <div
          class="link-card"
          @click="$router.push({ name: 'admin-barcode-rule' })"
        >
          <span class="white-block"></span>
          <img
            class="link-icon"
            src="~@//assets/images/decode-rule.png"
          />
          <span class="link-text">编码规则</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminSystemConfig'
}
</script>
<style lang="scss">
.admin-entry .admin-system-config {
  height: 100%;
  box-sizing: border-box;
  padding: 32px;

  .link-card {
    min-width: 250px;
    margin-bottom: 24px;
    height: 120px;
    background: linear-gradient(
      212deg,
      rgba(106, 170, 255, 1) 0%,
      rgba(135, 101, 251, 1) 100%
    );
    border-radius: 35px;
    box-shadow: 0px 3px 36px rgba(115, 161, 252, 1);
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      opacity: 0.7;
      box-shadow: 0px 3px 36px rgba(115, 161, 252, 0.7);
    }

    .white-block {
      width: 44px;
      height: 44px;
      background: #fff;
      border-radius: 10px;
      margin-left: 32px;
    }

    .link-icon {
      position: absolute;
      left: 42px;
      top: 42px;
    }

    .link-text {
      padding-left: 32px;
      font-size: 24px;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
