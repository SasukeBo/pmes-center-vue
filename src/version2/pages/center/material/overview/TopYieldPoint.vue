<template>
  <div
    class="top-yield-point-chart"
    v-loading="$apollo.queries.sizeUnYieldResult.loading"
  >
    <el-button
      size="mini"
      type="primary"
      @click="filterFormVisible = true"
      class="open-filter-form-btn"
      >过滤条件</el-button
    >
    <div class="yield-chart-mount" ref="chart"></div>
    <el-dialog :visible.sync="filterFormVisible" title="过滤条件">
      <el-form
        size="mini"
        class="inline-filter"
        label-width="100px"
        label-position="left"
      >
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
        <el-form-item label="选择设备">
          <el-select v-model="form.device_id" clearable>
            <el-option
              v-for="d in devices"
              :key="'device_' + d.id"
              :label="d.name"
              :value="d.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="a.label" v-for="a in attributes" :key="a.name">
          <el-input v-model="form[a.name]" style="width: 300px"></el-input>
        </el-form-item>

        <el-form-item label="班别">
          <el-select v-model="form.shift" clearable>
            <el-option label="白班" value="A"></el-option>
            <el-option label="晚班" value="B"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最多显示项数">
          <el-input-number
            v-model="form.limit"
            controls-position="right"
            :min="10"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="排序">
          <el-checkbox v-model="form.sort">递减</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="filterFormVisible = false" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="filterFormVisible = false" size="mini"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import echarts from 'echarts'
import gql from 'graphql-tag'
import { SeriesDataValueItemStyle } from '@/helpers.js'

export default {
  name: 'TopYieldPoint',
  props: {
    id: [Number, String]
  },
  data() {
    return {
      filterFormVisible: false,
      yieldChart: undefined,
      sizeUnYieldResult: [],
      form: {
        duration: [],
        limit: 20,
        sort: true,
        device_id: undefined,
        shift: undefined
      },
      devices: [],
      attributes: []
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
    sizeUnYieldResult: {
      query: gql`
        query($input: GraphInput!) {
          sizeUnYieldResult: sizeUnYieldTop(groupInput: $input) {
            xAxisData
            seriesData
          }
        }
      `,
      variables() {
        var filters = {}
        var _this = this
        this.attributes.forEach((a) => {
          filters[a.name] = _this.form[a.name] || undefined
        })
        filters.device_id = this.form.device_id || undefined
        filters.shift = this.form.shift || undefined

        return {
          input: {
            targetID: this.id,
            yAxis: 'UnYield',
            xAxis: 'Date',
            duration: this.form.duration,
            limit: this.form.limit,
            sort: this.form.sort ? 'DESC' : 'ASC',
            filters
          }
        }
      },
      skip() {
        return this.filterFormVisible
      }
    },
    devices: {
      query: gql`
        query($materialID: Int!) {
          devices(materialID: $materialID) {
            id
            name
          }
        }
      `,
      variables() {
        return {
          materialID: this.id
        }
      }
    }
  },
  methods: {
    assembleSeries(data) {
      var values = data.map((value, i) => {
        if (value === 0) return
        value = (value * 100).toFixed(2)
        if (i < 3) {
          return SeriesDataValueItemStyle(value, '#D92622', '#E04660', 'linear')
        } else if (i < 8) {
          return SeriesDataValueItemStyle(value, '#FFB763', '#E04660', 'linear')
        }
        return value
      })

      var label = {
        show: true,
        position: 'top',
        formatter: '{c}%'
      }

      return {
        label,
        name: '点位不良率',
        data: values,
        type: 'bar',
        barMaxWidth: 20
      }
    }
  },
  watch: {
    sizeUnYieldResult(nv) {
      if (nv) {
        var data = nv.seriesData.data || []
        var options = {
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
          series: this.assembleSeries(data)
        }

        options.tooltip.formatter = function(params) {
          return `
          <div>${params.name}</div>
          <div>${params.seriesName}：${params.value}%</div>
          `
        }
        options.xAxis.data = nv.xAxisData
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
.top-yield-point-chart {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
  position: relative;

  .open-filter-form-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 2000;
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
