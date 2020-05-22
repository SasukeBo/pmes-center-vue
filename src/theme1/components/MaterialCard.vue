<template>
  <div
    class="material-card"
    v-loading="$apollo.queries.analyzeMaterial.loading"
  >
    <MoreOptionPopover
      @edit="editMaterial"
      @delete="deleteMaterial"
    ></MoreOptionPopover>

    <div class="card-title">
      {{ analyzeMaterial.material.customerCode }} ({{
        analyzeMaterial.material.name
      }})
    </div>
    <div class="card-sub-title">
      {{ analyzeMaterial.material.projectRemark }}
      <span v-if="analyzeMaterial && analyzeMaterial.ok && analyzeMaterial.ng"
        >总产出：{{ analyzeMaterial.ok + analyzeMaterial.ng }}</span
      >
    </div>

    <div ref="chart-mount" class="percent-pie-chart"></div>
    <div
      class="yield-rate"
      v-if="analyzeMaterial && analyzeMaterial.ok && analyzeMaterial.ng"
    >
      <span class="rate yield"
        >Yield:
        {{
          (
            (analyzeMaterial.ok * 100) /
            (analyzeMaterial.ok + analyzeMaterial.ng)
          ).toFixed(2)
        }}%</span
      >
    </div>

    <div class="detail-btn">
      <el-button type="primary" size="mini" @click="goToDetail"
        >查看详情</el-button
      >
    </div>

    <div v-show="pending" class="loading-data-mask">
      <div class="pending-title">正在加载FTP文件数据</div>
      <div class="pending-subtitle">请稍候 ...</div>
      <el-progress
        type="circle"
        :width="150"
        :stroke-width="10"
        :percentage="parseInt(finished.toFixed())"
      ></el-progress>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import gql from 'graphql-tag'
import MoreOptionPopover from '@/theme1/components/MoreOptionPopover.vue'
export default {
  name: 'MaterialCard',
  components: { MoreOptionPopover },
  props: {
    materialID: [Number, String],
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
            materialID: this.materialID,
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
              formatter: '{b}',
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
      analyzeMaterial: {
        material: {}
      },
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
    editMaterial() {
      this.$emit('edit', this.analyzeMaterial.material)
    },
    deleteMaterial() {
      this.$emit('delete', this.materialID)
    },
    renderChart() {
      var result = this.analyzeMaterial
      this.option.series[0].data = [
        { name: 'OK', value: result.ok },
        { name: 'NG', value: result.ng }
      ]
      this.mychart.setOption(this.option)
    },
    goToDetail() {
      localStorage.setItem('recent_view_material_id', this.materialID)
      this.$router.push({
        name: 'MaterialView',
        params: { id: this.materialID }
      })
    }
  }
}
</script>
<style lang="scss">
.theme_1-app .material-card {
  height: 376px;
  border-radius: 4px;
  background: #fff;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 20px;
  text-align: center;

  .card-title {
    font-size: 20px;
    color: #666;
    font-weight: bold;
    padding-top: 26px;
    line-height: 20px;
  }

  .card-sub-title {
    font-size: 14px;
    color: #999;
    padding-top: 16px;
  }

  .percent-pie-chart {
    height: 158px;
    width: 158px;
    margin: auto;
    padding-top: 16px;
  }

  .yield-rate {
    font-size: 12px;
    padding: 0 62px;

    .yield {
      text-align: center;
      color: #3fe3d3;
    }
  }

  .detail-btn {
    padding-top: 32px;
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
    font-size: 16px;
    text-align: center;
    color: #666;
    padding-top: 36px;
    padding-bottom: 24px;
  }

  .pending-subtitle {
    font-size: 16px;
    text-align: center;
    color: #999;
    padding-bottom: 24px;
  }
}
</style>
