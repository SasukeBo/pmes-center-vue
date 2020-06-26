<template>
  <div class="top-yield-material-chart">
    <div class="top-yield-material-chart__title">最近一周前20不良料号</div>
    <div class="top-yield-material-chart__mount" ref="chart"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import gql from 'graphql-tag'

export default {
  name: 'TopYieldMaterialChart',
  data() {
    return {
      chart: undefined,
      echartsResult: {
        xAxisData: [],
        seriesData: {
          data: []
        }
      },
      options: {
        tooltip: {
          show: true
        },
        color: ['#3FE3D3', '#5E83F2'],
        title: {
          text: '料号监测',
          subtext: '前20最低良率料号'
        },
        xAxis: {
          name: '料号',
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
            name: '点位不良率',
            barMaxWidth: 20
          }
        ]
      }
    }
  },
  apollo: {
    echartsResult: {
      query: gql`
        query($duration: [Time]!, $limit: Int!) {
          echartsResult: materialYieldTop(duration: $duration, limit: $limit) {
            xAxisData
            seriesData
          }
        }
      `,
      variables() {
        var t = new Date()
        t.setDate(t.getDate() - 20)

        return {
          duration: [t],
          limit: 20
        }
      }
    }
  },
  watch: {
    echartsResult(nv) {
      if (nv) {
        var values = nv.seriesData.data.map((item, i) => {
          var rate = (item * 100).toFixed(2)
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
        this.chart.setOption(this.options)
      }
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
    padding: 16px;
    box-sizing: border-box;
    height: calc(100% - 48px);
    background: #fff;
    border-radius: 4px;
  }
}
</style>
