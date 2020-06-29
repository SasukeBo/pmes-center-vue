<template>
  <div
    class="device-recent-date-yield-bar"
    v-loading="$apollo.queries.echartsResult.loading"
  >
    <div class="y-axis-select">
      <el-select v-model="yAxis" size="mini">
        <el-option label="产量" value="Amount"></el-option>
        <el-option label="良率" value="Yield"></el-option>
        <el-option label="不良率" value="UnYield"></el-option>
      </el-select>
    </div>

    <div class="yield-chart-mount" ref="chart"></div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import echarts from 'echarts'

export default {
  name: 'DeviceRecentDateYieldBar',
  props: {
    id: [Number, String]
  },
  data() {
    return {
      echartsResult: {
        xAxisData: [],
        seriesData: {}
      },
      yAxis: 'Yield',
      chart: undefined,
      yAxisNameMap: {
        Amount: '产量',
        Yield: '良率',
        UnYield: '不良率'
      }
    }
  },
  apollo: {
    echartsResult: {
      query: gql`
        query($input: GroupAnalyzeInput!) {
          echartsResult: groupAnalyzeDevice(analyzeInput: $input) {
            xAxisData
            seriesData
          }
        }
      `,
      variables() {
        var t = new Date()
        t.setDate(t.getDate() - 7)

        return {
          input: {
            targetID: this.id,
            xAxis: 'Date',
            yAxis: this.yAxis,
            duration: [t]
          }
        }
      }
    }
  },
  methods: {
    assembleSeries(seriesData) {
      var keys = Object.keys(seriesData)
      return keys.map((k) => {
        var data = seriesData[k].map((item) => {
          if (this.yAxis !== 'Amount') return (item * 100).toFixed(2)
          return item
        })

        return {
          data,
          type: 'bar',
          name: k,
          barMaxWidth: 20
        }
      })
    },
    assembleYAxis() {
      return {
        name: this.yAxisNameMap[this.yAxis],
        type: 'value',
        scale: true,
        max: this.yAxis !== 'Amount' ? 100 : undefined,
        axisLabel: {
          formatter: this.yAxis !== 'Amount' ? '{value}%' : '{value}'
        }
      }
    }
  },
  watch: {
    echartsResult(nv) {
      if (nv) {
        var options = {
          legend: {},
          title: {
            text: '近一周生产数据'
          },
          toolbox: {
            feature: {
              magicType: {
                type: ['line', 'bar']
              },
              saveAsImage: {}
            }
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          xAxis: {
            name: '日期',
            type: 'category',
            axisLabel: {
              formatter: function(value) {
                var date = new Date(value)
                return date.toLocaleDateString()
              }
            }
          }
        }
        options.xAxis.data = nv.xAxisData
        options.yAxis = this.assembleYAxis()
        options.series = this.assembleSeries(nv.seriesData)
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
.device-recent-date-yield-bar {
  padding: 16px;
  background: #fff;
  margin-bottom: 16px;
  border-radius: 4px;
  position: relative;

  .yield-chart-mount {
    height: 400px;
    width: 100%;
  }

  &.loading {
    height: 100px;

    .el-loading-mask {
      background: transparent;
    }
  }

  .y-axis-select {
    text-align: right;
    padding-bottom: 8px;
  }
}
</style>
