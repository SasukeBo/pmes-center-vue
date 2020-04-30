<template>
  <div
    class="material-view"
    v-loading="
      materialResult.status.pending || $apollo.queries.materialResult.loading
    "
    element-loading-text="正在获取数据 ..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="material-header">
      <el-row :gutter="20">
        <el-col :span="12">
          <div ref="chart" class="chart"></div>
        </el-col>
        <el-col :span="9">
          <div style="font-size: 20px; color: #666">过滤条件</div>
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
                @change="handleDateDurationChange"
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
          :materialID="id"
          :deviceID="deviceID"
          :beginTime="beginTime"
          :endTime="endTime"
          :disableFetch="materialResult.status.pending"
        ></SizeAnalyze
      ></el-tab-pane>
      <el-tab-pane lazy label="产品数据" name="products-data">
        <ProductData
          :materialID="id"
          :deviceID="deviceID"
          :beginTime="beginTime"
          :endTime="endTime"
        ></ProductData>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import echarts from 'echarts'
import SizeAnalyze from '@/components/SizeAnalyze.vue'
import ProductData from '@/components/ProductData.vue'
export default {
  name: 'MaterialView',
  props: ['id'],
  components: { SizeAnalyze, ProductData },
  data() {
    return {
      activeName: 'sizes-cpk',
      mychart: undefined,
      materialResult: {
        material: {},
        ok: 0,
        ng: 0,
        status: {
          message: '',
          pending: false,
          fileIDs: []
        }
      },
      interval: undefined,
      devices: [],
      deviceID: undefined,
      timeDuration: [],
      beginTime: undefined,
      endTime: undefined,
      option: {
        title: {},
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#409EFF', '#EC1B1B'],
        series: [
          {
            radius: '65%',
            center: ['50%', '50%'],
            top: 0,
            type: 'pie',
            name: '产量',
            data: [],
            label: {
              formatter: '{b}({d}%)'
            }
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
            status {
              message
              pending
              fileIDs
            }
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
  watch: {
    'materialResult.status.pending': function(pending) {
      if (!pending) {
        clearInterval(this.interval)
        if (this.$apollo.queries.materialResult) {
          console.log('start analyzeMaterial')
          this.$apollo.queries.materialResult.start()
        }
      } else {
        this.interval = setInterval(() => {
          if (!this.materialResult.status.fileIDs) {
            return
          }
          this.$apollo
            .query({
              query: gql`
                query($fileIDs: [Int]!) {
                  finished: dataFetchFinishPercent(fileIDs: $fileIDs)
                }
              `,
              variables: {
                fileIDs: this.materialResult.status.fileIDs
              },
              fetchPolicy: 'network-only'
            })
            .then(({ data }) => {
              if (data.finished === 1) {
                this.materialResult.status.pending = false
              }
            })
            .catch(e => {
              console.log(e.message)
            })
        }, 500)
      }
    },
    materialResult(nv) {
      if (nv && !nv.status.pending) {
        this.option.series[0].data = [
          { name: 'OK', value: nv.ok },
          { name: 'NG', value: nv.ng }
        ]
        this.option.title.text = `料号${nv.material.name}`
        this.mychart.setOption(this.option)
      }
    }
  },
  methods: {
    handleDateDurationChange() {
      this.materialResult.status.pending = true
      if (this.timeDuration && this.timeDuration.length > 0) {
        this.beginTime = this.timeDuration[0]
      }

      if (this.timeDuration && this.timeDuration.length > 1) {
        this.endTime = this.timeDuration[1]
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

  .el-loading-spinner {
    top: 10%;
  }
}
</style>
