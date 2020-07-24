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
          <el-table-column label="当前启用">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.active"
                active-color="#3FE3D3"
                inactive-color="#CACACA"
                @change="changeActive"
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
        :versionID="editVersionID"
        :visible.sync="templateFormVisible"
        v-if="templateFormVisible"
      ></DecodeForm>
    </el-drawer>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import DecodeForm from './decode-form.vue'

export default {
  name: 'MaterialVersion',
  props: {
    id: [String, Number]
  },
  components: { DecodeForm },
  data() {
    return {
      versions: [],
      templateFormVisible: false,
      editVersionID: undefined
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
    editTemplate(id) {
      this.editVersionID = id
      this.templateFormVisible = true
    },
    newVersion() {
      alert('not implement newVersion')
    },
    changeActive() {
      alert('not implement changeActive')
    },
    redirect(route) {
      this.$router.push(route)
    }
  }
}
</script>
<style lang="scss">
.material-versions .decode-template-drawer {
  width: 83% !important;

  &:focus {
    outline: none;
  }

  .el-drawer__body:focus {
    outline: none;
  }
}
</style>
