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
        query($input: GraphInput!) {
          echartsResult: groupAnalyzeDevice(analyzeInput: $input) {
            xAxisData
            seriesData
            seriesAmountData
          }
        }
      `,
      variables() {
        var t = new Date()
        t.setMonth(t.getMonth() - 3)

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

        var label = {
          show: true,
          position: 'top',
          formatter: this.yAxis === 'Amount' ? '{c}个' : '{c}%'
        }

        return {
          data,
          label,
          type: 'bar',
          name: k,
          barMaxWidth: 20
        }
      })
    },
    assembleYAxis(data) {
      var max, min
      var formatter = '{value}'
      if (this.yAxis !== 'Amount') {
        max = 100
        formatter = '{value}%'
        if (data.length > 0) {
          min = parseInt(data[0] * 70)
        }
      }

      return {
        min,
        max,
        name: this.yAxisNameMap[this.yAxis],
        type: 'value',
        scale: true,
        axisLabel: { formatter }
      }
    },
    assembleXAxis(data) {
      return {
        name: '日期',
        type: 'category',
        data,
        axisLabel: {
          formatter: function(value) {
            var date = new Date(value)
            return date.toLocaleDateString()
          }
        }
      }
    },
    assembleTooltip(data) {
      var _this = this
      var formatter = function(params) {
        var param = params[0]
        var date = new Date(param.name)

        return `
        <div>
        <span style="display: inline-block; vertical-align: center; width: 8px; height: 8px; border-radius: 50%; background: ${
          param.color
        }"></span>
        <span>${date.toLocaleDateString()}</span>
        </div>
        <div style="display: ${_this.yAxis === 'Amount' ? 'none' : 'block'}">
          <span>${_this.yAxisNameMap[_this.yAxis]}: ${param.value}%</span>
        </div>
        <div>
          <span>总产量: ${data.data[param.dataIndex]}个</span>
        </div>
        `
      }

      return {
        show: true,
        trigger: 'axis',
        formatter,
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          },
          label: {
            formatter: function(param) {
              if (param.axisDimension === 'x') {
                var date = new Date(param.value)
                return date.toLocaleDateString()
              }
              return param.value.toFixed(2)
            }
          }
        }
      }
    }
  },
  watch: {
    echartsResult(nv) {
      if (nv) {
        var options = {
          title: {
            text: '近三个月生产数据'
          },
          toolbox: {
            feature: {
              magicType: {
                type: ['line', 'bar']
              },
              saveAsImage: {}
            }
          },
          tooltip: this.assembleTooltip(nv.seriesAmountData),
          xAxis: this.assembleXAxis(nv.xAxisData),
          yAxis: this.assembleYAxis(nv.seriesData.data || []),
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
