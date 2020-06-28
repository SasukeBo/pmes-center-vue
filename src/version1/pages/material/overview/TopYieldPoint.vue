<template>
  <div
    class="top-yield-point-chart"
    v-loading="$apollo.queries.sizeUnYieldResult.loading"
  >
    <el-form inline size="mini" class="inline-filter">
      <el-form-item>
        <el-checkbox v-model="sort">递减</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-input-number
          v-model="limit"
          controls-position="right"
          :min="10"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker
          size="mini"
          v-model="duration"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="yield-chart-mount" ref="chart"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import gql from 'graphql-tag'
export default {
  name: 'TopYieldPoint',
  props: {
    id: [Number, String]
  },
  data() {
    return {
      yieldChart: undefined,
      sizeUnYieldResult: [],
      duration: [],
      limit: 20,
      sort: true,
      options: {
        tooltip: {
          show: true
        },
        color: ['#3FE3D3', '#5E83F2'],
        title: {
          text: '点位不良率',
          subtext: '不良率最高的前20个检测点位'
        },
        xAxis: {
          name: '点位',
          type: 'category',
          axisLabel: { interval: 0, rotate: -45 }
        },
        yAxis: [
          {
            name: '百分比',
            nameLocation: 'center',
            nameGap: 50,
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '点位不良率',
            barMaxWidth: 20
          }
        ]
      }
    }
  },
  apollo: {
    sizeUnYieldResult: {
      query: gql`
        query($input: GroupAnalyzeInput!) {
          sizeUnYieldResult: sizeUnYieldTop(groupInput: $input) {
            xAxisData
            seriesData
          }
        }
      `,
      variables() {
        return {
          input: {
            targetID: this.id,
            yAxis: 'UnYield',
            xAxis: 'Date',
            duration: this.duration,
            limit: this.limit,
            sort: this.sort ? 'DESC' : 'ASC'
          }
        }
      }
    }
  },
  watch: {
    sizeUnYieldResult(nv) {
      if (nv) {
        var data = nv.seriesData.data || []
        var values = data.map((value, i) => {
          value = (value * 100).toFixed(2)
          if (i < 3) {
            return {
              value,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#D92622' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#E04660' // 100% 处的颜色
                    }
                  ]
                }
              }
            }
          } else if (i < 8) {
            return {
              value,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#FFB763' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#E04660' // 100% 处的颜色
                    }
                  ]
                }
              }
            }
          }

          return value
        })
        this.options.tooltip.formatter = function(params) {
          return `
          <div>${params.name}</div>
          <div>${params.seriesName}：${params.value}%</div>
          `
        }
        this.options.xAxis.data = nv.xAxisData
        this.options.series[0].data = values
        this.yieldChart.clear()
        this.yieldChart.setOption(this.options)
      }
    }
  },
  mounted() {
    this.yieldChart = echarts.init(this.$refs.chart)
  }
}
</script>
<style lang="scss">
.top-yield-point-chart {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
  position: relative;

  .inline-filter {
    position: absolute;
    right: 16px;
    z-index: 1000;
  }

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
}
</style>
