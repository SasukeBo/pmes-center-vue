<template>
  <div class="top-yield-material-chart">
    <div class="top-yield-material-chart__title">最近一周前20不良料号</div>
    <div class="top-yield-material-chart__mount" ref="chart"></div>
  </div>
</template>
<script>
import echarts from 'echarts'

export default {
  name: 'TopYieldMaterialChart',
  data() {
    return {
      chart: undefined
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
  }
}
</script>
<style lang="scss">
.top-yield-material-chart {
  height: 400px;
  width: 100%;

  .top-yield-material-chart__title {
    line-height: 16px;
    padding: 16px 0;
    font-size: 16px;
    font-weight: bold;
    color: #666;
  }

  .top-yield-material-chart__mount {
    height: calc(100% - 48px);
    background: #fff;
    border-radius: 4px;
  }
}
</style>
