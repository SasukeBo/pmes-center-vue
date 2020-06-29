<template>
  <div class="device-custom-yield-bar">
    <div class="custom-chart__head">
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
            <el-option
              v-for="(k, v) in attributesMap"
              :key="'xaxis_' + v"
              :label="k"
              :value="v"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Y轴" prop="yAxis">
          <el-select v-model="echartsForm.yAxis" placeholder="请选择Y轴属性">
            <el-option label="产量" value="Amount"></el-option>
            <el-option label="良率" value="Yield"></el-option>
            <el-option label="不良率" value="UnYield"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分组字段" prop="groupBy">
          <el-select
            v-model="echartsForm.groupBy"
            placeholder="请选择分组字段"
            clearable
          >
            <el-option
              v-for="(k, v) in attributesMap"
              :key="'groupby_' + v"
              :label="k"
              :value="v"
            ></el-option>
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
  name: 'DeviceCustomYieldBar',
  props: {
    id: [String, Number]
  },
  data() {
    var checkUniqueAttributeForXAxisAndGroupBy = (rule, value, callback) => {
      if (this.echartsForm.xAxis === this.echartsForm.groupBy) {
        callback(new Error('X轴属性与分组属性不能相同'))
      } else {
        callback()
      }
    }
    return {
      echartsFormVisible: false,
      echartsForm: {
        xAxis: 'Date',
        yAxis: 'Yield',
        groupBy: undefined,
        duration: [],
        limit: 20,
        sort: 'ASC'
      },
      rules: {
        xAxis: [
          { required: true, message: 'X轴属性必选', trigger: 'blur' },
          { validator: checkUniqueAttributeForXAxisAndGroupBy, trigger: 'blur' }
        ],
        yAxis: [{ required: true, message: 'Y轴属性必选', trigger: 'blur' }],
        groupBy: [
          { validator: checkUniqueAttributeForXAxisAndGroupBy, trigger: 'blur' }
        ]
      },
      form: {
        xAxis: 'Date',
        yAxis: 'Yield',
        groupBy: 'jig_id',
        duration: [],
        limit: 20,
        sort: 'ASC'
      },
      attributesMap: {
        Date: '日期',
        jig_id: '冶具号',
        shift_number: '班别',
        line_id: '线体号',
        mould_id: '模具号'
      },
      yAxisNameMap: {
        Amount: '产量',
        Yield: '良率',
        UnYield: '不良率'
      },
      echartsResult: {
        xAxisData: [],
        seriesData: {
          data: []
        }
      },
      yieldChart: undefined
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
        return {
          input: {
            targetID: this.id,
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
      // this.$refs['custom-graph-form'].resetFields()
      this.echartsFormVisible = false
    },
    submit() {
      this.$refs['custom-graph-form'].validate((valid) => {
        if (valid) {
          this.form.xAxis = this.echartsForm.xAxis
          this.form.yAxis = this.echartsForm.yAxis
          this.form.groupBy = this.echartsForm.groupBy
            ? this.echartsForm.groupBy
            : undefined
          this.form.duration = this.echartsForm.duration
          this.form.limit = this.echartsForm.limit
          this.form.sort = this.echartsForm.sort
          this.echartsFormVisible = false
        }
      })
    },
    assembleSeries(seriesData) {
      var keys = Object.keys(seriesData)
      if (keys.length === 0) {
        return [{ data: [], name: 'data', type: 'bar' }]
      }

      return keys.map((k) => {
        var data = seriesData[k].map((item) => {
          if (this.form.yAxis !== 'Amount') return (item * 100).toFixed(2)
          return item
        })

        return {
          data,
          type: 'line',
          name: k,
          barMaxWidth: 20
        }
      })
    },
    assembleXAxis(data) {
      if (this.form.xAxis === 'Date') {
        data = data.map((d) => {
          var t = new Date(d)
          return t.toLocaleDateString()
        })
      }
      return {
        data,
        name: this.attributesMap[this.form.xAxis],
        type: 'category'
      }
    },
    assembleYAxis() {
      return {
        name: this.yAxisNameMap[this.form.yAxis],
        type: 'value',
        scale: true,
        max: this.form.yAxis === 'Yield' ? 100 : undefined,
        axisLabel: {
          formatter: this.form.yAxis !== 'Amount' ? '{value}%' : '{value}'
        }
      }
    }
  },
  watch: {
    echartsResult(nv) {
      if (nv) {
        var options = {
          title: {
            text: '自定义数据图表'
          },
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
          }
        }

        options.title.subtext = `${this.form.sort === 'ASC' ? '最小' : '最大'}${
          this.form.limit ? '前' + this.form.limit + '项' : '前N项'
        }${this.yAxisNameMap[this.form.yAxis]}`
        options.xAxis = this.assembleXAxis(nv.xAxisData)
        options.yAxis = this.assembleYAxis()
        options.series = this.assembleSeries(nv.seriesData)
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
.device-custom-yield-bar {
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
    text-align: right;

    .title {
      color: #666;
      flex: 1;
      font-size: 20px;
    }
  }
}
</style>
