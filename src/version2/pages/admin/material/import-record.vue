<template>
  <div class="console-import-record">
    <div class="record-operation-btn">
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
            {{ scope.row.user ? scope.row.user.account : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="导入方式" prop="importType"></el-table-column>
        <el-table-column label="文件大小" prop="fileSize">
          <template slot-scope="scope">
            {{ (scope.row.fileSize / 1024 / 1024).toFixed(2) }} MB
          </template>
        </el-table-column>
        <el-table-column label="解析模板">
          <template slot-scope="scope">
            {{ scope.row.decodeTemplate ? scope.row.decodeTemplate.name : '-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="导入时间"
          :formatter="timeFormatter"
          prop="createdAt"
        ></el-table-column>
        <el-table-column label="数据总行数" prop="rowCount"></el-table-column>
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

    <ImportRecordFilterDialog
      :visible.sync="searchFormVisible"
      :form.sync="searchForm"
    ></ImportRecordFilterDialog>
  </div>
</template>
<script>
import Pagination from '@/version2/pages/admin/components/Pagination.vue'
import ImportRecordFilterDialog from '@/version2/pages/admin/components/ImportRecordFilterDialog.vue'
import gql from 'graphql-tag'

export default {
  name: 'MaterialImportRecords',
  props: ['id', 'material'],
  components: { Pagination, ImportRecordFilterDialog },
  data() {
    return {
      page: 1,
      limit: 20,
      forceUpdateTable: true,
      searchForm: {
        duration: [],
        status: []
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
        Loading: '导入中',
        Reverted: '已撤销'
      }
    }
  },
  apollo: {
    importRecordsWrap: {
      query: gql`
        query(
          $materialID: Int!
          $deviceID: Int
          $page: Int!
          $limit: Int!
          $search: ImportRecordSearch!
        ) {
          importRecordsWrap: importRecords(
            materialID: $materialID
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
              status
              errorMessage
              originErrorMessage
              fileSize
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
          materialID: this.id,
          page: this.page,
          limit: this.limit,
          search: this.searchForm
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
      var btn = this.$refs[`revert_btn${record.id}`]
      btn.loading = true
      this.$apollo
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
          this.$message({ type: 'success', message: '撤销导入成功' })
          btn.loading = false
          this.$apollo.queries.importRecordsWrap.refetch()
        })
        .catch((e) => {
          btn.loading = false
          this.$$GraphQLError(e)
        })
    },
    handleSizeChange(val) {
      this.limit = val
    },
    handleCurrentChange(val) {
      this.page = val
    },
    timeFormatter() {
      var t = new Date(arguments[2])
      return t.toLocaleString()
    },
    handleSelectionChange(values) {
      this.selectedRecords = values
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
