<template>
  <div
    class="material-card"
    v-loading="$apollo.queries.analyzeMaterial.loading"
  >
    <div v-show="!dataloading" ref="chart-mount" style="height: 284px;"></div>
    <div v-if="analyzeMaterial" class="total-summary">
      总产出：{{ analyzeMaterial.ok + analyzeMaterial.ng }}
      <router-link class="material-detail" :to="{ path: '/' }"
        >查看详情</router-link
      >
    </div>
    <div v-show="dataloading" style="height: 284px;">
      <div class="pending-title">正在加载FTP文件数据，请稍后</div>
      <el-progress
        :text-inside="true"
        :stroke-width="20"
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
    pending: Boolean
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
        return (this.pending && this.dataloading) || !this.materialID
      }
    }
  },
  data() {
    return {
      dataloading: false,
      mychart: undefined,
      finished: 0,
      interval: undefined,
      option: {
        title: {
          subtext: '最近一个月生产数据'
        },
        tooltip: {},
        series: [
          {
            radius: '50%',
            center: ['50%', '50%'],
            animation: false,
            type: 'pie',
            data: []
          }
        ]
      },
      analyzeMaterial: undefined
    }
  },
  watch: {
    dataloading(nv) {
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
      this.dataloading = this.pending
      this.interval = setInterval(() => {
        this.$apollo
          .query({
            query: gql`
              query($materialID: Int!) {
                finished: dataFetchFinishPercent(materialID: $materialID)
              }
            `,
            variables: {
              materialID: this.materialID
            },
            fetchPolicy: 'network-only'
          })
          .then(({ data }) => {
            this.finished = data.finished * 100
            if (data.finished === 1) {
              this.dataloading = false
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

  .pending-title {
    text-align: center;
    padding: 64px 0;
    color: #666;
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
