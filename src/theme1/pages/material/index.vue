<template>
  <div class="material-view">
    <div class="header-block">
      <el-row :gutter="24">
        <el-col :span="14">
          <div class="block-card chart-panel">
            <div class="data-block" v-if="materialResult">
              <div class="title">
                {{ materialResult.material.customerCode }} ({{
                  materialResult.material.name
                }})
              </div>
              <div class="subtitle">
                {{ materialResult.material.projectRemark }}
              </div>
              <div class="subtitle">
                总产量：{{ materialResult.ok + materialResult.ng }}
              </div>
            </div>
            <div class="chart-block" ref="chart"></div>
            <MoreOptionPopover></MoreOptionPopover>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="block-card filter-form">
            <div class="form-header">条件筛选</div>

            <el-form size="mini" label-position="right" label-width="90px">
              <el-form-item label="设备：">
                <el-select
                  v-model="searchForm.deviceID"
                  placeholder="请选择设备"
                >
                  <el-option
                    v-for="d in devices"
                    :label="d.name"
                    :value="d.id"
                    :key="'device_' + d.id"
                    >{{ d.name }}</el-option
                  >
                </el-select>
              </el-form-item>
              <el-form-item label="冶具号：">
                <el-input
                  placeholder="请输入冶具号"
                  v-model="searchForm.jigID"
                ></el-input>
              </el-form-item>

              <el-form-item label="班别：">
                <el-input
                  placeholder="请输入班别"
                  v-model="searchForm.jigID"
                ></el-input>
              </el-form-item>

              <el-form-item label="线体号：">
                <el-input
                  placeholder="请输入线体号"
                  v-model="searchForm.lineID"
                ></el-input>
              </el-form-item>

              <el-form-item label="模具号：">
                <el-input
                  placeholder="请输入模具号"
                  v-model="searchForm.mouldID"
                ></el-input>
              </el-form-item>

              <el-form-item label="日期范围：" class="flex-form-item">
                <el-date-picker
                  v-model="searchForm.beginTime"
                  type="date"
                  placeholder="选择开始日期"
                >
                </el-date-picker>
                <span class="date-picker-seperator">-</span>
                <el-date-picker
                  v-model="searchForm.endTime"
                  type="date"
                  placeholder="选择结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="tab-panels">
      <div class="tab-panels-header">
        <el-tabs v-model="activePanel" @tab-click="handlePanelChange" stretch>
          <el-tab-pane label="尺寸分析" name="size-analyze"></el-tab-pane>
          <el-tab-pane label="生产数据" name="product-data"></el-tab-pane>
        </el-tabs>
      </div>

      <router-view :searchForm="searchForm"></router-view>
    </div>

    <div class="footer">
      <el-button type="primary" icon="el-icon-top"></el-button>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import echarts from 'echarts'
import { pipeToUndefined } from '@/helpers'
import MoreOptionPopover from '@/theme1/components/MoreOptionPopover.vue'
export default {
  name: 'Material',
  props: ['id'],
  components: { MoreOptionPopover },
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
              customerCode
              projectRemark
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
      }
    }
  },
  data() {
    return {
      mychart: undefined,
      devices: [],
      materialResult: undefined,
      activePanel: 'size-analyze',
      searchForm: {
        deviceID: undefined,
        timeDuration: [],
        lineID: undefined,
        mouldID: undefined,
        jigID: undefined,
        shiftNumber: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      option: {
        color: ['#3FE3D3', '#E04660'],
        series: [
          {
            name: '产量',
            type: 'pie',
            radius: ['35%', '60%'],
            center: ['55%', '50%'],
            label: {
              fontSize: 24,
              fontWeight: 'bold',
              formatter: '{b}: {d}%'
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowBlur: 10
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 24,
                fontWeight: 'bold'
              }
            },
            data: []
          }
        ]
      }
    }
  },
  mounted() {
    this.mychart = echarts.init(this.$refs.chart)
  },
  watch: {
    materialResult: {
      immediate: true,
      handler: function(nv) {
        console.log('hello')
        if (!nv) return
        this.option.series[0].data = [
          { name: 'OK', value: nv.ok },
          { name: 'NG', value: nv.ng }
        ]
        this.mychart.setOption(this.option)
      }
    }
  },
  methods: {
    handlePanelChange(val) {
      console.log(val.name)
    }
  }
}
</script>
<style lang="scss">
.theme_1-app .material-view {
  .footer {
    z-index: 2000;
    height: 70px;
    background: #1c1c1c;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;

    .el-button {
      float: right;
      border: none;
      border-radius: 0;
      height: 100%;
      width: 120px;
      background: #478ded;

      .el-icon-top {
        font-weight: bold;
        font-size: 20px;
      }
    }
  }
  .tab-panels {
    margin-top: 32px;
    margin-bottom: 70px;

    .tab-panels-header {
      background: #fff;
      text-align: center;
      height: 64px;
      padding-top: 24px;
      box-sizing: border-box;
      margin-bottom: 4px;

      .el-tabs {
        width: 200px;
        margin: auto;

        .el-tabs__header {
          margin: 0;

          .el-tabs__active-bar {
            background-color: #5e83f2;
          }
          .el-tabs__nav-wrap:after {
            display: none;
          }

          .el-tabs__item {
            color: #666;

            &.is-active {
              color: #5e83f2;
            }
          }
        }
      }
    }
  }

  .header-block {
    padding-top: 32px;

    .chart-panel {
      position: relative;

      .data-block {
        position: absolute;
        left: 24px;
        top: 18px;

        .title {
          font-size: 20px;
          color: #333;
          font-weight: bold;
          line-height: 20px;
          padding-bottom: 16px;
        }

        .subtitle {
          font-size: 12px;
          color: #999;
          line-height: 12px;
          padding-bottom: 8px;
        }
      }

      .chart-block {
        height: 100%;
        width: 100%;
      }

      .more-options {
        top: 20px;
        right: 28px;
      }
    }

    .block-card {
      background: #fff;
      height: 316px;
      border-radius: 4px;
    }

    .filter-form .form-header {
      text-align: center;
      color: #fff;
      height: 56px;
      line-height: 56px;
      font-size: 20px;
      background: #5e83f2;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    .filter-form .el-form {
      padding: 24px 60px;

      .el-select {
        width: 100%;
      }

      .el-form-item {
        margin-bottom: 8px;
        &:last-child {
          margin-bottom: 0;
        }
      }

      .flex-form-item .el-form-item__content {
        display: flex;

        .el-date-editor {
          width: 47%;
        }
        .el-date-editor .el-input__inner {
          padding-right: 20px;
        }
        .date-picker-seperator {
          flex: 1;
          text-align: center;
        }
      }
    }
  }
}
</style>
