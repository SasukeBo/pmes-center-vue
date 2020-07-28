<template>
  <div class="material-recent-pie" v-loading="$apollo.queries.material.loading">
    <div v-if="material">
      <div class="chart" ref="chart"></div>
      <div class="yield">Yield:{{ ratio }}%</div>
      <div class="attributes">
        <div v-if="material.customerCode">
          {{ material.customerCode }}({{ material.name }})
        </div>
        <div v-else>{{ material.name }}</div>
        <div v-if="material.projectRemark">{{ material.projectRemark }}</div>
        <div>总产量:{{ material.ok + material.ng }}</div>
      </div>

      <div class="go-detail">
        <el-button
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
  name: 'RecentMaterialPie',
  props: {
    materialID: [Number, String]
  },
  apollo: {
    material: {
      query: gql`
        query($id: Int!) {
          material(id: $id) {
            id
            name
            customerCode
            projectRemark
            ok
            ng
          }
        }
      `,
      variables() {
        return {
          id: this.materialID
        }
      }
    }
  },
  computed: {
    ratio() {
      if (!this.material) return 0
      if (this.material.ok + this.material.ng === 0) return 0
      return (
        (this.material.ok * 100) /
        (this.material.ok + this.material.ng)
      ).toFixed(2)
    }
  },
  data() {
    return {
      material: undefined,
      chart: undefined,
      option: {
        color: ['#FFBA30', 'rgba(255, 186, 48, 0.21)'],
        series: [
          {
            name: '产量',
            type: 'pie',
            radius: ['60%', '100%'],
            center: ['50%', '50%'],
            label: {
              show: false
            },
            itemStyle: {
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowBlur: 10
            },
            hoverAnimation: false,
            legendHoverLink: false,
            data: []
          }
        ]
      }
    }
  },
  watch: {
    material(nv) {
      this.option.series[0].data = [
        { name: 'OK', value: nv.ok },
        { name: 'NG', value: nv.ng }
      ]

      this.$nextTick(() => {
        this.chart = echarts.init(this.$refs.chart)
        this.chart.setOption(this.option)
      })
    }
  }
}
</script>
<style lang="scss">
.material-recent-pie {
  margin-top: 16px;
  margin-right: 24px;
  height: 390px;
  width: 282px;
  background: linear-gradient(
    180deg,
    rgba(83, 88, 255, 1) 0%,
    rgba(10, 174, 209, 1) 100%
  );
  border-radius: 4px;
  opacity: 0.8;

  .chart {
    height: 100px;
    padding-top: 60px;
  }

  .yield {
    color: #fff;
    font-size: 32px;
    line-height: 45px;
    padding: 8px 0;
    text-align: center;
    font-weight: 900;
  }

  .attributes {
    color: #fff;
    text-align: center;
    opacity: 0.8;
    line-height: 24px;
    font-size: 16px;
    padding-top: 6px;
    height: 100px;
  }

  .go-detail {
    text-align: center;

    .el-button {
      color: #3eb1db;
      font-size: 14px;
      line-height: 12px;
      font-weight: bold;
      width: 234px;
      border-radius: 900px;
      box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.16);
      background: #fff;
      transition: 0.3s all ease;

      &:hover {
        color: rgba(62, 177, 219, 0.8);
        box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>
