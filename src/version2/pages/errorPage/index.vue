<template>
  <div class="error-page">
    <div class="error-page__body">
      <div class="error-code">404</div>
      <div>对不起，您访问的页面不存在！</div>
    </div>
  </div>
</template>
<style lang="scss">
.error-page {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 32px;
  font-size: 20px;
  color: #666;

  .error-code {
    font-weight: bolder;
    color: #333;
    font-size: 30px;
  }

  .error-page__body {
    flex: 1;
  }
}
</style>
