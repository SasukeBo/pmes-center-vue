<template>
  <div class="admin-page" v-loading="$apollo.queries.materialsWrap.loading">
    <div style="height: 300px" v-if="!materialsWrap"></div>
    <el-table v-else :data="materialsWrap.materials">
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="customerCode" label="客户料号"></el-table-column>
      <el-table-column prop="projectRemark" label="专案描述"></el-table-column>
      <el-table-column>
        <template slot="header">
          <el-button icon="el-icon-plus" size="mini" type="primary" @click="add"
            >新增料号</el-button
          >
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="editMaterial(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="mini"
            @click="deleteMaterial(scope.row.id)"
            >删除</el-button
          >
          <el-button
            type="text"
            size="mini"
            @click="
              $router.push({
                name: 'admin-import-records',
                params: { id: scope.row.id }
              })
            "
            >导入记录</el-button
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
      :total="materialsWrap.total"
    >
    </el-pagination>

    <NotifyDialog
      :visible.sync="notifyDialogVisible"
      @confirm="openLoginDialog"
    ></NotifyDialog>

    <MaterialDialog
      :visible.sync="materialDialogVisible"
      :isEdit.sync="isEdit"
      :material="materialForm"
      @after-create="$apollo.queries.materialsWrap.refetch()"
    ></MaterialDialog>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import NotifyDialog from '@/version1/components/NotifyDialog.vue'
import MaterialDialog from '@/version1/components/MaterialDialog.vue'

export default {
  name: 'AdminPage',
  components: {
    NotifyDialog,
    MaterialDialog
  },
  data() {
    return {
      page: 1,
      limit: 100,
      materialsWrap: {
        total: 0,
        materials: []
      },
      materialForm: {},
      isEdit: false,
      materialDialogVisible: false,
      notifyDialogVisible: false
    }
  },
  apollo: {
    materialsWrap: {
      query: gql`
        query($page: Int!, $limit: Int!) {
          materialsWrap: materials(page: $page, limit: $limit) {
            total
            materials {
              id
              name
              customerCode
              projectRemark
            }
          }
        }
      `,
      variables() {
        return {
          page: this.page,
          limit: this.limit
        }
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val
    },
    handleCurrentChange(val) {
      this.page = val
    },
    add() {
      if (this.$store.state.currentUser) {
        this.materialDialogVisible = true
      } else {
        this.notifyDialogVisible = true
      }
    },
    openLoginDialog() {
      this.$store.commit('SET_LOGIN_DIALOG_VISIBLE', true)
    },
    deleteMaterial(id) {
      if (this.$store.state.currentUser) {
        this.$confirm('确定删除此料号？删除将会抹除料号的所有数据。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$apollo
              .mutate({
                mutation: gql`
                  mutation($id: Int!) {
                    result: deleteMaterial(id: $id)
                  }
                `,
                variables: { id }
              })
              .then(({ data: { result } }) => {
                if (parseInt(this.recent) === parseInt(id)) {
                  localStorage.setItem('recent_view_material_id', '')
                }
                this.$apollo.queries.materialsWrap.refetch()
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: e.message.replace('GraphQL error:', '')
                })
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.notifyDialogVisible = true
      }
    },
    editMaterial(material) {
      if (this.$store.state.currentUser) {
        this.isEdit = true
        this.materialForm = material
        this.materialDialogVisible = true
      } else {
        this.notifyDialogVisible = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.admin-page {
  background: #fff;
  padding: 32px;
  border-radius: 4px;
  margin-top: 16px;
  margin-bottom: 32px;

  .el-pagination {
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid #999;
  }
}
</style>
