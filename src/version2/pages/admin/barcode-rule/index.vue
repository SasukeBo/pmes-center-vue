<template>
  <div class="admin-bar-code admin-page__content">
    <div class="admin-page__content-table">
      <div class="header">
        <div class="search-input">
          <el-input
            placeholder="搜索规则"
            v-model="pattern"
            size="small"
            @keyup.enter.native.prevent="form.search = pattern"
          >
          </el-input>

          <el-button size="mini" @click="form.search = pattern">搜索</el-button>
        </div>

        <div class="add-button">
          <el-button size="small" @click="add">新增</el-button>
        </div>
      </div>

      <div class="body">
        <el-table
          :data="barCodeRules.rules"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column prop="name" label="名称"> </el-table-column>
          <el-table-column prop="remark" label="描述"> </el-table-column>
          <el-table-column prop="user" label="创建人">
            <template slot-scope="scope">
              {{ scope.row.user.name || scope.row.user.account }}
            </template>
          </el-table-column>
          <el-table-column
            prop="createdAt"
            label="创建时间"
            :formatter="timeFormatter"
          >
          </el-table-column>
          <el-table-column label="操作" class-name="config-column" width="300">
            <template slot-scope="scope">
              <span class="link" @click="edit(scope.row)">编辑</span>
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
        :currentPage="form.page"
        :total="barCodeRules.total"
        :pageSizes="[20, 50, 100, 300]"
        :pageSize="20"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></Pagination>
    </div>

    <el-drawer
      :withHeader="false"
      direction="rtl"
      :close-on-press-escape="false"
      custom-class="barcode-rule-drawer"
      :visible.sync="drawerVisible"
      :before-close="handleClose"
    >
      <BarCodeRuleForm
        :rule="editRule"
        @update-list="$apollo.queries.barCodeRules.refetch()"
        :visible.sync="drawerVisible"
      ></BarCodeRuleForm>
    </el-drawer>

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
  </div>
</template>
<script>
import gql from 'graphql-tag'
import { timeFormatter } from '@/helpers.js'
import Pagination from '@/version2/pages/admin/components/Pagination.vue'
import BarCodeRuleForm from './barcode-rule-form'

export default {
  name: 'AdminBarCode',
  components: { Pagination, BarCodeRuleForm },
  data() {
    return {
      pattern: '',
      editRule: undefined,
      barCodeRules: {
        total: 0,
        rules: []
      },
      drawerVisible: false,
      form: {
        search: '',
        limit: 20,
        page: 1
      }
    }
  },
  apollo: {
    barCodeRules: {
      query: gql`
        query($search: String, $limit: Int!, $page: Int!) {
          barCodeRules: listBarCodeRules(
            search: $search
            limit: $limit
            page: $page
          ) {
            total
            rules {
              id
              codeLength
              name
              remark
              user {
                id
                name
                account
              }
              items {
                label
                key
                indexRange
                type
                dayCode
                monthCode
              }
              createdAt
            }
          }
        }
      `,
      client: 'adminClient',
      variables() {
        return {
          search: this.form.search,
          limit: this.form.limit,
          page: this.form.page
        }
      }
    }
  },
  methods: {
    add() {
      this.drawerVisible = true
    },
    edit(rule) {
      this.editRule = rule
      this.drawerVisible = true
    },
    remove(rule) {},
    handleSizeChange() {},
    handleCurrentChange() {},
    timeFormatter(val) {
      return timeFormatter(val.createdAt)
    },
    handleClose() {
      this.drawerVisible = false
    }
  }
}
</script>
<style lang="scss">
@import '~@/version2/assets/scss/admin/main_page_content.scss';

.admin-entry .admin-bar-code {
  position: relative;

  .go-back {
    position: absolute;
    bottom: 16px;
    right: 32px;
  }
}
</style>
