<template>
  <div class="admin-menu">
    <div class="logo-link">
      <img src="~@/version2/assets/images/logo.png" />
    </div>

    <div class="tab-btns">
      <div class="tab-item is-active"></div>

      <div class="tab-item"></div>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss">
.admin-menu {
  text-align: center;
  height: 100%;
  width: 180px;
  padding-right: 45px;
  box-sizing: border-box;
  padding-top: 16px;

  .logo-link {
    padding: 6px;

    img {
      width: 112px;
      height: 112px;
    }
  }

  .tab-btns .tab-item {
    width: 100%;
    height: 210px;

    &.is-active {
      background: inear-gradient(
        218deg,
        rgba(63, 227, 211, 1) 0%,
        rgba(94, 131, 242, 1) 100%
      );
      box-shadow: 0px 3px 30px rgba(94, 131, 242, 0.27);
    }
  }
}
</style>
