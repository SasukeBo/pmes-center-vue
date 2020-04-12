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
        <div><span class="label">总数：</span>{{ analyzeSize.total }}</div>
        <div>
          <span class="label">Normal：</span
          >{{ parseFloat(analyzeSize.normal).toFixed(3) }}
        </div>
      </div>

      <div class="summary-item">
        <div>
          <span class="label">CP：</span
          >{{ parseFloat(analyzeSize.cp).toFixed(3) }}
        </div>
        <div>
          <span class="label">CPK：</span
          >{{ parseFloat(analyzeSize.cpk).toFixed(3) }}
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
            ok
            ng
            cp
            cpk
            normal
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
      analyzeSize: {
        total: 0,
        ok: 0,
        ng: 0,
        cp: 0,
        cpk: 0,
        normal: 0,
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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '检测值频度',
            type: 'bar'
          },
          {
            name: '良率',
            type: 'pie',
            center: ['80%', '25%'],
            radius: '28%',
            z: 100,
            tooltip: {
              formatter: '{a} <br/>{b} : {c} ({d}%)'
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
        this.option.xAxis.data = val.dataset.values
        this.option.series[0].data = val.dataset.freqs
        this.option.series[1].data = [
          { name: 'OK', value: val.ok },
          { name: 'NG', value: val.ng }
        ]
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
    this.option.title.text = `尺寸 ${this.size.name}`
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
