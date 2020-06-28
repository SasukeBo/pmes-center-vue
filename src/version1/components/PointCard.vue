<template>
  <div class="point-card" v-loading="$apollo.queries.pointResult.loading">
    <div class="data-block">
      <div class="title" v-if="pointResult">
        {{ pointResult.point.name }} ({{
          pointResult.point.nominal.toFixed(2)
        }})
      </div>

      <div class="subtitle" v-if="pointResult">
        Yeild: {{ ((pointResult.ok * 100) / pointResult.total).toFixed(2) }}%
      </div>
      <div class="item" v-if="pointResult">Total: {{ pointResult.total }}</div>
      <div class="item" v-if="pointResult">
        Average: {{ pointResult.avg.toFixed(2) }}
      </div>
      <div class="item" v-if="pointResult">
        Max: {{ pointResult.max.toFixed(2) }}
      </div>
      <div class="item" v-if="pointResult">
        Min: {{ pointResult.min.toFixed(2) }}
      </div>
      <div class="item" v-if="pointResult">
        UpperLimit: {{ pointResult.point.upperLimit.toFixed(2) }}
      </div>
      <div class="item" v-if="pointResult">
        LowerLimit: {{ pointResult.point.lowerLimit.toFixed(2) }}
      </div>
      <div class="item" v-if="pointResult">
        SD: {{ pointResult.s.toFixed(6) }}
      </div>
      <div class="item" v-if="pointResult">
        CP: {{ pointResult.cp.toFixed(2) }}
      </div>
      <div class="item" v-if="pointResult">
        CPK: {{ pointResult.cpk.toFixed(2) }}
      </div>
    </div>

    <div class="analyze-chart" ref="chart"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import gql from 'graphql-tag'
export default {
  props: {
    id: [Number, String]
  },
  data() {
    return {
      pointResult: undefined,
      mychart: undefined,
      gt: 0,
      lt: 0,
      duration: [],
      filters: {},
      option: {
        title: {
          padding: [0, 24],
          top: 0
        },
        color: ['#3FE3D3', '#5E83F2'],
        tooltip: {
          position: function(pt) {
            return [pt[0], 130]
          }
        },
        grid: {
          top: 52,
          left: 30,
          bottom: 100
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisPointer: {
            show: true,
            snap: true,
            lineStyle: {
              color: '#004E52',
              opacity: 0.5,
              width: 2
            },
            label: {
              show: true
            },
            handle: {
              show: true,
              color: '#004E52',
              size: 20,
              margin: 36
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            boundaryGap: false,
            axisLabel: {
              color: '#666'
            },
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            boundaryGap: false,
            axisLabel: {
              color: '#666'
            },
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '检测值频度',
            type: 'bar',
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}'
            }
          },
          {
            name: '正态分布',
            type: 'line',
            yAxisIndex: 1,
            boundaryGap: false,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              color: '#5E83F2',
              width: 2
            },
            markLine: {
              symbol: ['none', 'none'],
              label: { show: true, position: 'end' },
              tooltip: {
                show: false
              }
            }
          }
        ]
      }
    }
  },
  apollo: {
    pointResult: {
      query: gql`
        query($id: Int!, $duration: [Time]!, $filters: Map!) {
          pointResult: sizeNormalDistribution(
            id: $id
            duration: $duration
            filters: $filters
          ) {
            point {
              id
              name
              upperLimit
              lowerLimit
              nominal
            }
            total
            s
            ok
            ng
            cp
            cpk
            avg
            max
            min
            dataset
          }
        }
      `,
      variables() {
        return {
          id: this.id,
          duration: this.duration,
          filters: this.filters
        }
      }
    }
  },
  watch: {
    pointResult(val) {
      if (val) {
        this.option.xAxis.data = val.dataset.values
        this.option.series[0].data = val.dataset.freqs
        this.option.series[1].data = val.dataset.distribution
        this.option.xAxis.axisPointer.label.formatter = function(params) {
          var i = val.dataset.values.findIndex((i) => `${i}` === params.value)
          if (i >= 0) {
            return `${params.value}: ${val.dataset.freqs[i]}`
          }

          return ''
        }

        var point = val.point
        var markLineData = []
        var values = val.dataset.values
        var _u3s = val.avg - 3 * val.s
        var u3s = val.avg + 3 * val.s
        var gt = values.findIndex((i) => i >= _u3s)
        if (gt < 0 && values[0] >= point.lowerLimit) {
          gt = 0
        }
        if (gt >= 0) {
          markLineData.push({
            xAxis: gt,
            lineStyle: { color: '#5E83F2', type: 'solid', width: 2 },
            label: {
              formatter: function() {
                return `μ-3σ (${_u3s.toFixed(3)})`
              }
            }
          })
        }
        this.gt = gt
        var lt = values.findIndex((i) => i > u3s) - 1
        if (lt < 0 && values[values.length - 1] <= point.upperLimit) {
          lt = values.length - 1
        }
        if (lt >= 0) {
          markLineData.push({
            xAxis: lt,
            lineStyle: { color: '#5E83F2', type: 'solid', width: 2 },
            label: {
              formatter: function() {
                return `μ+3σ (${u3s.toFixed(3)})`
              }
            }
          })
        }
        this.lt = lt

        this.option.series[1].markLine.data = markLineData
        this.option.series[1].markArea = {
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
                  color: '#3FE3D3' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#57F262' // 100% 处的颜色
                }
              ]
            },
            opacity: 0.13
          },
          data: [
            [
              {
                name: '合格区间',
                xAxis: gt,
                label: {
                  show: false
                }
              },
              {
                xAxis: lt
              }
            ]
          ]
        }

        if (this.mychart) {
          this.mychart.setOption(this.option)
        }
      }
    }
  },
  mounted() {
    this.mychart = echarts.init(this.$refs.chart)
    this.mychart.setOption(this.option)
  }
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
  box-sizing: border-box;

  .data-block {
    flex: 1;
    padding-left: 102px;
    padding-top: 32px;

    .title {
      font-size: 20px;
      color: #333;
      font-weight: bold;
      line-height: 1;
      padding-bottom: 8px;
    }

    .subtitle {
      font-size: 20px;
      color: #3fe3d3;
      font-weight: bold;
      line-height: 1;
      padding-bottom: 40px;
    }

    .item {
      font-size: 12px;
      color: #666;
      padding-bottom: 16px;
    }
  }

  .analyze-chart {
    flex: 4;
  }
}
</style>
