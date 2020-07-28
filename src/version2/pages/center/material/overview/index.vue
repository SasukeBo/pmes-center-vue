<template>
  <div class="material-view">
    <TotalYieldPie :id="id" :versionID="selectedVersionID"></TotalYieldPie>
    <TopYieldByLine :id="id" :versionID="selectedVersionID"></TopYieldByLine>
    <TopYieldPoint :id="id" :versionID="selectedVersionID"></TopYieldPoint>
    <TopYieldDevice :id="id" :versionID="selectedVersionID"></TopYieldDevice>
    <TopYieldCustom :id="id" :versionID="selectedVersionID"></TopYieldCustom>

    <MaterialDialog
      :visible.sync="materialDialogVisible"
      :isEdit.sync="isEdit"
      :material="materialForm"
    ></MaterialDialog>
  </div>
</template>
<script>
import MaterialDialog from './MaterialDialog.vue'
import TopYieldDevice from './TopYieldDevice.vue'
import TopYieldPoint from './TopYieldPoint.vue'
import TopYieldCustom from './TopYieldCustom.vue'
import TopYieldByLine from './TopYieldByLine.vue'
import TotalYieldPie from './TotalYieldPie.vue'

export default {
  name: 'Material',
  props: ['id'],
  components: {
    MaterialDialog,
    TopYieldDevice,
    TopYieldPoint,
    TopYieldCustom,
    TopYieldByLine,
    TotalYieldPie
  },
  data() {
    return {
      mychart: undefined,
      isEdit: false,
      materialForm: {},
      materialDialogVisible: false,
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
            center: ['50%', '50%'],
            label: {
              show: false
            },
            itemStyle: {
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowBlur: 20
            },
            emphasis: {
              label: {
                show: false,
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
  computed: {
    selectedVersionID() {
      var versionID = this.$route.query.version_id
      if (versionID && !isNaN(parseInt(versionID))) {
        return versionID
      }

      return undefined
    }
  },
  created() {
    this.activePanel = this.$route.name

    this.searchForm.endTime = new Date()
    var now = new Date()
    now.setMonth(now.getMonth() - 12)
    this.searchForm.beginTime = now
  },
  methods: {
    scrollTop() {
      var timer = setInterval(function() {
        var osTop =
          document.documentElement.scrollTop || document.body.scrollTop
        var isSpeed = Math.floor(-osTop / 6)

        document.documentElement.scrollTop = document.body.scrollTop =
          osTop + isSpeed
        if (osTop === 0) {
          clearInterval(timer)
        }
      }, 30)
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
    margin-bottom: 16px;
    border-radius: 4px;
    background: #fff;

    .search-form-col {
      min-width: 486px;
    }

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

      .yield {
        position: absolute;
        font-size: 24px;
        font-weight: bold;
        color: #3fe3d3;
        right: 68px;
        bottom: 32px;
      }

      .more-options {
        top: 20px;
        right: 28px;
      }
    }

    .block-card {
      height: 316px;
    }

    .filter-form .form-header {
      text-align: center;
      color: #fff;
      height: 56px;
      line-height: 56px;
      font-size: 20px;
      background: #5e83f2;
    }

    .filter-form .el-form {
      padding: 24px 60px;

      .el-input__inner {
        padding: 0 8px;
      }

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

@media only screen and (max-width: 1200px) {
  .theme_1-app .material-view .header-block {
    .chart-panel-col {
      width: 100%;
      margin-bottom: 16px;
    }
    .search-form-col {
      width: 100%;
    }
  }
}
</style>
