<template>
  <div class="material-recent-bar">
    <div class="chart" ref="chart">图表渲染失败</div>
  </div>
</template>
<script>
import echarts from 'echarts'
import gql from 'graphql-tag'

export default {
  name: 'RecentMaterialBar',
  props: {
    materialID: [String, Number]
  },
  data() {
    return {
      chart: undefined,
      echartsResult: undefined
    }
  },
  apollo: {
    echartsResult: {
      query: gql`
        query($input: GraphInput!) {
          echartsResult: groupAnalyzeMaterial(analyzeInput: $input) {
            xAxisData
            seriesData
            seriesAmountData
          }
        }
      `,
      variables() {
        var t = new Date()
        t.setHours(0, 0, 0)
        // t.setDate(t.getDate() - 7)
        // TODO
        t.setMonth(t.getMonth() - 3)
        return {
          input: {
            targetID: this.materialID,
            xAxis: 'Date',
            yAxis: 'Yield',
            duration: [t]
          }
        }
      }
    }
  },
  watch: {
    echartsResult(val) {
      if (val) {
        var options = {
          title: this.assembleTitle(),
          xAxis: this.assembleXAxis(val.xAxisData),
          yAxis: this.assembleYAxis(),
          series: this.assembleSeries(val.seriesData)
        }

        console.log(options)
        this.chart.clear()
        this.chart.setOption(options)
      }
    }
  },
  methods: {
    assembleYAxis() {
      return {
        type: 'value'
      }
    },
    assembleXAxis(data) {
      return {
        data,
        type: 'category',
        axisLabel: {
          rotate: -45,
          formatter(value) {
            return value
              .slice(0, 10)
              .replace('-', '/')
              .replace('-', '/')
          }
        }
      }
    },
    assembleTitle() {
      return {
        text: '最近一周良率(Yield in the last week)'
      }
    },
    assembleSeries(dataset) {
      var data = dataset.data || []
      return [
        {
          data,
          type: 'bar',
          label: {
            show: true,
            position: 'top'
          },
          barWidth: 20
        }
      ]
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
  }
}
</script>
<style lang="scss">
.material-recent-bar {
  height: 100%;
  padding-top: 40px;
  box-sizing: border-box;

  .chart {
    height: 100%;
  }
}
</style>
