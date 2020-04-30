<template>
  <div
    class="size-card"
    v-loading="
      $apollo.queries.analyzeSize.loading || analyzeSize.status.pending
    "
  >
    <div ref="chart" class="size-chart"></div>
    <div class="summary-data">
      <div class="summary-item">
        <div><span class="label">Total：</span>{{ analyzeSize.total }}</div>
        <div>
          <span class="label">Average：</span
          >{{ parseFloat(analyzeSize.avg).toFixed(2) }}
        </div>
        <div>
          <span class="label">Max：</span
          >{{ parseFloat(analyzeSize.max).toFixed(2) }}
        </div>
      </div>

      <div class="summary-item">
        <div>
          <span class="label">CP：</span
          >{{ parseFloat(analyzeSize.cp).toFixed(2) }}
        </div>
        <div>
          <span class="label">CPK：</span
          >{{ parseFloat(analyzeSize.cpk).toFixed(2) }}
        </div>
        <div>
          <span class="label">Min：</span
          >{{ parseFloat(analyzeSize.min).toFixed(2) }}
        </div>
      </div>

      <div class="summary-item">
        <div>
          <span class="label">UpperLimit：</span
          >{{ parseFloat(size.upperLimit).toFixed(2) }}
        </div>
        <div>
          <span class="label">LowerLimit：</span
          >{{ parseFloat(size.lowerLimit).toFixed(2) }}
        </div>
        <div>
          <span class="label">SD：</span
          >{{ parseFloat(analyzeSize.s).toFixed(2) }}
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
            status {
              message
              pending
              fileIDs
            }
          }
        }
      `,
      variables() {
        return {
          search: {
            sizeID: this.size.id,
            beginTime: this.beginTime,
            endTime: this.endTime
          }
        }
      }
    }
  },
  data() {
    return {
      mychart: undefined,
      gt: 0,
      lt: 0,
      analyzeSize: {
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
        },
        status: {
          pending: false,
          message: '',
          fileIDs: []
        }
      },
      intervalFetch: undefined,
      option: {
        title: {
          padding: 24
        },
        color: ['#409EFF', '#E6A23C'],
        tooltip: {},
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '检测值频度',
            type: 'bar',
            markLine: {
              symbol: ['none', 'none'],
              label: { show: true, position: 'end' },
              tooltip: {
                show: false
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}'
            }
          },
          {
            name: '良率',
            type: 'pie',
            center: ['80%', '25%'],
            radius: '28%',
            z: 100,
            tooltip: {
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            animation: false,
            label: {
              formatter: '{b}({d}%)'
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
        this.option.title.text = `${
          this.size.name
        } (${this.size.norminal.toFixed(2)})`
        this.option.xAxis.data = val.dataset.values
        this.option.series[0].data = val.dataset.freqs
        this.option.series[1].data = [
          { name: 'OK', value: val.ok },
          { name: 'NG', value: val.ng }
        ]

        var size = this.size
        var markLineData = []
        var values = val.dataset.values
        var gt = values.findIndex(i => i >= size.lowerLimit)
        if (gt < 0 && values[0] >= size.lowerLimit) {
          gt = 0
        }
        if (gt >= 0) {
          markLineData.push({
            xAxis: gt,
            lineStyle: { color: '#333', type: 'dashed', width: 2 },
            label: {
              formatter: function() {
                return size.lowerLimit.toFixed(2)
              }
            }
          })
        }
        this.gt = gt
        var lt = values.findIndex(i => i > size.upperLimit) - 1
        if (lt < 0 && values[values.length - 1] <= size.upperLimit) {
          lt = values.length - 1
        }
        if (lt >= 0) {
          markLineData.push({
            xAxis: lt,
            lineStyle: { color: '#333', type: 'dashed', width: 2 },
            label: {
              formatter: function() {
                return size.upperLimit.toFixed(2)
              }
            }
          })
        }
        this.lt = lt

        this.option.series[0].markLine.data = markLineData
        this.option.series[0].markArea = {
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
    },
    'analyzeSize.status.pending': {
      immediate: true,
      handler: function(val) {
        if (val) {
          this.intervalFetch = setInterval(() => {
            this.$apollo
              .query({
                query: gql`
                  query($fileIDs: [Int]!) {
                    finished: dataFetchFinishPercent(fileIDs: $fileIDs)
                  }
                `,
                variables: {
                  fileIDs: this.fileIDs
                },
                fetchPolicy: 'network-only'
              })
              .then(({ data }) => {
                this.finished = data.finished * 100
                if (data.finished === 1) {
                  clearInterval(this.intervalFetch)
                  this.$apollo.queries.analyzeSize.refresh()
                }
              })
              .catch(e => {
                console.log(e.message)
              })
          })
        }
      }
    }
  },
  mounted() {
    this.mychart = echarts.init(this.$refs.chart)
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
    height: 250px;
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
      }
    }
  }
}
</style>
