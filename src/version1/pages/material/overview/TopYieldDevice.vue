<template>
  <div
    class="top-yield-device-chart"
    v-loading="$apollo.queries.echartsResult.loading"
  >
    <div class="yield-chart-mount" ref="chart"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import gql from 'graphql-tag'

export default {
  name: 'TopYieldDevice',
  props: {
    id: [String, Number]
  },
  data() {
    return {
      echartsResult: {
        xAxisData: [],
        seriesData: {
          data: []
        }
      },
      yieldChart: undefined,
      yields: [],
      options: {
        tooltip: {
          show: true
        },
        color: ['#3FE3D3', '#5E83F2'],
        title: {
          text: '设备生产不良率',
          subtext: '不良率最高的前20个设备'
        },
        xAxis: {
          name: '设备',
          type: 'category',
          axisLabel: { interval: 0, rotate: -45 }
        },
        yAxis: [
          {
            name: '百分比',
            nameLocation: 'center',
            nameGap: 50,
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '设备生产不良率',
            barMaxWidth: 20
          }
        ]
      }
    }
  },
  apollo: {
    echartsResult: {
      query: gql`
        query($input: AnalyzeMaterialInput!) {
          echartsResult: groupAnalyzeMaterial(analyzeInput: $input) {
            xAxisData
            seriesData
          }
        }
      `,
      variables() {
        return {
          input: {
            materialID: this.id,
            xAxis: 'Device',
            yAxis: 'Yield',
            limit: 20
          }
        }
      }
    }
  },
  watch: {
    echartsResult(nv) {
      if (nv) {
        var values = nv.seriesData.data.map((item, i) => {
          var rate = ((1 - item) * 100).toFixed(2)
          if (i < 3) {
            return {
              value: rate,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#D92622' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#E04660' // 100% 处的颜色
                    }
                  ]
                }
              }
            }
          } else if (i < 8) {
            return {
              value: rate,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#FFB763' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#E04660' // 100% 处的颜色
                    }
                  ]
                }
              }
            }
          }

          return rate
        })
        this.options.tooltip.formatter = function(params) {
          return `
          <div>${params.name}</div>
          <div>${params.seriesName}：${params.value}%</div>
          `
        }
        this.options.xAxis.data = nv.xAxisData
        this.options.series[0].data = values
        this.yieldChart.setOption(this.options)
      }
    }
  },
  mounted() {
    this.yieldChart = echarts.init(this.$refs.chart)
  }
}
</script>
<style lang="scss">
.top-yield-device-chart {
  padding: 16px;
  background: #fff;
  margin-top: 32px;
  border-radius: 4px;

  .yield-chart-mount {
    height: 400px;
    width: 100%;
  }

  &.loading {
    height: 100px;

    .el-loading-mask {
      background: transparent;
    }
  }
}
</style>
