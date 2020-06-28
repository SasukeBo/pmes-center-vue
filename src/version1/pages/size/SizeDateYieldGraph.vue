<template>
  <div
    class="size-date-yield-graph"
    v-loading="$apollo.queries.echartResults.loading"
  >
    <div class="filter-form">
      <span class="title">尺寸每日{{ yAxisNameMap[form.yAxis] }}</span>

      <el-form inline size="mini">
        <el-form-item label="分组">
          <el-select v-model="form.groupBy" clearable>
            <el-option
              v-for="(v, k) in attributesMap"
              :key="k"
              :label="v"
              :value="k"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.yAxis">
            <el-option
              v-for="(v, k) in yAxisNameMap"
              :key="k"
              :label="v"
              :value="k"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            size="mini"
            v-model="form.duration"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="yield-chart-mount" ref="chart"></div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import echarts from 'echarts'

export default {
  name: 'SizeDateYieldGraph',
  props: {
    id: [Number, String]
  },
  data() {
    return {
      echartResults: {},
      yieldChart: undefined,
      form: {
        yAxis: 'UnYield',
        groupBy: 'line_id',
        duration: []
      },
      yAxisNameMap: {
        Yield: '良率',
        UnYield: '不良率'
      },
      attributesMap: {
        Device: '设备',
        jig_id: '冶具号',
        shift_number: '班别',
        line_id: '线体号',
        mould_id: '模具号'
      }
    }
  },
  apollo: {
    echartResults: {
      query: gql`
        query($input: GroupAnalyzeInput!) {
          echartResults: groupAnalyzeSize(analyzeInput: $input) {
            xAxisData
            seriesData
          }
        }
      `,
      variables() {
        return {
          input: {
            targetID: this.id,
            xAxis: 'Date',
            yAxis: this.form.yAxis,
            groupBy: this.form.groupBy,
            duration: this.form.duration
          }
        }
      }
    }
  },
  methods: {
    assembleSeries(seriesData) {
      var keys = Object.keys(seriesData)
      var type = 'bar'
      if (keys.length === 0) {
        return [{ data: [], name: 'data', type: 'bar' }]
      }
      if (keys.length > 1) type = 'line'

      return keys.map((k) => {
        var data = seriesData[k].map((item) => {
          return (item * 100).toFixed(2)
        })
        var name = k
        if (this.form.groupBy === 'Date') {
          var t = new Date(name)
          name = t.toLocaleDateString()
        }

        return {
          name,
          data,
          type,
          barMaxWidth: 20
        }
      })
    }
  },
  watch: {
    echartResults(nv) {
      if (nv) {
        var options = {
          legend: {},
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
            type: 'category'
          },
          yAxis: {
            name: '百分比',
            nameLocation: 'center',
            nameGap: 50,
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: '{value}%'
            }
          },
          series: [
            {
              type: 'bar',
              barMaxWidth: 20
            }
          ]
        }
        options.xAxis.data = nv.xAxisData.map((i) => {
          var t = new Date(i)
          return t.toLocaleDateString()
        })
        options.series = this.assembleSeries(nv.seriesData)
        options.yAxis.name = this.yAxisNameMap[this.form.yAxis]
        options.yAxis.axisLabel.formatter = '{value}%'
        if (this.form.yAxis === 'Yield') {
          options.yAxis.max = 100
        }

        this.yieldChart.clear()
        this.yieldChart.setOption(options)
      }
    }
  },
  mounted() {
    this.yieldChart = echarts.init(this.$refs.chart)
  }
}
</script>
<style lang="scss">
.size-date-yield-graph {
  padding: 16px;
  background: #fff;
  margin-bottom: 16px;
  border-radius: 4px;
  position: relative;
  height: 400px;

  .yield-chart-mount {
    height: 80%;
    width: 100%;
  }

  &.loading {
    height: 100px;

    .el-loading-mask {
      background: transparent;
    }
  }

  .filter-form {
    display: flex;

    .title {
      flex: 1;
      font-size: 19px;
      font-weight: bold;
      color: #666;
      padding-left: 16px;
    }
  }
}
</style>
