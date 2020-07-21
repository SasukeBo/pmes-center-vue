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
      <el-form
        :model="echartsForm"
        ref="graph-filter-form"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
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
import { SeriesDataValueItemStyle } from '@/helpers.js'

export default {
  name: 'TopYieldDevice',
  props: {
    id: [String, Number]
  },
  data() {
    var t = new Date()
    t.setMonth(t.getMonth() - 1)
    t.setHours(0, 0, 0, 0)

    return {
      formVisible: false,
      echartsForm: {
        yAxis: 'Yield',
        duration: [t],
        limit: 20,
        sort: 'ASC'
      },
      form: {
        yAxis: 'Yield',
        duration: [t],
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
        Amount: '产量(Amount)',
        Yield: '良率(Yield)',
        UnYield: '不良率(Reject Ratio)'
      },
      yieldChart: undefined,
      yields: []
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
    },
    setSeries(data) {
      var values = data.map((value, i) => {
        if (this.form.yAxis !== 'Amount') {
          value = (value * 100).toFixed(2)
        }
        if (i < 3) {
          return SeriesDataValueItemStyle(value, '#D92622', '#E04660', 'linear')
        } else if (i < 8) {
          return SeriesDataValueItemStyle(value, '#FFB763', '#E04660', 'linear')
        }
        return value
      })

      var name = `设备检测${this.yAxisNameMap[this.form.yAxis]}`
      var label = {
        show: true,
        position: 'top',
        formatter: this.form.yAxis === 'Amount' ? '{c}个' : '{c}%'
      }

      return [
        {
          name,
          data: values,
          type: 'bar',
          barMaxWidth: 20,
          label
        }
      ]
    },
    setYAxis(data) {
      var name = this.yAxisNameMap[this.form.yAxis]
      var max, min
      var formatter = '{value}'
      if (this.form.yAxis !== 'Amount') {
        max = 100
        formatter = '{value}%'
        if (data.length > 0) {
          if (this.form.sort === 'ASC') {
            min = parseInt(data[0] * 70)
          } else {
            min = parseInt(data[data.length - 1] * 70)
          }
        }
      }

      return {
        name,
        max,
        min,
        nameLocation: 'center',
        nameGap: 50,
        type: 'value',
        scale: true,
        axisLabel: { formatter }
      }
    },
    setTooltip(amountData) {
      var _this = this
      var formatter = function(params) {
        var message = `
        <div>
        <span style="display: inline-block; background: red;width: 8px;height: 8px; border-radius: 50%;vertical-align: center;"></span>
        <span style="font-weight: bolder">${params.name}</span>
        </div>
        <div>
        <span style="font-size: 12px; font-weight: bold">${params.seriesName}:</span>
        `
        var rest
        if (_this.form.yAxis === 'Amount') {
          rest = `
          <span>${params.value}个</span>
          </div>
          `
        } else {
          rest = `
          <span>${params.value}%</span>
          </div>
          <div>
          <span style="font-size: 12px; font-weight: bold">设备总检测量(Amount):</span>
          <span>${amountData[params.dataIndex]}个</span>
          </div>
          `
        }
        return message + rest
      }

      return { formatter }
    },
    setTitle() {
      var subtext = `${this.yAxisNameMap[this.form.yAxis]}${
        this.form.sort === 'ASC' ? '最低的' : '最高的'
      }${this.form.limit}个设备`
      return {
        text: '检测设备数据',
        subtext
      }
    },
    setXAxis(data) {
      return {
        name: '检测设备(Devices)',
        type: 'category',
        axisLabel: { interval: 0, rotate: -45 },
        data
      }
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
        var data = nv.seriesData.data || []
        var amountData = nv.seriesAmountData.data || []
        var options = {}
        options.series = this.setSeries(data)
        options.yAxis = this.setYAxis(data)
        options.tooltip = this.setTooltip(amountData)
        options.title = this.setTitle()
        options.xAxis = this.setXAxis(nv.xAxisData)
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
