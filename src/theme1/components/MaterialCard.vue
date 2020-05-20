<template>
  <div
    class="material-card"
    v-loading="$apollo.queries.analyzeMaterial.loading"
  >
    <div ref="chart-mount" class="percent-pie-chart"></div>
    <div v-if="analyzeMaterial" class="total-summary">
      总产出：{{ analyzeMaterial.ok + analyzeMaterial.ng }}
      <router-link
        class="material-detail"
        :to="{ name: 'MaterialView', params: { id: material.id } }"
        >查看详情</router-link
      >
    </div>
    <div v-show="pending" class="loading-data-mask">
      <div class="pending-title">正在加载FTP文件数据，请稍候</div>
      <el-progress
        type="circle"
        :width="150"
        :stroke-width="5"
        :percentage="parseInt(finished.toFixed())"
      ></el-progress>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import gql from 'graphql-tag'
export default {
  name: 'MaterialCard',
  props: {
    material: Object,
    pending: {
      type: Boolean,
      default: false
    },
    fileIDs: Array
  },
  apollo: {
    analyzeMaterial: {
      query: gql`
        query($input: Search!) {
          analyzeMaterial(searchInput: $input) {
            material {
              id
              name
              customerCode
              projectRemark
            }
            ok
            ng
            status {
              message
              pending
              fileIDs
            }
          }
        }
      `,
      variables() {
        var end = new Date()
        var begin = new Date()
        begin.setMonth(begin.getMonth() - 12)
        return {
          input: {
            materialID: this.material.id,
            beginTime: begin,
            endTime: end
          }
        }
      },
      skip() {
        return this.pending
      }
    }
  },
  data() {
    return {
      mychart: undefined,
      finished: 0,
      interval: undefined,
      option: {
        color: ['#3FE3D3', '#E04660'],
        series: [
          {
            name: '产量',
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['50%', '50%'],
            label: {
              show: false,
              formatter: '{b}({d}%)',
              position: 'center'
            },
            itemStyle: {
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowBlur: 10
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            data: []
          }
        ]
      },
      analyzeMaterial: undefined,
      needFetch: undefined
    }
  },
  watch: {
    pending: {
      immediate: true,
      handler: function(nv) {
        if (!nv) {
          clearInterval(this.interval)
          this.needFetch = undefined
          if (this.$apollo.queries.analyzeMaterial) {
            console.log('start analyzeMaterial')
            this.$apollo.queries.analyzeMaterial.start()
          }
        } else {
          this.interval = setInterval(() => {
            this.$apollo
              .query({
                query: gql`
                  query($fileIDs: [Int]!) {
                    finished: dataFetchFinishPercent(fileIDs: $fileIDs)
                  }
                `,
                variables: {
                  fileIDs: this.fileIDs || this.needFetch
                },
                fetchPolicy: 'network-only'
              })
              .then(({ data }) => {
                this.finished = data.finished * 100
                if (data.finished === 1) {
                  setTimeout(() => {
                    this.$emit('update:pending', false)
                  }, 500)
                }
              })
              .catch((e) => {
                console.log(e.message)
              })
          }, 500)
        }
      }
    },
    analyzeMaterial(nv) {
      if (nv.status && nv.status.pending) {
        this.needFetch = nv.status.fileIDs
        this.$emit('update:pending', nv.status.pending)
        return
      }
      if (nv) {
        this.renderChart()
      }
    }
  },
  mounted() {
    this.mychart = echarts.init(this.$refs['chart-mount'])
  },
  methods: {
    renderChart() {
      var result = this.analyzeMaterial
      this.option.series[0].data = [
        { name: 'OK', value: result.ok },
        { name: 'NG', value: result.ng }
      ]
      this.mychart.setOption(this.option)
    }
  }
}
</script>
<style lang="scss">
.theme_1-app .material-card {
  height: 376px;
  border-radius: 4px;
  background: #fff;
  padding: 8px;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 20px;

  .percent-pie-chart {
    height: 158px;
    width: 158px;
    margin: auto;
  }

  .loading-data-mask {
    height: 100%;
    border-radius: 4px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    background: #fff;
    text-align: center;
    padding: 0 32px;
    z-index: 1000;
  }

  .pending-title {
    text-align: center;
    color: #666;
    padding-top: 36px;
    padding-bottom: 24px;
  }

  .total-summary {
    position: absolute;
    bottom: 8px;
    width: 100%;
    left: 0;
    right: 0;
    padding: 0 8px;
    box-sizing: border-box;

    a.material-detail {
      float: right;
    }
  }
}
</style>
