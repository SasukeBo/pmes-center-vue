<template>
  <div
    class="top-yield-device-chart"
    v-loading="$apollo.queries.echartsResult.loading"
  >
    <el-button class="filter-form-btn" size="mini" @click="formVisible = true"
      >筛选条件</el-button
    >
    <div class="yield-chart-mount" ref="chart"></div>

    <el-dialog title="筛选条件" :visible.sync="formVisible">
      <el-form :model="echartsForm" ref="graph-filter-form" :rules="rules">
        <el-form-item label="Y轴" prop="yAxis">
          <el-select v-model="echartsForm.yAxis" placeholder="请选择Y轴属性">
            <el-option label="产量" value="Amount"></el-option>
            <el-option label="良率" value="Yield"></el-option>
            <el-option label="不良率" value="UnYield"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期范围">
          <el-date-picker
            clearable
            v-model="echartsForm.duration"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="数据项数上限">
          <el-input-number
            v-model="echartsForm.limit"
            :min="1"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="排序">
          <el-switch
            v-model="echartsForm.sort"
            active-text="递减"
            inactive-text="递增"
            active-color="#13ce66"
            inactive-color="#5e83f2"
            active-value="DESC"
            inactive-value="ASC"
          >
          </el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import echarts from 'echarts'
import gql from 'graphql-tag'

export default {
  name: 'TopYieldDevice',
  props: {
    id: [String, Number]
  },
  data() {
    return {
      formVisible: false,
      echartsForm: {
        yAxis: 'Yield',
        duration: [],
        limit: 20,
        sort: 'ASC'
      },
      form: {
        yAxis: 'Yield',
        duration: [],
        limit: 20,
        sort: 'ASC'
      },
      rules: {
        yAxis: [
          { required: 'true', message: 'Y轴属性为必选项', trigger: 'blur' }
        ]
      },
      echartsResult: {
        xAxisData: [],
        seriesData: {
          data: []
        }
      },
      yAxisNameMap: {
        Amount: '总产量',
        Yield: '良率',
        UnYield: '不良率'
      },
      yieldChart: undefined,
      yields: []
    }
  },
  apollo: {
    echartsResult: {
      query: gql`
        query($input: GroupAnalyzeInput!) {
          echartsResult: groupAnalyzeMaterial(analyzeInput: $input) {
            xAxisData
            seriesData
          }
        }
      `,
      variables() {
        return {
          input: {
            targetID: this.id,
            xAxis: 'Device',
            yAxis: this.form.yAxis,
            duration: this.form.duration,
            limit: this.form.limit,
            sort: this.form.sort
          }
        }
      }
    }
  },
  methods: {
    cancel() {
      this.formVisible = false
    },
    submit() {
      this.$refs['graph-filter-form'].validate((valid) => {
        if (valid) {
          this.form.yAxis = this.echartsForm.yAxis
          this.form.duration = this.echartsForm.duration
          this.form.limit = this.echartsForm.limit
          this.form.sort = this.echartsForm.sort
          this.formVisible = false
        }
      })
    }
  },
  watch: {
    formVisible(nv) {
      if (nv) {
        this.echartsForm.yAxis = this.form.yAxis
        this.echartsForm.duration = this.form.duration
        this.echartsForm.limit = this.form.limit
        this.echartsForm.sort = this.form.sort
      }
    },
    echartsResult(nv) {
      if (nv) {
        nv.seriesData.data = nv.seriesData.data || []
        var values = nv.seriesData.data.map((value, i) => {
          if (this.form.yAxis !== 'Amount') {
            value = (value * 100).toFixed(2)
          }
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
        var options = {
          tooltip: {
            show: true
          },
          color: ['#3FE3D3', '#5E83F2'],
          title: {
            text: '设备生产数据'
          },
          xAxis: {
            name: '设备',
            type: 'category',
            axisLabel: { interval: 0, rotate: -45 }
          },
          yAxis: {
            name: '百分比',
            nameLocation: 'center',
            nameGap: 50,
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: [
            {
              type: 'bar',
              barMaxWidth: 20
            }
          ]
        }
        var _this = this
        options.tooltip.formatter = function(params) {
          return `
          <div>${params.name}</div>
          <div>${params.seriesName}：${params.value}${
            _this.form.yAxis === 'Amount' ? '个' : '%'
          }</div>
          `
        }
        options.xAxis.data = nv.xAxisData
        options.series[0].data = values
        options.yAxis.name = this.yAxisNameMap[this.form.yAxis]
        if (this.form.yAxis !== 'Amount') {
          options.yAxis.max = 100
          options.yAxis.axisLabel.formatter = '{value}%'
        }
        options.title.subtext = `${options.yAxis.name}${
          this.form.sort === 'ASC' ? '最低的' : '最高的'
        }${this.form.limit}个设备`

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
.top-yield-device-chart {
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

  .filter-form-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1000;
  }
}
</style>
