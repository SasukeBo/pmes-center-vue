<template>
  <div class="device-custom-yield-bar">
    <div class="custom-chart__head">
      <div class="title">
        <div class="text">自定义数据图表</div>
        <div class="subtext">
          {{ form.sort === 'ASC' ? '最小' : '最大'
          }}{{ form.limit ? '前' + form.limit + '项' : '前N项'
          }}{{ yAxisNameMap[form.yAxis] }}
        </div>
      </div>

      <div class="custom-btn">
        <el-button size="small" @click="formVisible = true">自定义</el-button>
      </div>
    </div>

    <div
      class="yield-chart-mount"
      ref="chart"
      v-loading="$apollo.queries.echartsResult.loading"
    ></div>

    <el-dialog title="自定义图表" :visible.sync="formVisible">
      <el-form
        :model="form"
        ref="custom-graph-form"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="X轴" prop="xAxis">
          <el-select v-model="form.xAxis" placeholder="请选择X轴属性">
            <el-option label="检测日期" value="Date"></el-option>
            <el-option label="检测班别" value="Shift"></el-option>
            <el-option
              v-for="a in attributes"
              :key="a.token"
              :label="a.label"
              :value="a.token"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Y轴" prop="yAxis">
          <el-select v-model="form.yAxis" placeholder="请选择Y轴属性">
            <el-option label="产量" value="Amount"></el-option>
            <el-option label="良率" value="Yield"></el-option>
            <el-option label="不良率" value="UnYield"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分组字段" prop="groupBy">
          <el-select
            v-model="form.groupBy"
            placeholder="请选择分组字段"
            clearable
          >
            <el-option label="检测日期" value="Date"></el-option>
            <el-option label="检测班别" value="Shift"></el-option>
            <el-option
              v-for="a in attributes"
              :key="a.token"
              :label="a.label"
              :value="a.token"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期范围" prop="duration">
          <el-date-picker
            clearable
            v-model="form.duration"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="数据项数上限" prop="limit">
          <el-input-number v-model="form.limit" :min="1"></el-input-number>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-switch
            v-model="form.sort"
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
    id: [String, Number],
    materialID: [String, Number]
  },
  data() {
    var checkUniqueAttributeForXAxisAndGroupBy = (rule, value, callback) => {
      if (this.form.xAxis === this.form.groupBy) {
        callback(new Error('X轴属性与分组属性不能相同'))
      } else {
        callback()
      }
    }
    var t = new Date()
    t.setMonth(t.getMonth() - 1)
    t.setHours(0, 0, 0, 0)

    return {
      isLine: false,
      formVisible: false,
      form: {
        xAxis: 'Date',
        yAxis: 'Yield',
        groupBy: 'Shift',
        duration: [t],
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
      yAxisNameMap: {
        Amount: '产量(Amount)',
        Yield: '良率(Yield)',
        UnYield: '不良率(Reject Ratio)'
      },
      categoryMap: {
        Date: '检测日期(Date)',
        Shift: '检测班别(Shift)'
      },
      echartsResult: {
        xAxisData: [],
        seriesData: {
          data: []
        }
      },
      yieldChart: undefined,
      attributes: []
    }
  },
  apollo: {
    attributes: {
      query: gql`
        query($materialID: Int!) {
          attributes: productAttributes(materialID: $materialID) {
            type
            label
            name
            token
            prefix
          }
        }
      `,
      variables() {
        return {
          materialID: this.materialID
        }
      }
    },
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
        var category = ['Date', 'Shift']
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
      },
      skip() {
        return this.formVisible
      }
    }
  },
  computed: {
    isRate() {
      return this.form.yAxis !== 'Amount'
    },
    groupAttribute() {
      var index = this.attributes.findIndex((a) => {
        return a.token === this.form.groupBy
      })

      if (index >= 0) {
        return this.attributes[index]
      }

      return undefined
    },
    xAxisAttribute() {
      var index = this.attributes.findIndex((a) => {
        return a.token === this.form.xAxis
      })

      if (index >= 0) {
        return this.attributes[index]
      }

      return undefined
    }
  },
  methods: {
    cancel() {
      this.$refs['custom-graph-form'].resetFields()
      this.formVisible = false
    },
    submit() {
      this.$refs['custom-graph-form'].validate((valid) => {
        if (valid) {
          this.formVisible = false
        }
      })
    },
    assembleSeries(seriesData, params) {
      var keys = Object.keys(seriesData)
      if (keys.length === 0) {
        return [{ data: [], name: 'data', type: 'bar' }]
      }

      return keys.map((k) => {
        var data = seriesData[k].map((item) => {
          if (item === 0) {
            return undefined
          }
          if (this.form.yAxis !== 'Amount') {
            item = (item * 100).toFixed(2)
          }
          if (params && params.seriesName !== k) {
            return {
              value: item,
              itemStyle: {
                color: '#ddd'
              }
            }
          }
          return item
        })

        var label = {
          show: true,
          position: 'top',
          rotate: -60,
          offset: [0, -10],
          fontSize: 10,
          formatter: this.form.yAxis === 'Amount' ? '{c}个' : '{c}%'
        }

        return {
          data,
          label: this.isLine ? undefined : label,
          type: this.isLine ? 'line' : 'bar',
          name: k,
          barMaxWidth: 20
        }
      })
    },
    assembleXAxis(data) {
      if (
        this.form.xAxis === 'Date' ||
        (this.xAxisAttribute &&
          ['Datetime', 'Weekday'].includes(this.xAxisAttribute.type))
      ) {
        data = data.map((d) => {
          var t = new Date(d)
          return t.toLocaleDateString()
        })
      } else if (this.form.xAxis === 'Shift') {
        data = data.map((d) => {
          return d === '1' ? '白班' : '晚班'
        })
      } else if (this.xAxisAttribute) {
        data = data.map((d) => {
          return `${this.xAxisAttribute.prefix} - ${d}`
        })
      }

      var name = this.categoryMap[this.form.xAxis]
      if (!name && this.xAxisAttribute) {
        name = `${this.xAxisAttribute.label}\n(${this.xAxisAttribute.name})`
      }

      return {
        data,
        name,
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
              if (_this.groupAttribute) {
                seriesName = `${_this.groupAttribute.prefix} - ${param.seriesName}`
              } else {
                seriesName = param.seriesName
              }
              break
          }
          var rest = `
          <div>
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; vertical-align: center; background: ${
            param.color
          }"></span>
          <span>${seriesName}: ${param.data.value || param.data}${
            _this.isRate ? '%' : '个'
          }${_this.isRate ? amount : ''}</span>
          </div>
          `
          message += rest
        })
        return message
      }

      return {
        show: true,
        formatter,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      }
    },
    assembleTitle() {
      var text
      var subtext

      if (this.form.duration) {
        if (this.form.duration.length === 1) {
          subtext = `${this.form.duration[0].toLocaleDateString()}之后的数据`
        } else if (this.form.duration.length === 2) {
          subtext = `从${this.form.duration[0].toLocaleDateString()}到${this.form.duration[1].toLocaleDateString()}的数据`
        }
      }

      var xAxis = this.categoryMap[this.form.xAxis]
      if (!xAxis && this.xAxisAttribute) {
        xAxis = `${this.xAxisAttribute.label}(${this.xAxisAttribute.name})`
      }
      text = `每个${xAxis}的${this.yAxisNameMap[this.form.yAxis]}`

      if (this.form.groupBy) {
        var groupBy = this.categoryMap[this.form.groupBy]
        if (!groupBy && this.groupAttribute) {
          groupBy = `${this.groupAttribute.label}(${this.groupAttribute.name})`
        }
        text = `按${groupBy}分组的` + text
      }

      return {
        top: 0,
        left: 'center',
        text,
        subtext,
        textStyle: {
          color: '#666',
          fontSize: 14
        }
      }
    },
    assembleLegend(seriesData) {
      var show = true
      var _this = this
      var formatter = function(name) {
        switch (_this.form.groupBy) {
          case 'Shift':
            return name === '1' ? '白班' : '晚班'
          case 'Date':
            var date = new Date(name)
            return date.toLocaleDateString()
          default:
            if (_this.groupAttribute) {
              return `${_this.groupAttribute.prefix} - ${name}`
            }
            return name
        }
      }
      if (seriesData.data) {
        show = false
      }

      return {
        show,
        formatter,
        type: 'scroll',
        width: '60%',
        top: 50,
        left: 'center'
      }
    },
    assmebleToolbox() {
      var _this = this
      return {
        feature: {
          myTool1: {
            show: true,
            title: '切换为折线图',
            icon:
              'M160 832h704v64H160zM268.8 563.2l159.04 127.2 111.04-237.92 142.56 126.72 210.88-404.32-56.64-29.76L662.56 476.8l-145.44-129.28-112.96 242.08L243.2 460.8 130.56 723.36l58.88 25.28L268.8 563.2z',
            onclick: function() {
              _this.isLine = true
              var option = {
                series: _this.assembleSeries(_this.echartsResult.seriesData)
              }
              _this.yieldChart.setOption(option)
            }
          },
          myTool2: {
            show: true,
            title: '切换为柱状图',
            icon:
              'M0 832 1024 832 1024 960 0 960zM128 576 256 576 256 768 128 768zM320 320 448 320 448 768 320 768zM512 512 640 512 640 768 512 768zM704 128 832 128 832 768 704 768z',
            onclick: function() {
              _this.isLine = false
              _this.updateSeries()
            }
          }
        }
      }
    },
    assembleGrid() {
      return {
        top: 110
      }
    },
    updateSeries(params) {
      var option = {
        series: this.assembleSeries(this.echartsResult.seriesData, params)
      }
      this.yieldChart.setOption(option)
    }
  },
  watch: {
    echartsResult(nv) {
      if (nv) {
        var options = {
          grid: this.assembleGrid(),
          toolbox: this.assmebleToolbox(),
          legend: this.assembleLegend(nv.seriesData),
          title: this.assembleTitle(),
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
    var _this = this
    this.yieldChart.on('mouseover', function(params) {
      _this.updateSeries(params)
    })
    this.yieldChart.on('mouseout', function() {
      _this.updateSeries()
    })
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
    display: flex;

    .title {
      color: #333;
      flex: 1;

      .text {
        font-size: 20px;
      }

      .subtext {
        font-size: 12px;
      }
    }
  }
}
</style>
