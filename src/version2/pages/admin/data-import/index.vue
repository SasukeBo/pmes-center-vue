<template>
  <div class="console-import-data">
    <div class="console-import-data__header">
      <el-button class="import-btn" size="small" @click="drawerVisible = true"
        ><img
          src="~@/version2/assets/images/icon-file.png"
        />添加文件</el-button
      >
    </div>

    <div class="console-import-data__body">
      <el-table
        height="100%"
        :data="importRecordsWrap.importRecords"
        header-row-class-name="import-data-table__header"
        row-class-name="import-data-table__row"
      >
        <el-table-column label="文件名称" prop="fileName" min-width="150px">
          <template slot-scope="scope">
            <a
              v-if="scope.row.file"
              :href="'/downloads/xlsx?file_token=' + scope.row.file.token"
              target="_blank"
              >{{ scope.row.file.name }}</a
            >
            <span v-else>{{ scope.row.fileName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="解析模板">
          <template slot-scope="scope">
            {{ scope.row.decodeTemplate.name }}
          </template>
        </el-table-column>
        <el-table-column label="料号">
          <template slot-scope="scope">
            {{ scope.row.material.name }}
          </template>
        </el-table-column>
        <el-table-column label="检测设备">
          <template slot-scope="scope">
            {{ scope.row.device.name }}
          </template>
        </el-table-column>
        <el-table-column
          label="导入时间"
          :formatter="timeFomatter"
          prop="createdAt"
          min-width="150px"
        ></el-table-column>
        <el-table-column label="数据良率" prop="yield">
          <template slot-scope="scope">
            <span
              :style="{
                color: scope.row.yield < 0.8 ? '#FB5D62' : '#3FE3D3',
                fontWeight: 'bold'
              }"
            >
              {{ (scope.row.yield * 100).toFixed(2) }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="是否完成">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :disabled="!scope.row.errorMessage"
              :content="scope.row.errorMessage"
              placement="top-start"
            >
              <span
                :class="[
                  'import-status',
                  scope.row.status === 'Failed' ? 'is-failed' : ''
                ]"
              >
                {{ statusMap[scope.row.status] }}
                <i
                  class="el-icon-loading"
                  v-if="scope.row.status === 'Loading'"
                ></i>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column min-width="400px">
          <template slot-scope="scope">
            <div class="import-operation-panel">
              <span class="inline-item" style="font-weight: bold">
                {{ (scope.row.fileSize / 1024 / 1024).toFixed(2) }} MB
              </span>
              <ImportProgress
                :key="scope.row.id"
                :record="scope.row"
                :rowFinishedCount.sync="scope.row.rowFinishedCount"
                :status.sync="scope.row.status"
                :yield.sync="scope.row.yield"
                :rowCount.sync="scope.row.rowCount"
                :fileSize.sync="scope.row.fileSize"
                @update-list="updateList"
              ></ImportProgress>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="console-import-data__footer">
      <Pagination
        :currentPage="page"
        :total="importRecordsWrap.total"
        :pageSizes="[20, 50, 100, 300]"
        :pageSize="limit"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></Pagination>
    </div>

    <el-drawer
      :withHeader="false"
      direction="rtl"
      :close-on-press-escape="false"
      custom-class="device-form-drawer"
      :visible.sync="drawerVisible"
      :before-close="handleClose"
    >
      <ImportForm
        :visible.sync="drawerVisible"
        @update-list="updateList"
      ></ImportForm>
    </el-drawer>
  </div>
</template>
<script>
import Pagination from '@/version2/pages/admin/components/Pagination.vue'
import ImportForm from './import-form'
import ImportProgress from './ImportProgress'
import gql from 'graphql-tag'

export default {
  name: 'MyImportRecords',
  components: { Pagination, ImportForm, ImportProgress },
  data() {
    return {
      page: 1,
      limit: 20,
      statusMap: {
        Finished: '已完成',
        Failed: '失败',
        Loading: '解析中',
        Importing: '导入中',
        Reverted: '已撤销'
      },
      drawerVisible: false,
      importRecordsWrap: {
        total: 0,
        importRecords: []
      }
    }
  },
  apollo: {
    importRecordsWrap: {
      query: gql`
        query($page: Int!, $limit: Int!) {
          importRecordsWrap: myImportRecords(page: $page, limit: $limit) {
            total
            importRecords {
              id
              file {
                id
                name
                token
              }
              fileName
              material {
                id
                name
              }
              device {
                id
                name
              }
              rowCount
              rowFinishedCount
              status
              errorMessage
              originErrorMessage
              fileSize
              blocked
              user {
                id
                account
              }
              importType
              decodeTemplate {
                id
                name
              }
              yield
              createdAt
            }
          }
        }
      `,
      client: 'adminClient',
      variables() {
        return {
          page: this.page,
          limit: this.limit
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.drawerVisible = false
    },
    handleSizeChange(val) {
      this.limit = val
    },
    handleCurrentChange(val) {
      this.page = val
    },
    timeFomatter(val) {
      var t = new Date(val.createdAt)
      return t.toLocaleString()
    },
    updateList() {
      this.$apollo.queries.importRecordsWrap.refetch()
    }
  }
}
</script>
<style lang="scss">
@import '@/version2/assets/scss/variables.scss';

$--import-data-table-border__color: #dedede;

.el-drawer__container:focus {
  outline: none;
}

.console-import-data {
  height: 100%;
  padding: 56px 63px 0 63px;
  box-sizing: border-box;

  .console-import-data__body {
    height: calc(100% - 96px);
    box-sizing: border-box;
    padding: 32px 0;

    .import-data-table__header th,
    .import-data-table__row td {
      text-align: left;
      height: 48px;
      font-size: 12px;
      color: #666;
    }

    .import-data-table__header th {
      border-top: 1px solid $--import-data-table-border__color;
    }

    .import-data-table__row td:first-child,
    .import-data-table__header th:first-child {
      padding-left: 16px;
      border-left: 1px solid $--import-data-table-border__color;
    }

    .import-data-table__row td:last-child,
    .import-data-table__header th:last-child {
      border-right: 1px solid $--import-data-table-border__color;
    }

    .inline-item {
      display: inline-block;
      vertical-align: middle;
      margin: 0 12px;
    }

    .el-table {
      .import-status {
        cursor: pointer;

        &.is-failed {
          color: $--font-color__danger;
        }
      }

      .import-operation-panel {
        text-align: right;
      }
    }
  }

  .console-import-data__header {
    .el-button.import-btn {
      padding: 9px 26px;
      background: linear-gradient(
        218deg,
        rgba(63, 227, 211, 1) 0%,
        rgba(94, 131, 242, 1) 100%
      );
      box-shadow: 0px 3px 20px rgba(94, 131, 242, 0.3);
      border-radius: 900px;
      color: #fff;

      img {
        padding-right: 8px;
      }
    }
  }

  .device-form-drawer {
    width: 83% !important;

    &:focus {
      outline: none;
    }

    .el-drawer__body:focus {
      outline: none;
    }
  }
}
</style>
