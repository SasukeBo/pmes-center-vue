<template>
  <div class="top-yield-material-chart">
    <div class="top-yield-material-chart__title">近一周·top20不良料号</div>
    <div
      class="top-yield-material-chart__mount"
      ref="chart"
      v-loading="$apollo.queries.echartsResult.loading"
    ></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import gql from 'graphql-tag'
import { SeriesDataValueItemStyle } from '@/utils/helpers.js'

export default {
  name: 'TopYieldMaterialChart',
  data() {
    return {
      chart: undefined,
      echartsResult: {
        xAxisData: [],
        seriesData: {
          data: []
        }
      }
    }
  },
  apollo: {
    echartsResult: {
      query: gql`
        query($duration: [Time]!, $limit: Int!) {
          echartsResult: materialYieldTop(duration: $duration, limit: $limit) {
            xAxisData
            seriesData
          }
        }
      `,
      variables() {
        var t = new Date()
        t.setDate(t.getDate() - 7)
        t.setHours(0, 0, 0, 0)
        return {
          duration: [t],
          limit: 20
        }
      }
    }
  },
  methods: {
    assembleSeries(seriesData) {
      var data = seriesData.data || []
      var values = data.map((item, i) => {
        var value = (item * 100).toFixed(2)
        var itemStyle

        if (i < 3) {
          itemStyle = SeriesDataValueItemStyle('#D92622', '#E04660', 'linear')
        } else if (i < 8) {
          itemStyle = SeriesDataValueItemStyle('#FFB763', '#E04660', 'linear')
        } else {
          return value
        }

        return {
          value,
          itemStyle
        }
      })

      return [
        {
          data: values,
          type: 'bar',
          name: '料号不良率',
          barMaxWidth: 20
        }
      ]
    },
    assembleXAxis(data) {
      return {
        data,
        name: '料号',
        type: 'category',
        axisLabel: { interval: 0, rotate: -45 }
      }
    },
    assembleYAxis() {
      return {
        name: '百分比',
        nameLocation: 'center',
        nameGap: 50,
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: '{value}%'
        }
      }
    },
    assembleTooltip() {
      return {
        show: true,
        formatter(params) {
          return `
          <div>${params.name}</div>
          <div>${params.seriesName}：${params.value}%</div>
          `
        }
      }
    }
  },
  watch: {
    echartsResult(nv) {
      if (nv) {
        var options = {
          tooltip: this.assembleTooltip(),
          color: ['#3FE3D3', '#5E83F2'],
          title: {
            text: '料号监测',
            subtext: '前20最低良率料号'
          },
          yAxis: this.assembleYAxis(),
          xAxis: this.assembleXAxis(nv.xAxisData),
          series: this.assembleSeries(nv.seriesData)
        }
        this.chart.clear()
        this.chart.setOption(options)
      }
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
  }
}
</script>
<style lang="scss">
.top-yield-material-chart {
  height: 400px;
  width: 100%;
  .top-yield-material-chart__title {
    line-height: 16px;
    padding: 16px 0;
    font-size: 16px;
    font-weight: bold;
    color: #666;
  }
  .top-yield-material-chart__mount {
    padding: 16px;
    box-sizing: border-box;
    height: calc(100% - 48px);
    background: #fff;
    border-radius: 4px;
  }
}
</style>
