<template>
  <div class="material-versions admin-page__content">
    <div class="admin-page__content-table">
      <div class="header">
        <div class="add-button">
          <el-button @click="newVersion" size="small">新增版本</el-button>
        </div>
      </div>
      <div class="body">
        <el-table :data="versions" stripe style="width: 100%" height="100%">
          <el-table-column
            type="index"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column prop="version" label="版本号"> </el-table-column>
          <el-table-column label="版本说明">
            <template slot-scope="scope">
              {{ scope.row.description || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="创建人">
            <template slot-scope="scope">
              {{ scope.row.user.name || scope.row.user.account || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="版本产量"> </el-table-column>
          <el-table-column label="版本良率">
            <template slot-scope="scope">
              {{ (scope.row.yield * 100).toFixed(2) }}%
            </template>
          </el-table-column>
          <el-table-column
            label="创建日期"
            prop="createdAt"
            width="160px"
            :formatter="timeFormatter"
          >
          </el-table-column>
          <el-table-column label="当前启用">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.active"
                active-color="#3FE3D3"
                inactive-color="#CACACA"
                @change="changeActive(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" class-name="config-column" width="280">
            <template slot-scope="scope">
              <span
                class="link"
                @click="
                  redirect({
                    name: 'console-material-versions__points',
                    params: { id: id, versionID: scope.row.id }
                  })
                "
                >尺寸或点位</span
              >
              <span> | </span>
              <span class="link" @click="editTemplate(scope.row.id)"
                >解析模板</span
              >
              <span> | </span>
              <span
                class="link"
                @click="
                  redirect({
                    name: 'console-material-versions__import-records',
                    params: { id: id, versionID: scope.row.id }
                  })
                "
                >导入记录</span
              >
              <span> | </span>
              <span
                class="link"
                @click="remove(scope.row.id)"
                style="color: rgba(251, 93, 98, 1)"
                >删除</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-drawer
      :withHeader="false"
      direction="rtl"
      :close-on-press-escape="false"
      custom-class="decode-template-drawer"
      :visible.sync="templateFormVisible"
    >
      <DecodeForm
        :versionID="scopeVersionID"
        :visible.sync="templateFormVisible"
        v-if="templateFormVisible"
      ></DecodeForm>
    </el-drawer>

    <el-drawer
      :withHeader="false"
      direction="rtl"
      :close-on-press-escape="false"
      custom-class="new-version-drawer"
      :visible.sync="versionFormVisible"
    >
      <VersionForm
        :versionID="scopeVersionID"
        :materialID="id"
        :visible.sync="versionFormVisible"
        @update-list="$apollo.queries.versions.refetch()"
        v-if="versionFormVisible"
      ></VersionForm>
    </el-drawer>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import DecodeForm from './decode-form.vue'
import VersionForm from './version-form'
import { timeFormatter } from '@/helpers.js'

export default {
  name: 'MaterialVersion',
  props: {
    id: [String, Number]
  },
  components: { DecodeForm, VersionForm },
  data() {
    return {
      versions: [],
      templateFormVisible: false,
      versionFormVisible: false,
      scopeVersionID: undefined
    }
  },
  apollo: {
    versions: {
      query: gql`
        query($id: Int!) {
          versions: materialVersions(id: $id) {
            id
            version
            user {
              id
              name
              account
            }
            active
            amount
            yield
            createdAt
            description
          }
        }
      `,
      variables() {
        return {
          id: this.id
        }
      },
      client: 'adminClient'
    }
  },
  methods: {
    remove(id) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: Int!) {
              response: deleteMaterialVersion(id: $id)
            }
          `,
          client: 'adminClient',
          variables: { id }
        })
        .then(() => {
          this.$message({ type: 'success', message: '删除成功' })
          var index = this.versions.findIndex((v) => v.id === id)
          this.versions.splice(index, 1)
        })
        .catch((e) => this.$GraphQLError(e))
    },
    editTemplate(id) {
      this.scopeVersionID = id
      this.templateFormVisible = true
    },
    newVersion() {
      this.versionFormVisible = true
    },
    changeActive(val) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: Int!, $active: Boolean!) {
              response: changeMaterialVersionActive(id: $id, active: $active)
            }
          `,
          client: 'adminClient',
          variables: {
            id: val.id,
            active: val.active
          }
        })
        .then(() => {
          this.$message({ type: 'success', message: '修改成功' })
          this.$apollo.queries.versions.refetch()
        })
        .catch((e) => this.$GraphQLError(e))
    },
    redirect(route) {
      this.$router.push(route)
    },
    timeFormatter() {
      return timeFormatter(arguments[2])
    }
  }
}
</script>
<style lang="scss">
.material-versions .decode-template-drawer,
.material-versions .new-version-drawer {
  width: 83% !important;
  .el-drawer__body {
    height: 100%;
    &:focus {
      outline: none;
    }
  }

  &:focus {
    outline: none;
  }
}
</style>
