<template>
  <div class="console-import-record">
    <div class="import-record-table">
      <el-table
        stripe
        :data="importRecordsWrap.importRecords"
        height="100%"
        header-row-class-name="import-record-table__header"
        row-class-name="import-record-table__row"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80px"
        ></el-table-column>
        <el-table-column label="文件名" prop="fileName"></el-table-column>
        <el-table-column label="导入者">
          <template slot-scope="scope">
            {{ scope.row.user ? scope.row.user.name : '-' }}
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
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ statusMap[scope.row.status] }}
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
  </div>
</template>
<script>
import Pagination from '@/version2/pages/admin/components/Pagination.vue'
import gql from 'graphql-tag'
export default {
  props: {
    id: [Number, String]
  },
  components: { Pagination },
  data() {
    return {
      device: undefined,
      page: 1,
      limit: 20,
      statusMap: {
        Finished: '已完成',
        Failed: '失败',
        Loading: '导入中',
        Reverted: '已撤销'
      },
      importRecordsWrap: {
        total: 0,
        importRecords: []
      }
    }
  },
  apollo: {
    device: {
      query: gql`
        query($id: Int!) {
          device(id: $id) {
            id
            name
            material {
              id
            }
          }
        }
      `,
      client: 'adminClient',
      variables() {
        return {
          id: this.id
        }
      }
    },
    importRecordsWrap: {
      query: gql`
        query($materialID: Int!, $deviceID: Int, $page: Int!, $limit: Int!) {
          importRecordsWrap: importRecords(
            materialID: $materialID
            deviceID: $deviceID
            page: $page
            limit: $limit
          ) {
            total
            importRecords {
              id
              fileName
              material {
                id
                name
              }
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
              createdAt
            }
          }
        }
      `,
      client: 'adminClient',
      variables() {
        return {
          materialID: this.device.material.id,
          deviceID: this.device.id,
          page: this.page,
          limit: this.limit
        }
      },
      skip() {
        return !this.device
      }
    }
  },
  methods: {
    revert(record) {
      var btn = this.$refs[`revert_btn${record.id}`]
      btn.loading = true
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: Int!) {
              response: revertImport(id: $id)
            }
          `,
          client: 'adminClient',
          variables: {
            id: record.id
          }
        })
        .then(() => {
          this.$message({ type: 'success', message: '撤销导入成功' })
          btn.loading = false
          this.$apollo.queries.importRecordsWrap.refetch()
        })
        .catch((e) => {
          btn.loading = false
          this.$message({
            type: 'error',
            message: e.message.replace('GraphQL error:', '')
          })
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
    }
  },
  watch: {
    device: {
      immediate: true,
      handler: function(val) {
        if (val) {
          this.$store.commit('SET_PAGE_TITLE', `${val.name}数据导入记录`)
        } else {
          this.$store.commit('SET_PAGE_TITLE', '设备数据导入记录')
        }
      }
    }
  }
}
</script>
<style lang="scss">
.console-import-record {
  height: 100%;

  .import-record-table {
    padding: 32px;
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
