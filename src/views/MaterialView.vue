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
                @change="handleDeviceChange"
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
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="尺寸统计" name="sizes-cpk"
        ><SizeAnalyze
          :materialID="id"
          :deviceID="deviceID"
          :beginTime="beginTime"
          :endTime="endTime"
          :canFetch="canFetch"
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
      pendingStatus: 0,
      interval: undefined,
      timeDuration: [],
      devices: [],
      deviceID: undefined,
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
      },
      fetchPolicy: 'network-only'
    }
  },
  mounted() {
    this.mychart = echarts.init(this.$refs.chart)
  },
  created() {
    if (this.$route.query.tab) {
      this.activeName = this.$route.query.tab
    }
    if (!this.timeDuration) this.timeDuration = []
    if (this.$route.query.beginTime) {
      this.beginTime = new Date(this.$route.query.beginTime)
      this.timeDuration.push(this.beginTime)
    }
    if (this.$route.query.endTime) {
      this.endTime = new Date(this.$route.query.endTime)
      this.timeDuration.push(this.endTime)
    }
    if (this.$route.query.deviceID) {
      this.deviceID = parseInt(this.$route.query.deviceID)
    }
  },
  computed: {
    canFetch() {
      return this.pendingStatus === 0
    }
  },
  watch: {
    pendingStatus: function(status) {
      if (status === 1) {
        this.interval = setInterval(() => {
          if (!this.materialResult.status.fileIDs) return

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
                this.pendingStatus = 0
              }
            })
            .catch(e => {
              console.log(e.message)
            })
        }, 500)
      } else {
        clearInterval(this.interval)
        this.$apollo.queries.materialResult.refresh()
      }
    },
    materialResult(nv) {
      if (!nv) return
      if (nv.status) this.pendingStatus = nv.status.pending ? 1 : 0
      this.option.series[0].data = [
        { name: 'OK', value: nv.ok },
        { name: 'NG', value: nv.ng }
      ]
      if (nv.material) this.option.title.text = `料号${nv.material.name}`

      this.mychart.setOption(this.option)
    }
  },
  methods: {
    handleTabClick(val) {
      var query = { ...this.$route.query, tab: val.name }
      delete query.page
      this.setRouterQuery(query)
    },
    handleDateDurationChange(val) {
      var query = { ...this.$route.query }
      if (val && val.length > 1) {
        this.pendingStatus = 1
        this.beginTime = val[0]
        this.endTime = val[1]
        query.beginTime = this.beginTime.toISOString()
        query.endTime = this.endTime.toISOString()
      } else {
        this.pendingStatus = 0
        this.beginTime = undefined
        this.endTime = undefined
        delete query.beginTime
        delete query.endTime
      }

      this.setRouterQuery(query)
    },
    handleDeviceChange(val) {
      var query = { ...this.$route.query, deviceID: val }
      if (!val) {
        delete query.deviceID
      }
      this.setRouterQuery(query)
    },
    setRouterQuery(query) {
      this.$router
        .replace({ path: this.$route.path, query })
        .catch(() => undefined)
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
