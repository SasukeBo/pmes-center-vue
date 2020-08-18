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
            <el-option label="检测设备" value="Device"></el-option>
            <el-option label="检测班别" value="Shift"></el-option>
            <el-option
              v-for="a in attributes"
              :key="a.token"
              :label="a.label"
              :value="a.token"
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
    id: [Number, String],
    materialID: [Number, String]
  },
  data() {
    var t = new Date()
    t.setDate(t.getDate() - 7)
    t.setHours(0, 0, 0, 0)

    return {
      echartResults: {},
      yieldChart: undefined,
      form: {
        yAxis: 'Yield',
        groupBy: 'Shift',
        duration: [t]
      },
      yAxisNameMap: {
        Yield: '良率(Yield)',
        UnYield: '不良率(Reject Ratio)'
      },
      attributes: []
    }
  },
  computed: {
    groupByAttribute() {
      var index = this.attributes.findIndex((a) => {
        return a.token === this.form.groupBy
      })

      if (index >= 0) {
        return this.attributes[index]
      }

      return undefined
    }
  },
  apollo: {
    attributes: {
      query: gql`
        query($materialID: Int!) {
          attributes: productAttributes(materialID: $materialID) {
            label
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
    echartResults: {
      query: gql`
        query($input: GraphInput!) {
          echartResults: groupAnalyzePoint(analyzeInput: $input) {
            xAxisData
            seriesData
            seriesAmountData
          }
        }
      `,
      variables() {
        var category = ['Device', 'Shift']
        var attributeGroup

        var groupBy = this.form.groupBy || undefined
        if (!category.includes(groupBy) && groupBy) {
          attributeGroup = groupBy
          groupBy = 'Attribute'
        }

        return {
          input: {
            groupBy,
            attributeGroup,
            targetID: this.id,
            xAxis: 'Date',
            yAxis: this.form.yAxis,
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
      if (keys.length > 2) type = 'line'

      return keys.map((k) => {
        var data = seriesData[k].map((item) => {
          if (item === 0) {
            return undefined
          }
          return (item * 100).toFixed(2)
        })
        var name = k
        if (this.form.groupBy === 'Date') {
          var t = new Date(name)
          name = t.toLocaleDateString()
        }

        var label = {
          show: true,
          position: 'top',
          rotate: -60,
          offset: [0, -10],
          formatter: '{c}%'
        }

        return {
          name,
          data,
          label: type === 'bar' ? label : undefined,
          type,
          barMaxWidth: 20
        }
      })
    },
    assembleTooltip(data) {
      var _this = this
      var formatter = function(params) {
        var message = `
        <div>${params[0].name} ${_this.yAxisNameMap[_this.form.yAxis]}</div>
        `
        params.forEach((param) => {
          if (!param.value) {
            return
          }
          var seriesName = param.seriesName
          if (_this.form.groupBy === 'Shift') {
            seriesName = seriesName === '1' ? '白班' : '晚班'
          } else if (_this.groupByAttribute) {
            seriesName = `${_this.groupByAttribute.prefix} - ${param.seriesName}`
          }

          message += `
          <div>
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${
            param.color
          };"></span>
          <span>${seriesName}: ${param.value}%（${
            data[param.seriesName][param.dataIndex]
          }个）</span>
          </div>
          `
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
    assembleXAxis(xAxisData) {
      var data = xAxisData.map((i) => {
        var t = new Date(i)
        return t.toLocaleDateString()
      })

      return {
        data,
        name: '日期',
        type: 'category'
      }
    },
    assembleYAxis() {
      return {
        name: this.yAxisNameMap[this.form.yAxis],
        nameLocation: 'center',
        nameGap: 50,
        max: this.form.yAxis === 'Yield' ? 100 : undefined,
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: '{value}%'
        }
      }
    },
    assembleLegend() {
      var _this = this
      var formatter = function(params) {
        if (_this.form.groupBy === 'Shift') {
          return params === '1' ? '白班' : '晚班'
        } else if (_this.groupByAttribute) {
          return `${_this.groupByAttribute.prefix} - ${params}`
        }

        return params
      }

      return { formatter, type: 'scroll', width: '60%', top: 0, left: 'center' }
    }
  },
  watch: {
    echartResults(nv) {
      if (nv) {
        var options = {
          toolbox: {
            feature: {
              magicType: {
                type: ['line', 'bar']
              },
              saveAsImage: {}
            }
          },
          legend: this.assembleLegend(),
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
