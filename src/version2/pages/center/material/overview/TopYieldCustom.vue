<template>
  <div class="top-yield-custom-chart">
    <div class="custom-chart__head">
      <span class="title">自定义看板</span>
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
      <el-form
        :model="echartsForm"
        ref="custom-graph-form"
        :rules="rules"
        label-width="200px"
      >
        <el-form-item label="X轴" prop="xAxis">
          <el-select v-model="echartsForm.xAxis" placeholder="请选择X轴属性">
            <el-option label="设备" value="Device"></el-option>
            <el-option label="日期" value="Date"></el-option>
            <el-option label="班别" value="Shift"></el-option>
            <el-option
              v-for="a in attributes"
              :key="a.name"
              :label="a.label"
              :value="a.name"
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
            <el-option label="设备" value="Device"></el-option>
            <el-option label="日期" value="Date"></el-option>
            <el-option label="班别" value="Shift"></el-option>
            <el-option
              v-for="a in attributes"
              :key="a.name"
              :label="a.label"
              :value="a.name"
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

        <el-form-item label="排序(无分组时有效)">
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
  name: 'TopYieldCustom',
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
        groupBy: 'Shift',
        duration: [],
        limit: undefined,
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
        groupBy: 'Shift',
        duration: [],
        limit: undefined,
        sort: 'ASC'
      },
      attributes: [],
      yAxisNameMap: {
        Amount: '产量',
        Yield: '良率',
        UnYield: '不良率'
      },
      shiftNumberMap: {
        A: '白班',
        B: '晚班'
      },
      categoryMap: {
        Date: '日期',
        Device: '设备',
        Shift: '班别'
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
    attributes: {
      query: gql`
        query($materialID: Int!) {
          attributes: productAttributes(materialID: $materialID) {
            label
            name
          }
        }
      `,
      variables() {
        return {
          materialID: this.id
        }
      }
    },
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
        var category = ['Device', 'Date', 'Shift']
        var attributeXAxis, attributeGroup

        var xAxis = this.form.xAxis || undefined
        if (!category.includes(xAxis) && xAxis) {
          attributeXAxis = xAxis
          xAxis = 'Attribute'
        }
        var groupBy = this.form.groupBy || undefined
        if (!category.includes(groupBy) && groupBy) {
          attributeGroup = groupBy
          groupBy = 'Attribute'
        }
        return {
          input: {
            targetID: this.id,
            xAxis,
            attributeXAxis,
            yAxis: this.form.yAxis,
            groupBy,
            attributeGroup,
            duration: this.form.duration,
            limit: this.form.limit,
            sort: this.form.sort
          }
        }
      }
    }
  },
  computed: {
    isRate() {
      return this.form.yAxis !== 'Amount'
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

      return keys.map((name) => {
        var data = seriesData[name].map((item) => {
          if (item === 0) return undefined
          if (this.form.yAxis !== 'Amount') return (item * 100).toFixed(2)
          return item
        })

        var label = {
          show: true,
          position: 'top',
          formatter: this.isRate ? '{c}%' : '{c}个'
        }
        var isLine = keys.length > 2

        return {
          name,
          data,
          smooth: true,
          label: isLine ? undefined : label,
          type: isLine ? 'line' : 'bar',
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
      var name = this.categoryMap[this.form.xAxis]
      if (!name) {
        var index = this.attributes.findIndex((a) => a.name === this.form.xAxis)
        if (index >= 0) {
          name = this.attributes[index].label
        }
      }
      return {
        data,
        name,
        type: 'category',
        axisLabel: { interval: 0, rotate: -45 }
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
    },
    assmebleToolbox() {
      return {
        feature: {
          magicType: {
            type: ['line', 'bar']
          },
          saveAsImage: {}
        }
      }
    },
    assembleTooltip(data) {
      var _this = this
      var formatter = function(params) {
        var message = `
        <div style="font-weight: bolder">${params[0].name} ${
          _this.yAxisNameMap[_this.form.yAxis]
        }:</div>
        `
        params.forEach((param) => {
          if (param.data === undefined) return
          var amount = `（${data[param.seriesName][param.dataIndex]} 个）`
          var seriesName
          switch (_this.form.groupBy) {
            case 'Shift':
              seriesName = param.seriesName === '1' ? '白班' : '晚班'
              break
            case 'Date':
              var date = new Date(param.seriesName)
              seriesName = date.toLocaleDateString()
              break
            default:
              seriesName = param.seriesName
              break
          }
          var rest = `
          <div>
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; vertical-align: center; background: ${
            param.color
          }"></span>
          <span>${seriesName}: ${param.data}${_this.isRate ? '%' : '个'}${
            _this.isRate ? amount : ''
          }</span>
          </div>
          `
          message += rest
        })
        return message
      }

      return {
        show: true,
        trigger: 'axis',
        formatter,
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      }
    },
    assembleLegend() {
      var _this = this
      var formatter = function(name) {
        switch (_this.form.groupBy) {
          case 'Shift':
            return name === '1' ? '白班' : '晚班'
          case 'Date':
            var date = new Date(name)
            return date.toLocaleDateString()
          default:
            return name
        }
      }

      return { formatter }
    },
    assembleTitle() {
      if (this.form.groupBy) {
        var name = this.categoryMap[this.form.groupBy]
        if (!name) {
          var index = this.attributes.findIndex(
            (a) => a.name === this.form.xAxis
          )
          if (index >= 0) {
            name = this.attributes[index].label
          }
        }

        return {
          top: 20,
          left: 'center',
          text: `按${name}分组`,
          textStyle: {
            color: '#666',
            fontSize: 14
          }
        }
      }

      return undefined
    }
  },
  watch: {
    echartsResult(nv) {
      if (nv) {
        var options = {
          title: this.assembleTitle(),
          legend: this.assembleLegend(),
          toolbox: this.assmebleToolbox(),
          tooltip: this.assembleTooltip(nv.seriesAmountData),
          xAxis: this.assembleXAxis(nv.xAxisData),
          yAxis: this.assembleYAxis(),
          series: this.assembleSeries(nv.seriesData)
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
.top-yield-custom-chart {
  padding: 16px;
  background: #fff;
  margin-bottom: 16px;
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
