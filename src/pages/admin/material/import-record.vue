<template>
  <div class="console-import-record">
    <div class="record-operation-btn">
      <el-button
        type="primary"
        size="small"
        @click="downloadSelected()"
        :loading="downloading"
        :disabled="downloading"
        >下载已选</el-button
      >
      <el-button type="primary" size="small" @click="revertSelected()"
        >撤销已选</el-button
      >
      <el-button type="primary" size="small" @click="blockSelected(true)"
        >屏蔽已选</el-button
      >
      <el-button type="primary" size="small" @click="blockSelected(false)"
        >取消屏蔽已选</el-button
      >
      <el-button type="primary" size="small" @click="searchFormVisible = true"
        >过滤条件</el-button
      >
    </div>

    <div class="import-record-table">
      <el-table
        stripe
        v-if="forceUpdateTable"
        :data="importRecordsWrap.importRecords"
        height="100%"
        header-row-class-name="import-record-table__header"
        row-class-name="import-record-table__row"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="80px"
        ></el-table-column>
        <el-table-column label="文件名" prop="fileName">
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
        <el-table-column label="设备">
          <template slot-scope="scope">
            {{ scope.row.device ? scope.row.device.name : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="导入者">
          <template slot-scope="scope">
            <span v-if="scope.row.user">
              {{ scope.row.user.name || scope.row.user.account }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="导入方式" prop="importType"></el-table-column>
        <el-table-column label="文件大小" prop="fileSize">
          <template slot-scope="scope">
            {{ (scope.row.fileSize / 1024 / 1024).toFixed(2) }} MB
          </template>
        </el-table-column>
        <el-table-column label="版本号">
          <template slot-scope="scope">
            <span v-if="scope.row.materialVersion">
              {{ scope.row.materialVersion.version }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          label="导入时间"
          :formatter="timeFormatter"
          prop="createdAt"
          width="100px"
        ></el-table-column>
        <el-table-column label="数据总行数" prop="rowCount"></el-table-column>
        <el-table-column
          label="无效行数"
          prop="rowInvalidCount"
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
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              width="200"
              trigger="click"
              :disabled="scope.row.status !== 'Failed'"
            >
              <div style="color: #666">
                <div style="font-weight: bold; padding-bottom: 4px">
                  错误信息：
                </div>
                <div>{{ scope.row.errorMessage }}</div>
                <div
                  style="font-weight: bold; padding-bottom: 4px; padding-top: 8px"
                >
                  原始错误：
                </div>
                <div>{{ scope.row.originErrorMessage }}</div>
              </div>
              <span
                slot="reference"
                :style="{
                  color: scope.row.status === 'Failed' ? '#FB5D62' : '',
                  cursor: scope.row.status === 'Failed' ? 'pointer' : ''
                }"
                >{{ statusMap[scope.row.status] }}</span
              >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="屏蔽数据">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.blocked"
              @change="toggleBlockRecord(scope.row)"
              active-color="#ffb764"
              inactive-color="#666"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 'Finished'"
              class="import-record-revert"
              type="text"
              :ref="'revert_btn' + scope.row.id"
              @click="revert(scope.row)"
              >撤销</el-button
            >
            <el-button
              v-if="['Finished', 'Importing'].includes(scope.row.status)"
              class="import-record-revert"
              type="text"
              @click="downloadFile(scope.row.id)"
              >下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <Pagination
      :currentPage="page"
      :total="importRecordsWrap.total"
      :pageSizes="[20, 50, 100, 300]"
      :pageSize="limit"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></Pagination>

    <div class="go-back">
      <el-button
        type="primary"
        size="small"
        @click="$router.go(-1)"
        style="width: 100px"
      >
        返回</el-button
      >
    </div>

    <ImportRecordFilterDialog
      :visible.sync="searchFormVisible"
      :form.sync="searchForm"
    ></ImportRecordFilterDialog>
  </div>
</template>
<script>
import Pagination from '@//pages/admin/components/Pagination.vue'
import ImportRecordFilterDialog from '@//pages/admin/components/ImportRecordFilterDialog.vue'
import { timeFormatter } from '@/utils/helpers.js'
import gql from 'graphql-tag'

export default {
  name: 'MaterialImportRecords',
  props: {
    id: [Number, String],
    versionID: [Number, String]
  },
  components: { Pagination, ImportRecordFilterDialog },
  data() {
    return {
      page: 1,
      limit: 20,
      forceUpdateTable: true,
      downloading: false,
      searchForm: {
        duration: [],
        status: ['Finished', 'Importing', 'Failed']
      },
      selectedRecords: [],
      searchFormVisible: false,
      importRecordsWrap: {
        total: 0,
        importRecords: []
      },
      statusMap: {
        Finished: '已完成',
        Failed: '失败',
        Importing: '导入中',
        Reverted: '已撤销'
      }
    }
  },
  apollo: {
    importRecordsWrap: {
      query: gql`
        query(
          $id: Int!
          $deviceID: Int
          $page: Int!
          $limit: Int!
          $search: ImportRecordSearch!
        ) {
          importRecordsWrap: importRecords(
            materialVersionID: $id
            deviceID: $deviceID
            page: $page
            limit: $limit
            search: $search
          ) {
            total
            importRecords {
              id
              fileName
              device {
                id
                name
              }
              file {
                id
                name
                token
              }
              blocked
              rowCount
              rowFinishedCount
              rowInvalidCount
              status
              errorMessage
              originErrorMessage
              fileSize
              user {
                id
                name
                account
              }
              importType
              materialVersion {
                id
                version
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
          id: this.versionID,
          page: this.page,
          limit: this.limit,
          search: {
            date: this.searchForm.date,
            duration: this.searchForm.duration || [],
            status: this.searchForm.status || [],
            fileName: this.searchForm.fileName || undefined,
            userID: this.searchForm.userID || undefined
          }
        }
      },
      skip() {
        return this.searchFormVisible
      }
    }
  },
  methods: {
    toggleBlockRecord(record) {
      var block = record.blocked
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($ids: [Int!]!, $block: Boolean!) {
              response: toggleBlockImports(ids: $ids, block: $block)
            }
          `,
          client: 'adminClient',
          variables: {
            ids: [record.id],
            block
          }
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: `已${block ? '' : '取消'}屏蔽此次导入的文件数据`
          })
        })
        .catch((e) => {
          this.$GraphQLError(e)
          record.blocked = !block
        })
    },
    revert(record) {
      var _this = this
      this.$confirm(
        '撤销导入记录后将从系统中移除此次导入的数据，并且不再显示该导入记录，确定要撤销吗？',
        '您正在撤销导入',
        {
          type: 'warning',
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '放弃'
        }
      )
        .then(() => {
          var btn = _this.$refs[`revert_btn${record.id}`]
          btn.loading = true
          _this.$apollo
            .mutate({
              mutation: gql`
                mutation($ids: [Int!]!) {
                  response: revertImports(ids: $ids)
                }
              `,
              client: 'adminClient',
              variables: {
                ids: [record.id]
              }
            })
            .then(() => {
              _this.$message({ type: 'success', message: '撤销导入成功' })
              btn.loading = false
              _this.$apollo.queries.importRecordsWrap.refetch()
            })
            .catch((e) => {
              btn.loading = false
              _this.$$GraphQLError(e)
            })
        })
        .catch(() => undefined)
    },
    handleSizeChange(val) {
      this.limit = val
    },
    handleCurrentChange(val) {
      this.page = val
    },
    timeFormatter() {
      return timeFormatter(arguments[2])
    },
    handleSelectionChange(values) {
      this.selectedRecords = values
    },
    downloadSelected() {
      var length = this.selectedRecords.length
      if (length === 0) return
      var ids = this.selectedRecords.map((r) => r.id)

      this.download(ids)
    },
    download(ids) {
      this.downloading = true
      this.$apollo
        .query({
          query: gql`
            query($ids: [Int!]!) {
              fileToken: downloadImportRecords(ids: $ids)
            }
          `,
          fetchPolicy: 'network-only',
          client: 'adminClient',
          variables: { ids }
        })
        .then(({ data }) => {
          this.downloading = false
          var el = document.createElement('form')
          el.setAttribute('action', '/downloads/xlsx')
          el.setAttribute('method', 'GET')
          el.setAttribute('target', '_blank')
          el.setAttribute('style', 'display:none')
          var input = document.createElement('input')
          input.setAttribute('type', 'hidden')
          input.setAttribute('name', 'file_token')
          input.setAttribute('value', data.fileToken)
          el.appendChild(input)
          document.body.appendChild(el)
          el.submit()
          document.body.removeChild(el)
        })
        .catch((e) => {
          this.downloading = false
          this.$GraphQLError(e)
        })
    },
    downloadFile(id) {
      this.download([id])
    },
    revertSelected() {
      var length = this.selectedRecords.length
      if (length === 0) return
      var ids = this.selectedRecords.map((r) => r.id)

      this.$confirm(
        `此操作将撤销 ${length} 条导入记录的数据，确定继续吗？`,
        '确认信息',
        {
          type: 'warning',
          distinguishCancelAndClose: true,
          confirmButtonText: '继续',
          cancelButtonText: '放弃'
        }
      )
        .then(() => {
          this.$apollo
            .mutate({
              mutation: gql`
                mutation($ids: [Int!]!) {
                  response: revertImports(ids: $ids)
                }
              `,
              client: 'adminClient',
              variables: {
                ids
              }
            })
            .then(() => {
              this.$message({ type: 'success', message: '撤销导入成功' })
              this.$apollo.queries.importRecordsWrap.refetch()
              this.selectedRecords = []
            })
            .catch((e) => {
              this.$message({
                type: 'error',
                message: e.message.replace('GraphQL error:', '')
              })
            })
        })
        .catch(() => undefined)
    },
    blockSelected(block) {
      var length = this.selectedRecords.length
      if (length === 0) return
      var ids = this.selectedRecords.map((r) => r.id)

      this.$confirm(
        `此操作将${
          block ? '' : '取消'
        }屏蔽 ${length} 条导入记录的数据，确定继续吗？`,
        '确认信息',
        {
          type: 'warning',
          distinguishCancelAndClose: true,
          confirmButtonText: '继续',
          cancelButtonText: '放弃'
        }
      )
        .then(() => {
          this.$apollo
            .mutate({
              mutation: gql`
                mutation($ids: [Int!]!, $block: Boolean!) {
                  response: toggleBlockImports(ids: $ids, block: $block)
                }
              `,
              client: 'adminClient',
              variables: {
                ids,
                block
              }
            })
            .then(() => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$apollo.queries.importRecordsWrap.refetch()
            })
            .catch((e) => {
              this.$GraphQLError(e)
            })
        })
        .catch(() => undefined)
    }
  },
  watch: {
    importRecordsWrap() {
      this.forceUpdateTable = false
      setTimeout(() => {
        this.forceUpdateTable = true
      })
    }
  },
  created() {
    if (this.material) {
      this.$store.commit('SET_PAGE_TITLE', `${this.material.name}数据导入记录`)
    }
  }
}
</script>
<style lang="scss">
.console-import-record {
  height: 100%;
  position: relative;

  .go-back {
    position: absolute;
    bottom: 16px;
    right: 32px;
  }

  .record-operation-btn {
    position: absolute;
    right: 32px;
    top: -48px;

    .el-button {
      box-shadow: 1px 1px 10px rgba(94, 131, 242, 0.8);
    }
  }

  .import-record-table {
    padding: 32px 32px 0 32px;
    box-sizing: border-box;
    height: calc(100% - 64px);

    .el-table:before {
      display: none;
    }

    .import-record-table__header {
      height: 64px;

      th {
        background: #5e83f2;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
      }
    }

    .cell {
      text-align: center;
    }

    .import-record-table__row {
      height: 48px;

      &.el-table__row--striped {
        background: rgba(243, 244, 244, 0.8);
      }

      td {
        padding: 0;
        border-bottom: none;
      }

      .cell {
        font-size: 12px;
        color: #666;
        font-weight: 400;
      }
    }

    .import-record-revert {
      color: #3fe3d3;
      font-size: 12px;
    }
  }
}
</style>
