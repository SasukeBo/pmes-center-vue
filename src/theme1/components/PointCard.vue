<template>
  <div class="point-card">
    <div class="data-block"></div>
    <div class="analyze-chart"></div>
  </div>
</template>
<script>
export default {
  name: 'PointCard'
}
</script>
<style lang="scss">
.theme_1-app .point-card {
  background: rgba(255, 255, 255, 0.8);
  width: 100%;
  height: 490px;
  margin-bottom: 16px;
  border-radius: 4px;
  display: flex;

  .data-block {
    flex: 1;
  }

  .analyze-chart {
    flex: 3;
  }
}
</style>
