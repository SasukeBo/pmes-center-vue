<template>
  <div class="material-view">
    <div class="material-header">
      <el-row :gutter="20">
        <el-col :span="12">
          <div ref="chart" class="chart"></div>
        </el-col>
        <el-col :span="9">
          <el-form
            size="small"
            label-position="left"
            label-width="100px"
            style="padding-top: 16px;"
          >
            <el-form-item label="选择设备">
              <el-select
                v-model="deviceID"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in devices"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择日期范围">
              <el-date-picker
                v-model="timeDuration"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="尺寸统计" name="sizes-cpk"
        ><SizeAnalyze
          :materialID="parseInt(id)"
          :deviceID="deviceID"
          :beginTime="beginTime"
          :endTime="endTime"
        ></SizeAnalyze
      ></el-tab-pane>
      <el-tab-pane label="产品数据" name="products-data">产品数据</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import echarts from 'echarts'
import SizeAnalyze from '@/components/SizeAnalyze.vue'
export default {
  name: 'MaterialView',
  props: ['id'],
  components: { SizeAnalyze },
  data() {
    return {
      activeName: 'sizes-cpk',
      mychart: undefined,
      materialResult: {
        material: {},
        ok: 0,
        ng: 0,
        status: {}
      },
      devices: [],
      deviceID: undefined,
      timeDuration: [],
      option: {
        title: {},
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#91c7ae', '#c23531'],
        series: [
          {
            radius: '65%',
            center: ['50%', '50%'],
            top: 0,
            animation: false,
            type: 'pie',
            name: '产量',
            data: []
          }
        ]
      }
    }
  },
  apollo: {
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
    },
    materialResult: {
      query: gql`
        query($input: Search!) {
          materialResult: analyzeMaterial(searchInput: $input) {
            material {
              id
              name
            }
            ok
            ng
          }
        }
      `,
      variables() {
        return {
          input: {
            materialID: this.id,
            deviceID: this.deviceID ? this.deviceID : undefined,
            beginTime: this.beginTime,
            endTime: this.endTime
          }
        }
      }
    }
  },
  mounted() {
    this.mychart = echarts.init(this.$refs.chart)
  },
  computed: {
    beginTime() {
      if (this.timeDuration && this.timeDuration.length > 0) {
        return this.timeDuration[0]
      }
      return undefined
    },
    endTime() {
      if (this.timeDuration && this.timeDuration.length > 1) {
        return this.timeDuration[1]
      }
      return undefined
    }
  },
  watch: {
    materialResult(nv) {
      if (nv) {
        this.option.series[0].data = [
          { name: 'OK', value: nv.ok },
          { name: 'NG', value: nv.ng }
        ]
        this.option.title.text = `料号${nv.material.name}`
        this.mychart.setOption(this.option)
      }
    }
  }
}
</script>
<style lang="scss">
.material-view {
  .chart {
    height: 160px;
  }
}
</style>
