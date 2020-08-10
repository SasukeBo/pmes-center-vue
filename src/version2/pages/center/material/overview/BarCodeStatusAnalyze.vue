<template>
  <div
    class="barcode-status-analyze"
    v-loading="$apollo.queries.chartResult.loading"
  >
    <div class="duration-picker">
      <el-date-picker
        v-model="duration"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
    </div>
    <div class="analyze-yield-pie">
      <div ref="pie-chart" class="pie-amount"></div>
      <div class="yield" v-if="chartResult">
        <div style="font-size: 18px">条码识别良率</div>
        Yield: {{ (chartResult.yield * 100).toFixed(2) }}%
      </div>
      <div class="attributes" v-if="chartResult">
        总量: {{ chartResult.amount }}
      </div>
    </div>
    <div class="analyze-yield-bar">
      <div ref="bar-chart" class="bar-amount"></div>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import echarts from 'echarts'
import { SeriesDataValueItemStyle } from '@/helpers.js'

export default {
  name: 'BarCodeStatusAnalyze',
  props: {
    id: [Number, String],
    versionID: [Number, String]
  },
  data() {
    var t = new Date()
    t.setDate(t.getDate() - 7)
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      pieChart: undefined,
      barChart: undefined,
      duration: [t],
      chartResult: undefined,
      statusCodeMap: {
        Illegal: '值非法',
        TooShort: '长度错误',
        ReadError: '读取错误',
        NoItems: '规则无解析项'
      }
    }
  },
  apollo: {
    chartResult: {
      query: gql`
        query($materialID: Int!, $versionID: Int, $duration: [Time]!) {
          chartResult: barCodeStatusAnalyze(
            materialID: $materialID
            versionID: $versionID
            duration: $duration
          ) {
            yield
            amount
            failedYields
            failedAmounts
            failedLabels
          }
        }
      `,
      variables() {
        return {
          materialID: this.id,
          versionID: this.versionID,
          duration: this.duration
        }
      }
    }
  },
  watch: {
    chartResult: {
      immediate: true,
      handler: function(val) {
        if (val) {
          var ok = parseInt(val.amount * val.yield)
          var ng = val.amount - ok
          var pieOption = {
            color: ['#FFBA30', 'rgba(255, 186, 48, 0.21)'],
            series: [
              {
                name: '识别码良率(Yield of bar code scaning',
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
                data: [ok, ng]
              }
            ]
          }
          this.pieChart.setOption(pieOption)

          var options = {
            grid: this.assembleGrid(),
            title: this.assembleTitle(),
            xAxis: this.assembleXAxis(val.failedLabels),
            yAxis: this.assembleYAxis(),
            series: this.assembleSeries(val.failedYields),
            tooltip: this.assembleTooltip(val.failedAmounts)
          }

          this.barChart.clear()
          this.barChart.setOption(options)
        }
      }
    }
  },
  methods: {
    assembleTooltip(data) {
      var formatter = function(args) {
        var params = args[0]

        return `
        <span style="display: inline-block; width: 8px;height: 8px;border-radius: 50%; background: #8C33DE; margin-right: 8px"></span>${
          params.name
        }<br>
        占比(Yield): ${(params.data * 100).toFixed(2)}%<br>
        数量(Amount): ${data[params.dataIndex]}
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
    assembleSeries(dataset) {
      var data = dataset || []
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
      var _this = this
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
          rotate: 0,
          color: '#333333',
          formatter(val) {
            return `${_this.statusCodeMap[val]}\n(${val})`
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
        text: '识别码扫描错误原因分布',
        textStyle: {
          color: '#333',
          fontSize: 16,
          fontWeight: 500
        },
        subtext: '默认时间范围为最近一周',
        subtextStyle: {
          color: '#666',
          fontSize: 14,
          fontWeight: 400
        }
      }
    },
    assembleGrid() {
      return {
        left: '45px',
        top: '60px',
        right: 1,
        bottom: 40
      }
    }
  },
  mounted() {
    this.pieChart = echarts.init(this.$refs['pie-chart'])
    this.barChart = echarts.init(this.$refs['bar-chart'])
  }
}
</script>
<style lang="scss">
.barcode-status-analyze {
  width: 100%;
  height: 400px;
  padding: 16px;
  background: #fff;
  margin-bottom: 16px;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  position: relative;

  .analyze-yield-pie {
    margin-right: 24px;
    width: 282px;
    background: linear-gradient(
      180deg,
      rgba(83, 88, 255, 1) 0%,
      rgba(10, 174, 209, 1) 100%
    );
    border-radius: 4px;
    opacity: 0.8;
    text-align: center;

    .pie-amount {
      height: 100px;
      margin-top: 60px;
      margin-bottom: 20px;
    }

    .yield {
      color: #fff;
      font-size: 32px;
      line-height: 45px;
      padding: 8px 0;
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
  }

  .analyze-yield-bar {
    flex: auto;

    .bar-amount {
      height: 100%;
    }
  }

  .duration-picker {
    position: absolute;
    right: 16px;
    z-index: 1000;
  }
}
</style>
