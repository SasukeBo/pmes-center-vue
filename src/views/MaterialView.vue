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
        <el-col :span="8">
          <div ref="chart" class="chart"></div>
        </el-col>
        <el-col :span="16">
          <div style="font-size: 20px; color: #666">过滤条件</div>
          <el-form
            size="mini"
            label-position="left"
            label-width="60px"
            class="filter-form"
            style="padding-top: 16px;"
          >
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="设备">
                  <el-select
                    v-model="searchForm.deviceID"
                    @change="handleDeviceChange"
                    clearable
                    filterable
                    style="max-width: 200px;"
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
              </el-col>
              <el-col :span="6">
                <el-form-item label="线体号">
                  <el-input
                    style="max-width: 200px"
                    v-model="searchForm.lineID"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="冶具号">
                  <el-input
                    style="max-width: 200px"
                    v-model="searchForm.jigID"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="模号">
                  <el-input
                    style="max-width: 200px"
                    v-model="searchForm.mouldID"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="班别">
                  <el-input
                    style="max-width: 200px"
                    v-model="searchForm.shiftNumber"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="日期">
                  <el-date-picker
                    v-model="searchForm.timeDuration"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleDateDurationChange"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleTabClick"
      class="cal-height-hidden"
    >
      <el-tab-pane lazy label="尺寸统计" name="sizes-cpk"
        ><SizeAnalyze
          :materialID="id"
          :searchForm="searchForm"
          :canFetch="canFetch"
        ></SizeAnalyze
      ></el-tab-pane>
      <el-tab-pane lazy label="产品数据" name="products-data">
        <ProductData :materialID="id" :searchForm="searchForm"></ProductData>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import echarts from 'echarts'
import SizeAnalyze from '@/components/SizeAnalyze.vue'
import ProductData from '@/components/ProductData.vue'
import { pipeToUndefined } from '@/helpers'
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
      searchForm: {
        timeDuration: [],
        deviceID: undefined,
        lineID: undefined,
        mouldID: undefined,
        jigID: undefined,
        shiftNumber: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      devices: [],
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
            center: ['50%', '65%'],
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
        var s = this.searchForm

        return {
          input: {
            materialID: this.id,
            deviceID: pipeToUndefined(s.deviceID),
            beginTime: pipeToUndefined(s.beginTime),
            endTime: pipeToUndefined(s.endTime),
            extra: {
              lineID: pipeToUndefined(s.lineID),
              jigID: pipeToUndefined(s.jigID),
              mouldID: pipeToUndefined(s.mouldID),
              shiftNumber: pipeToUndefined(s.shiftNumber)
            }
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
    if (!this.searchForm.timeDuration) this.searchForm.timeDuration = []
    if (this.$route.query.endTime) {
      this.searchForm.endTime = new Date(this.$route.query.endTime)
    } else {
      this.searchForm.endTime = new Date()
    }
    this.searchForm.timeDuration.unshift(this.searchForm.endTime)

    if (this.$route.query.beginTime) {
      this.searchForm.beginTime = new Date(this.$route.query.beginTime)
    } else {
      var now = new Date()
      now.setMonth(now.getMonth() - 12)
      this.searchForm.beginTime = now
    }
    this.searchForm.timeDuration.unshift(this.searchForm.beginTime)
    if (this.$route.query.deviceID) {
      this.searchForm.deviceID = parseInt(this.$route.query.deviceID)
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
        this.searchForm.beginTime = val[0]
        this.searchForm.endTime = val[1]
        query.beginTime = this.searchForm.beginTime.toISOString()
        query.endTime = this.searchForm.endTime.toISOString()
      } else {
        this.pendingStatus = 0
        this.searchForm.beginTime = undefined
        this.searchForm.endTime = undefined
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
    height: 100px;
  }

  .el-loading-spinner {
    top: 10%;
  }

  .cal-height-hidden {
    height: calc(100% - 169px);
    overflow: hidden;
  }

  .el-tabs__content {
    height: calc(100% - 55px);
    overflow: hidden;
  }

  .el-tab-pane {
    height: 100%;
    overflow: hidden;
  }

  .material-header .filter-form {
    padding-top: 0 !important;

    .el-form-item {
      margin-top: 18px;
      margin-bottom: 0;
    }
  }
}
</style>
