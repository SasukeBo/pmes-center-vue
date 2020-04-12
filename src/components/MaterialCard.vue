<template>
  <div
    class="material-card"
    v-loading="$apollo.queries.analyzeMaterial.loading"
  >
    <div ref="chart-mount" style="height: 284px;"></div>
    <div v-if="analyzeMaterial" class="total-summary">
      总产出：{{ analyzeMaterial.ok + analyzeMaterial.ng }}
      <router-link
        class="material-detail"
        :to="{ name: 'MaterialView', params: { id: materialID } }"
        >查看详情</router-link
      >
    </div>
    <div v-show="pending" class="loading-data-mask">
      <div class="pending-title">正在加载FTP文件数据，请稍后</div>
      <div class="pending-icon">
        <i class="el-icon-loading" />
      </div>
      <el-progress
        :text-inside="true"
        :stroke-width="15"
        :percentage="finished"
        status="success"
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
    materialID: Number,
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
            }
            ok
            ng
          }
        }
      `,
      variables() {
        return {
          input: {
            materialID: this.materialID
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
        title: {
          subtext: '最近一个月生产数据'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#409EFF', '#E6A23C'],
        series: [
          {
            radius: '50%',
            center: ['50%', '50%'],
            animation: false,
            type: 'pie',
            name: '产量',
            data: []
          }
        ]
      },
      analyzeMaterial: undefined
    }
  },
  watch: {
    pending(nv) {
      if (!nv) {
        clearInterval(this.interval)
      }
    },
    analyzeMaterial(nv) {
      if (nv) {
        this.option.series[0].data = [
          { name: 'OK', value: this.analyzeMaterial.ok },
          { name: 'NG', value: this.analyzeMaterial.ng }
        ]
        this.option.title.text = `料号${nv.material.name}`
        this.mychart.setOption(this.option)
      }
    }
  },
  mounted() {
    this.mychart = echarts.init(this.$refs['chart-mount'])
  },
  created() {
    if (this.pending) {
      this.interval = setInterval(() => {
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
}
</script>
<style lang="scss">
.material-card {
  box-shadow: 0 0 3px #999;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  position: relative;

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

  .pending-icon {
    height: 64px;
    font-size: 29px;
  }

  .pending-title {
    text-align: center;
    color: #666;
    padding-top: 64px;
    padding-bottom: 48px;
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
