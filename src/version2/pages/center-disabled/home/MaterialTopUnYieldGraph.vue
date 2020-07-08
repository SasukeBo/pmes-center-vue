<template>
  <div class="material-top-unyield-graph">
    <div class="graph-mount" ref="chart"></div>
    <div class="graph-triangle"></div>
  </div>
</template>
<script>
import echarts from 'echarts'

export default {
  name: 'MaterialTopUnYieldGraph',
  data() {
    return {
      chart: undefined
    }
  },
  methods: {
    assembleTitle() {
      return {
        text: '尺寸不良率·Top20',
        textStyle: {
          color: '#e0e1e3',
          fontSize: 18,
          fontWeight: 800
        },
        top: -5,
        left: 12
      }
    },
    assembleXAxis() {
      var data = []
      for (var i = 0; i < 20; i++) {
        data.push('FAI20(A1/D3)')
      }

      return {
        data,
        axisLine: { lineStyle: { color: '#a0a3a8' } },
        axisLabel: { rotate: 55 },
        type: 'category'
      }
    },
    assembleYAxis() {
      return {
        max: 100,
        type: 'value',
        position: 'right',
        axisLine: { show: false },
        axisLabel: {
          inside: true,
          color: '#A0A3A8',
          margin: 0,
          padding: [0, 0, 20, 0],
          formatter(value) {
            if (value === 100) {
              return '100 (%)'
            }
            return value
          }
        },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#3BE3ED', opacity: 0.1 } }
      }
    },
    assembleSeries() {
      var data = []
      for (var i = 0; i < 20; i++) {
        data.unshift((i + 1) * 5)
      }

      return [
        {
          data,
          type: 'bar',
          label: {
            show: true,
            color: '#a0a3a8',
            fontSize: 14,
            position: 'top',
            formatter: '{c}%'
          },
          name: '料号不良率',
          barMaxWidth: 24,
          itemStyle: {
            normal: {
              barBorderRadius: [2, 2, 0, 0],
              color: {
                image: undefined,
                repeat: 'repeat'
              }
            }
          }
        }
      ]
    },
    assembleGrid() {
      return {
        top: 48,
        left: 12,
        right: 0,
        bottom: 80
      }
    },
    renderChart() {
      var option = {
        grid: this.assembleGrid(),
        title: this.assembleTitle(),
        xAxis: this.assembleXAxis(),
        yAxis: this.assembleYAxis(),
        series: this.assembleSeries()
      }

      this.chart.clear()
      this.chart.setOption(option)
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.renderChart()
  }
}
</script>
<style lang="scss">
.material-top-unyield-graph {
  position: relative;

  .graph-triangle {
    position: absolute;
    top: 0;
    left: 0;
    width: 12px;
    height: 12px;
    box-sizing: border-box;
    border-left: 4px solid rgba(59, 227, 236, 1);
    border-top: 4px solid rgba(59, 227, 236, 1);
  }

  .graph-mount {
    height: 380px;
    width: 100%;
  }
}
</style>
