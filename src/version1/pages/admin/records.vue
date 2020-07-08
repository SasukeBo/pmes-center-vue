<template>
  <div
    class="admin-import-records"
    v-loading="$apollo.queries.recordsWrap.loading"
  >
    <div style="height: 300px" v-if="!recordsWrap"></div>
    <el-table v-else :data="recordsWrap.records">
      <el-table-column prop="path" label="文件路径"> </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.finished ? '已完成' : '未完成' }}
        </template>
      </el-table-column>
      <el-table-column label="进度">
        <template slot-scope="scope">
          <FinishPercent
            :record="scope.row"
            :finished.sync="scope.row.finished"
          ></FinishPercent>
        </template>
      </el-table-column>

      <el-table-column>
        <template slot="header">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="newImport"
            >导入数据</el-button
          >
        </template>

        <template slot-scope="scope">
          <el-button type="text" @click="revertImport(scope.row.id)"
            >撤销导入</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="limit"
      layout="sizes, prev, pager, next"
      :total="recordsWrap.total"
    >
    </el-pagination>

    <el-dialog title="添加导入文件" :visible.sync="importFormVisible">
      <el-form size="small">
        <el-form-item label="填写文件在Ftp服务器下的相对路径">
          <div style="font-size: 12px; color: #999">
            例如：./1756/1756-CCD-20200627-w.xlsx
          </div>
          <el-input v-model="path"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="importLoading"
          >提 交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import FinishPercent from './FinishPercent'

export default {
  name: 'AdminImportRecords',
  props: {
    id: [Number, String]
  },
  components: { FinishPercent },
  data() {
    return {
      recordsWrap: {
        total: 0,
        records: []
      },
      limit: 100,
      page: 1,
      path: '',
      importFormVisible: false,
      importLoading: false
    }
  },
  apollo: {
    recordsWrap: {
      query: gql`
        query($materialID: Int!, $limit: Int!, $page: Int!) {
          recordsWrap: importRecords(
            materialID: $materialID
            limit: $limit
            page: $page
          ) {
            total
            records {
              id
              path
              finished
              totalRows
              finishedRows
            }
          }
        }
      `,
      variables() {
        return {
          materialID: this.id,
          limit: this.limit,
          page: this.page
        }
      }
    }
  },
  created() {},
  methods: {
    handleSizeChange(size) {
      this.limit = size
    },
    handleCurrentChange(page) {
      this.page = page
    },
    revertImport(id) {
      this.$confirm('确定撤销该文件数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$apollo
            .mutate({
              mutation: gql`
                mutation($id: Int!) {
                  revertRecord(id: $id)
                }
              `,
              variables: { id }
            })
            .then(() => {
              this.$apollo.queries.recordsWrap.refetch()
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
    newImport() {
      this.importFormVisible = true
    },
    submit() {
      this.importLoading = true
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($materialID: Int!, $path: String!) {
              importData(materialID: $materialID, path: $path)
            }
          `,
          variables: {
            materialID: this.id,
            path: this.path
          }
        })
        .then(() => {
          this.importLoading = false
          this.cancel()
          this.$apollo.queries.recordsWrap.refetch()
        })
        .catch((e) => {
          this.importLoading = false
          this.$message({
            type: 'error',
            message: e.message.replace('GraphQL error:', '')
          })
        })
    },
    cancel() {
      this.path = ''
      this.importFormVisible = false
    }
  }
}
</script>
<style lang="scss">
.admin-import-records {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  margin: 16px 0;

  .el-pagination {
    text-align: center;
    padding-top: 16px;
  }
}
</style>
