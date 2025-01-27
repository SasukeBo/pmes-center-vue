<template>
  <div class="size-card" v-loading="loading">
    <div ref="chart" class="size-chart"></div>
    <div class="summary-data">
      <div class="summary-item">
        <div>
          <span class="label">Total：</span
          >{{ analyzeSize ? analyzeSize.total : 0 }}
        </div>
        <div>
          <span class="label">Average：</span
          >{{ analyzeSize ? parseFloat(analyzeSize.avg).toFixed(2) : 0 }}
        </div>
        <div>
          <span class="label">Max：</span
          >{{ analyzeSize ? parseFloat(analyzeSize.max).toFixed(2) : 0 }}
        </div>
      </div>

      <div class="summary-item">
        <div>
          <span class="label">CP：</span
          >{{ analyzeSize ? parseFloat(analyzeSize.cp).toFixed(2) : 0 }}
        </div>
        <div>
          <span class="label">CPK：</span
          >{{ analyzeSize ? parseFloat(analyzeSize.cpk).toFixed(2) : 0 }}
        </div>
        <div>
          <span class="label">Min：</span
          >{{ analyzeSize ? parseFloat(analyzeSize.min).toFixed(2) : 0 }}
        </div>
      </div>

      <div class="summary-item">
        <div>
          <span class="label">UpperLimit：</span
          >{{ analyzeSize ? parseFloat(size.upperLimit).toFixed(2) : 0 }}
        </div>
        <div>
          <span class="label">LowerLimit：</span
          >{{ analyzeSize ? parseFloat(size.lowerLimit).toFixed(2) : 0 }}
        </div>
        <div>
          <span class="label">SD：</span
          >{{ analyzeSize ? parseFloat(analyzeSize.s).toFixed(6) : 0 }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import gql from 'graphql-tag'
export default {
  props: {
    size: Object,
    canFetch: Boolean,
    deviceID: [Number, String],
    beginTime: {
      type: Date,
      default: undefined
    },
    endTime: {
      type: Date,
      default: undefined
    }
  },
  apollo: {
    analyzeSize: {
      query: gql`
        query($search: Search!) {
          analyzeSize(searchInput: $search) {
            total
            s
            ok
            ng
            cp
            cpk
            avg
            min
            max
            dataset
          }
        }
      `,
      variables() {
        return {
          search: {
            deviceID: this.deviceID,
            sizeID: this.size.id,
            beginTime: this.beginTime,
            endTime: this.endTime
          }
        }
      },
      skip() {
        return !this.canFetch
      },
      error(e) {
        this.error = '系统错误，加载失败'
      },
      fetchPolicy: 'network-only'
    }
  },
  computed: {
    loading() {
      return this.$apollo.queries.analyzeSize.loading && !this.error
    }
  },
  data() {
    return {
      mychart: undefined,
      gt: 0,
      lt: 0,
      error: '',
      analyzeSize: undefined,
      intervalFetch: undefined,
      option: {
        title: {
          padding: [0, 24],
          top: 0
        },
        color: ['#409EFF', '#EC1B1B'],
        tooltip: {
          position: function(pt) {
            return [pt[0], 130]
          }
        },
        grid: {
          top: 100
        },
        xAxis: {
          type: 'category',
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
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            boundaryGap: false,
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
            name: '良率',
            type: 'pie',
            center: ['50%', '15%'],
            radius: '20%',
            z: 100,
            tooltip: {
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            animation: false,
            label: {
              formatter: '{b}({d}%)'
            },
            labelLine: {
              length: 5,
              length2: 5
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
              color: '#ec1b1b',
              width: 1
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
  watch: {
    analyzeSize: {
      immediate: true,
      handler: function(val) {
        if (val) {
          this.option.title.text = `${
            this.size.name
          } (${this.size.norminal.toFixed(2)})`
          this.option.xAxis.data = val.dataset.values
          this.option.series[0].data = val.dataset.freqs
          this.option.series[1].data = [
            { name: 'OK', value: val.ok },
            { name: 'NG', value: val.ng }
          ]
          this.option.series[2].data = val.dataset.distribution
          this.option.xAxis.axisPointer.label.formatter = function(params) {
            var i = val.dataset.values.findIndex(i => `${i}` === params.value)
            if (i >= 0) {
              return `${params.value}: ${val.dataset.freqs[i]}`
            }

            return ''
          }

          var size = this.size
          var markLineData = []
          var values = val.dataset.values
          var _u3s = val.avg - 3 * val.s
          var u3s = val.avg + 3 * val.s
          var gt = values.findIndex(i => i >= _u3s)
          if (gt < 0 && values[0] >= size.lowerLimit) {
            gt = 0
          }
          if (gt >= 0) {
            markLineData.push({
              xAxis: gt,
              lineStyle: { color: '#ec1b1b', type: 'solid', width: 1 },
              label: {
                formatter: function() {
                  return `μ-3σ (${_u3s.toFixed(3)})`
                }
              }
            })
          }
          this.gt = gt
          var lt = values.findIndex(i => i > u3s) - 1
          if (lt < 0 && values[values.length - 1] <= size.upperLimit) {
            lt = values.length - 1
          }
          if (lt >= 0) {
            markLineData.push({
              xAxis: lt,
              lineStyle: { color: '#ec1b1b', type: 'solid', width: 1 },
              label: {
                formatter: function() {
                  return `μ+3σ (${u3s.toFixed(3)})`
                }
              }
            })
          }
          this.lt = lt

          this.option.series[2].markLine.data = markLineData
          this.option.series[2].markArea = {
            itemStyle: {
              color: 'rgba(0,255,0,0.3)'
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
    }
  },
  methods: {
    setAnalyzeSize() {
      this.analyzeSize = {
        total: 0,
        s: 0,
        ok: 0,
        ng: 0,
        cp: 0,
        cpk: 0,
        avg: 0,
        min: 0,
        max: 0,
        dataset: {
          values: [],
          freq: []
        }
      }
    }
  },
  mounted() {
    this.mychart = echarts.init(this.$refs.chart)
  },
  created() {
    this.setAnalyzeSize()
  }
}
</script>
<style lang="scss">
.size-card {
  padding: 16px 8px;
  border: 1px solid #efefef;
  margin-bottom: 16px;
  border-radius: 4px;

  .size-chart {
    height: 300px;
  }

  .summary-data {
    padding: 0 24px;
    display: flex;

    .summary-item {
      flex: 1;
      padding-right: 16px;
      color: #666;

      .label {
        color: #333;
        font-weight: bold;
      }
    }
  }
}
</style>
