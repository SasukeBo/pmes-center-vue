<template>
  <div class="top-yield-custom-chart">
    <div class="custom-chart__head">
      <span class="title">自定义分组良率展示</span>
      <el-button size="small" @click="echartsFormVisible = true"
        >自定义</el-button
      >
    </div>

    <div
      class="yield-chart-mount"
      ref="chart"
      v-loading="$apollo.queries.echartsResult.loading"
    ></div>

    <el-dialog title="自定义图表" :visible.sync="echartsFormVisible">
      <el-form :model="echartsForm" ref="custom-graph-form" :rules="rules">
        <el-form-item label="X轴" prop="xAxis">
          <el-select v-model="echartsForm.xAxis" placeholder="请选择X轴属性">
            <el-option label="设备" value="Device"></el-option>
            <el-option label="日期" value="Date"></el-option>
            <el-option label="冶具号" value="jig_id"></el-option>
            <el-option label="班别" value="shift_number"></el-option>
            <el-option label="线体号" value="line_id"></el-option>
            <el-option label="模具号" value="mould_id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Y轴" prop="yAxis">
          <el-select v-model="echartsForm.yAxis" placeholder="请选择Y轴属性">
            <el-option label="产量" value="Amount"></el-option>
            <el-option label="良率" value="Yield"></el-option>
            <el-option label="不良率" value="Unyield"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分组字段" prop="groupBy">
          <el-select v-model="echartsForm.groupBy" placeholder="请选择分组字段">
            <el-option label="设备" value="Device"></el-option>
            <el-option label="日期" value="Date"></el-option>
            <el-option label="冶具号" value="jig_id"></el-option>
            <el-option label="班别" value="shift_number"></el-option>
            <el-option label="线体号" value="line_id"></el-option>
            <el-option label="模具号" value="mould_id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期范围">
          <el-date-picker
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

        <el-form-item label="正/倒序">
          <el-switch
            v-model="echartsForm.sort"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="ASC"
            inactive-value="DESC"
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
  name: 'TopYieldCustom',
  props: {
    id: [String, Number]
  },
  data() {
    return {
      echartsFormVisible: false,
      echartsForm: {
        xAxis: 'Device',
        yAxis: 'Yield',
        groupBy: undefined,
        duration: [],
        limit: undefined,
        sort: 'ASC'
      },
      rules: {
        xAxis: [{ required: true, message: 'X轴属性必选', trigger: 'blur' }],
        yAxis: [{ required: true, message: 'Y轴属性必选', trigger: 'blur' }]
      },
      form: {
        xAxis: 'Device',
        yAxis: 'Yield',
        groupBy: undefined,
        duration: [],
        limit: undefined,
        sort: 'ASC'
      },
      echartsResult: {
        xAxisData: [],
        seriesData: {
          data: []
        }
      },
      yieldChart: undefined,
      yields: [],
      options: {
        tooltip: {
          show: true
        },
        color: ['#3FE3D3', '#5E83F2'],
        xAxis: {
          name: '设备',
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
            name: '设备生产不良率',
            barMaxWidth: 20
          }
        ]
      }
    }
  },
  apollo: {
    echartsResult: {
      query: gql`
        query($input: AnalyzeMaterialInput!) {
          echartsResult: groupAnalyzeMaterial(analyzeInput: $input) {
            xAxisData
            seriesData
          }
        }
      `,
      variables() {
        return {
          input: {
            materialID: this.id,
            xAxis: this.form.xAxis,
            yAxis: this.form.yAxis,
            groupBy: this.form.groupBy,
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
      this.$refs['custom-graph-form'].resetField()
      this.echartsFormVisible = false
    },
    submit() {
      this.$refs['custom-graph-form'].validate((valid) => {
        if (valid) {
          this.form.xAxis = this.echartsForm.xAxis
          this.form.yAxis = this.exhartsForm.yAxis
          this.form.groupBy = this.exhartsForm.groupBy
          this.form.duration = this.exhartsForm.duration
          this.form.limit = this.exhartsForm.limit
          this.form.sort = this.exhartsForm.sort
          this.echartsFormVisible = false
        }
      })
    }
  },
  watch: {
    echartsResult(nv) {
      if (nv) {
        var values = nv.seriesData.data.map((item, i) => {
          var rate = ((1 - item) * 100).toFixed(2)
          if (i < 3) {
            return {
              value: rate,
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
              value: rate,
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

          return rate
        })
        this.options.tooltip.formatter = function(params) {
          return `
          <div>${params.name}</div>
          <div>${params.seriesName}：${params.value}%</div>
          `
        }
        this.options.xAxis.data = nv.xAxisData
        this.options.series[0].data = values
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
.top-yield-custom-chart {
  padding: 16px;
  background: #fff;
  margin-top: 32px;
  border-radius: 4px;

  .yield-chart-mount {
    height: 400px;
    width: 100%;
  }

  .loading {
    height: 100px;

    .el-loading-mask {
      background: transparent;
    }
  }

  .custom-chart__head {
    display: flex;

    .title {
      color: #666;
      flex: 1;
      font-size: 20px;
    }
  }
}
</style>
