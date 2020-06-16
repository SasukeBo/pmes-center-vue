<template>
  <div class="material-manage__listview">
    <div
      class="material-manage__listview-list"
      v-if="materialsWrap.total > 0 && materialsWrap.materials.length > 0"
    >
      <div class="material-manage__listview-header">
        <div class="search-input">
          <el-input placeholder="搜索料号" v-model="search" size="small">
          </el-input>

          <el-button size="mini">搜索</el-button>
        </div>

        <div class="add-button">
          <el-button
            size="small"
            @click="$router.push({ name: 'console-material-create' })"
            >添加料号</el-button
          >
        </div>
      </div>
      <div class="material-manage__listview-body">
        <el-table
          :data="materialsWrap.materials"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column prop="name" label="厂内料号"> </el-table-column>
          <el-table-column prop="customerCode" label="客户料号">
          </el-table-column>
          <el-table-column prop="projectRemark" label="专案描述">
          </el-table-column>
          <el-table-column
            prop="createdAt"
            label="创建日期"
            :formatter="timeFormatter"
          ></el-table-column>
          <el-table-column
            prop="updatedAt"
            label="创建日期"
            :formatter="timeFormatter"
          ></el-table-column>
          <el-table-column label="配置" class-name="config-column" width="350">
            <template slot-scope="scope">
              <span
                class="link"
                @click="
                  redirect({
                    name: 'console-material-points',
                    params: { id: scope.row.id, material: scope.row }
                  })
                "
                >检测项</span
              >
              <span> | </span>
              <span
                class="link"
                @click="
                  redirect({
                    name: 'console-material-decode-template',
                    params: { id: scope.row.id, material: scope.row }
                  })
                "
                >解析模板</span
              >
              <span> | </span>
              <span
                class="link"
                @click="
                  redirect({
                    name: 'console-material-import-record',
                    params: { id: scope.row.id, material: scope.row }
                  })
                "
                >导入记录</span
              >
              <span> | </span>
              <span
                class="link"
                @click="
                  redirect({
                    name: 'console-material-edit',
                    params: { id: scope.row.id, material: scope.row }
                  })
                "
                >编辑</span
              >
              <span> | </span>
              <span
                class="link"
                @click="remove(scope.row)"
                style="color: rgba(251, 93, 98, 1)"
                >删除</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <Pagination
        :currentPage="page"
        :total="materialsWrap.total"
        :pageSizes="[20, 50, 100, 300]"
        :pageSize="20"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></Pagination>
    </div>
    <div class="material-manage__listview-empty" v-else>
      <img src="~@/version2/assets/images/material-no-content.png" />
      <span class="material-no-content__tip">暂无料号</span>
      <div>
        <el-button
          size="small"
          class="add-material-btn"
          @click="$router.push({ name: 'console-material-create' })"
          >添加料号</el-button
        >
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import '~@/version2/assets/scss/material_manage_listview.scss';
</style>
<script>
import gql from 'graphql-tag'
import Pagination from '@/version2/components/Pagination.vue'
export default {
  components: { Pagination },
  data() {
    return {
      pattern: '',
      search: '',
      page: 1,
      limit: 20,
      materialsWrap: {
        total: 1,
        materials: []
      }
    }
  },
  apollo: {
    materialsWrap: {
      query: gql`
        query($pattern: String, $page: Int!, $limit: Int!) {
          materialsWrap: materials(
            pattern: $pattern
            page: $page
            limit: $limit
          ) {
            total
            materials {
              id
              name
              createdAt
              updatedAt
              customerCode
              projectRemark
            }
          }
        }
      `,
      client: 'adminClient',
      fetchPolicy: 'network-only',
      variables() {
        return {
          pattern: this.pattern,
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
    redirect(obj) {
      this.$router.push(obj)
    },
    timeFormatter() {
      var t = new Date(arguments[2])
      return t.toLocaleString()
    },
    remove(material) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: Int!) {
              response: deleteMaterial(id: $id)
            }
          `,
          variables: {
            id: material.id
          },
          client: 'adminClient'
        })
        .then(({ data: { response } }) => {
          if (response === 'OK') {
            this.$apollo.queries.materialsWrap.refetch()
          }
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.message.replace('GraphiQL error:', '')
          })
        })
    }
  },
  created() {
    this.$store.commit('SET_PAGE_TITLE', '料号列表')
  }
}
</script>
