<template>
  <div class="recent-material">
    <div ref="chart" class="pie-chart"></div>
    <div
      class="yield"
      v-if="analyzeMaterial && analyzeMaterial.ok && analyzeMaterial.ng"
    >
      Yield:
      {{
        (
          (analyzeMaterial.ok * 100) /
          (analyzeMaterial.ok + analyzeMaterial.ng)
        ).toFixed(2)
      }}%
    </div>
    <div class="data-block" v-if="analyzeMaterial">
      <div class="title">
        {{ analyzeMaterial.material.customerCode }} ({{
          analyzeMaterial.material.name
        }})
      </div>
      <div class="sub-title">{{ analyzeMaterial.material.projectRemark }}</div>
      <div class="sub-title">
        近一年产量：{{ analyzeMaterial.ok + analyzeMaterial.ng }}
      </div>

      <div class="view-btn">
        <el-button
          type="primary"
          size="small"
          @click="
            $router.push({
              name: 'MaterialView',
              params: { id: materialID }
            })
          "
          >查看详情</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import echarts from 'echarts'

export default {
  props: ['materialID'],
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
      }
    }
  },
  data() {
    return {
      analyzeMaterial: undefined,
      mychart: undefined,
      option: {
        color: ['#3FE3D3', '#E04660'],
        series: [
          {
            name: '产量',
            type: 'pie',
            radius: ['30%', '55%'],
            center: ['50%', '50%'],
            label: {
              show: false
            },
            itemStyle: {
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowBlur: 10
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 24,
                fontWeight: 'bold'
              }
            },
            data: []
          }
        ]
      }
    }
  },
  mounted() {
    this.mychart = echarts.init(this.$refs.chart)
  },
  watch: {
    analyzeMaterial(nv) {
      this.option.series[0].data = [
        { name: 'OK', value: nv.ok },
        { name: 'NG', value: nv.ng }
      ]

      this.mychart.setOption(this.option)
    }
  }
}
</script>
<style lang="scss">
.theme_1-app .recent-material {
  height: 100%;
  display: flex;
  position: relative;

  .yield {
    position: absolute;
    font-size: 24px;
    color: #3fe3d3;
    top: 32px;
    left: 32px;
  }

  .pie-chart {
    flex: 2;
    max-width: 66%;
  }

  .data-block {
    flex: 1;
    padding: 60px 0;

    .title {
      font-size: 24px;
      color: #333;
      font-weight: bold;
      line-height: 24px;
      padding-bottom: 16px;
    }

    .sub-title {
      line-height: 16px;
      font-size: 16px;
      color: #666;
      padding-bottom: 8px;
    }

    .view-btn {
      padding-top: 40px;
    }
  }
}
</style>
