<template>
  <div class="material-card">
    <div class="card-title">
      {{ material.customerCode }} ({{ material.name }})
    </div>
    <div class="card-sub-title">
      {{ material.projectRemark }}
      <span>总产出：{{ material.ok + material.ng }}</span>
    </div>

    <div ref="chart-mount" class="percent-pie-chart"></div>
    <div class="yield-rate" v-if="material.ok + material.ng > 0">
      <span class="rate yield"
        >Yield:
        {{
          ((material.ok * 100) / (material.ok + material.ng)).toFixed(2)
        }}%</span
      >
    </div>

    <div class="detail-btn">
      <el-button type="primary" size="mini" @click="goToDetail"
        >查看详情</el-button
      >
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'

export default {
  name: 'MaterialCard',
  props: {
    material: Object
  },
  data() {
    return {
      mychart: undefined,
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
      }
    }
  },
  methods: {
    renderChart() {
      this.option.series[0].data = [
        { name: 'OK', value: this.material.ok },
        { name: 'NG', value: this.material.ng }
      ]
      this.mychart.setOption(this.option)
    },
    goToDetail() {
      localStorage.setItem('recent_view_material_id', this.material.id)
      this.$router.push({
        name: 'MaterialView',
        params: { id: this.material.id }
      })
    }
  },
  mounted() {
    this.mychart = echarts.init(this.$refs['chart-mount'])
    this.renderChart()
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
