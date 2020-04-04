<template>
  <div class="material-card">
    <div ref="chart-mount" style="height: 300px"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'MaterialCard',
  props: {
    material: Object
  },
  data() {
    return {
      mychart: undefined,
      options: {}
    }
  },
  mounted() {
    this.mychart = echarts.init(this.$refs['chart-mount'])
    var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }

    // 使用刚指定的配置项和数据显示图表。
    this.mychart.setOption(option)
  }
}
</script>
<style lang="scss"></style>
