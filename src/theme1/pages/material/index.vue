<template>
  <div class="material-view">
    <div class="header-block">
      <el-row :gutter="24">
        <el-col :span="14">
          <div class="block-card"></div>
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

      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
  name: 'Material',
  props: ['id'],
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
    }
  },
  data() {
    return {
      devices: [],
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
  .tab-panels {
    margin-top: 32px;

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
