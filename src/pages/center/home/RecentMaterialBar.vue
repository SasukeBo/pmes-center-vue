<template>
  <div
    class="material-recent-bar"
    v-loading="$apollo.queries.echartsResult.loading"
  >
    <div
      class="chart-empty"
      v-if="
        !echartsResult ||
          !echartsResult.xAxisData ||
          echartsResult.xAxisData.length === 0
      "
    >
      暂无数据
    </div>
    <div class="chart" ref="chart"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import gql from 'graphql-tag'
import { SeriesDataValueItemStyle } from '@/utils/helpers.js'

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
        t.setDate(t.getDate() - 7)
        t.setHours(0, 0, 0, 0)
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
          grid: this.assembleGrid(),
          title: this.assembleTitle(),
          xAxis: this.assembleXAxis(val.xAxisData),
          yAxis: this.assembleYAxis(),
          series: this.assembleSeries(val.seriesData),
          tooltip: this.assembleTooltip(val.seriesAmountData)
        }

        this.chart.clear()
        this.chart.setOption(options)
      }
    }
  },
  methods: {
    assembleTooltip({ data }) {
      var formatter = function(args) {
        var params = args[0]
        var name = params.name
          .slice(0, 10)
          .replace('-', '/')
          .replace('-', '/')

        return `
        <span style="display: inline-block; width: 8px;height: 8px;border-radius: 50%; background: #8C33DE; margin-right: 8px"></span>${name}<br>
        良率(Yield): ${(params.data * 100).toFixed(2)}%<br>
        产量(Amount): ${data[params.dataIndex]}
        `
      }
      return {
        formatter,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: '#000',
            opacity: 0.06
          }
        }
      }
    },
    assembleGrid() {
      return {
        left: '45px',
        top: '35px',
        right: 1,
        bottom: 91
      }
    },
    assembleYAxis() {
      return {
        type: 'value',
        axisLabel: {
          color: '#333333',
          formatter: function(value) {
            return (value * 100).toFixed(0) + '%'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#CCCCCC',
            type: 'dashed'
          }
        },
        axisTick: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#CCCCCC',
            type: 'dashed'
          }
        }
      }
    },
    assembleXAxis(data) {
      return {
        data,
        type: 'category',
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: '#CCCCCC',
            type: 'dashed'
          }
        },
        axisLabel: {
          rotate: -45,
          color: '#333333',
          formatter(value) {
            return value
              .slice(0, 10)
              .replace('-', '/')
              .replace('-', '/')
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#CCCCCC',
            type: 'dashed'
          }
        }
      }
    },
    assembleTitle() {
      return {
        top: 0,
        left: 38,
        text: '最近一周良率(Yield in the last week)',
        textStyle: {
          color: '#333',
          fontSize: 16,
          fontWeight: 400
        }
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
            position: 'top',
            formatter: function({ value }) {
              return (value * 100).toFixed(2) + '%'
            }
          },
          barWidth: 20,
          itemStyle: SeriesDataValueItemStyle(
            'rgba(3,100,255,1)',
            'rgba(140,51,222,1)',
            'linear'
          )
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
  position: relative;

  .chart {
    height: 100%;
  }

  .chart-empty {
    position: absolute;
    left: 50%;
    top: 50%;
    color: #999;
  }
}
</style>
