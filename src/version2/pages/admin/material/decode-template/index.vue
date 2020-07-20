<template>
  <div class="console-decode-template">
    <div class="decode-template-table">
      <div class="default-template-tip">
        <i class="el-icon-warning"></i>
        默认模板会影响数据的解析和设备的数据上传，设置时请谨慎。
      </div>
      <el-table
        border
        height="100%"
        :data="templates"
        header-row-class-name="decode-template-table__header"
        row-class-name="decode-template-table__row"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80px"
        ></el-table-column>
        <el-table-column label="模板名称" prop="name"></el-table-column>
        <el-table-column label="默认模板" prop="default">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.default"
              @change="changeDefault(scope.row)"
              active-color="#3FE3D3"
              inactive-color="#CACACA"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建人">
          <template slot-scope="scope">
            {{ scope.row.user ? scope.row.user.account : '-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建日期"
          prop="createdAt"
          :formatter="timeFormatter"
        ></el-table-column>
        <el-table-column label="备注" prop="description"></el-table-column>
        <el-table-column>
          <template slot="header">
            <el-button type="primary" size="small" @click="appendTemplate">
              + 新增模板
            </el-button>
          </template>
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <span> | </span>
            <el-button type="text" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="decode-template-footer">
      <FButton size="small" @click="$router.go(-1)" type="plain">返回</FButton>
    </div>

    <el-drawer
      :withHeader="false"
      direction="rtl"
      :close-on-press-escape="false"
      custom-class="decode-template-drawer"
      :visible.sync="drawerVisible"
      :before-close="handleClose"
    >
      <DecodeForm
        :materialID="id"
        :points="points"
        :data="editTemplate"
        :visible.sync="drawerVisible"
        :isEdit="isDecodeFormEdit"
        @update-list="$apollo.queries.templates.refetch()"
      ></DecodeForm>
    </el-drawer>
  </div>
</template>
<script>
import DecodeForm from './decode-form.vue'
import FButton from '@/version2/pages/admin/components/FButton.vue'
import gql from 'graphql-tag'
export default {
  name: 'DecodeTemplateList',
  props: ['id', 'material'],
  components: { FButton, DecodeForm },
  apollo: {
    templates: {
      query: gql`
        query($materialID: Int!) {
          templates: listDecodeTemplate(materialID: $materialID) {
            id
            name
            user {
              id
              account
            }
            description
            dataRowIndex
            createdAtColumnIndex
            productColumns {
              token
              label
              index
              type
              prefix
            }
            pointColumns
            default
            createdAt
            updatedAt
          }
        }
      `,
      client: 'adminClient',
      variables() {
        return {
          materialID: this.id
        }
      }
    },
    points: {
      query: gql`
        query($materialID: Int!) {
          points: listMaterialPoints(materialID: $materialID) {
            id
            name
            upperLimit
            lowerLimit
            nominal
          }
        }
      `,
      client: 'adminClient',
      variables() {
        return {
          materialID: this.id
        }
      }
    }
  },
  data() {
    return {
      drawerVisible: false,
      templates: [],
      points: [],
      isDecodeFormEdit: false,
      editTemplate: undefined
    }
  },
  created() {
    if (this.material) {
      this.$store.commit('SET_PAGE_TITLE', `${this.material.name}解析模板`)
    } else {
      this.$apollo
        .query({
          query: gql`
            query($id: Int!) {
              response: material(id: $id) {
                name
              }
            }
          `,
          client: 'adminClient',
          variables: {
            id: this.id
          }
        })
        .then(({ data: { response } }) => {
          this.$store.commit('SET_PAGE_TITLE', `${response.name}解析模板`)
        })
        .catch(() => {
          this.$store.commit('SET_PAGE_TITLE', '料号解析模板')
        })
    }
  },
  methods: {
    handleClose() {
      this.drawerVisible = false
    },
    timeFormatter() {
      var t = new Date(arguments[2])
      return t.toLocaleString()
    },
    edit(val) {
      this.isDecodeFormEdit = true
      this.editTemplate = val
      this.drawerVisible = true
    },
    remove(val) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: Int!) {
              response: deleteDecodeTemplate(id: $id)
            }
          `,
          client: 'adminClient',
          variables: {
            id: val.id
          }
        })
        .then(({ data: { response } }) => {
          this.$message({ type: 'success', message: '删除解析模板成功' })
          this.$apollo.queries.templates.refetch()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.message.replace('GraphQL error:', '')
          })
        })
    },
    appendTemplate() {
      this.isDecodeFormEdit = false
      this.editTemplate = undefined
      this.drawerVisible = true
    },
    changeDefault(val) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: Int!, $isDefault: Boolean!) {
              response: changeDefaultTemplate(id: $id, isDefault: $isDefault)
            }
          `,
          client: 'adminClient',
          variables: {
            id: val.id,
            isDefault: val.default
          }
        })
        .then(() => {
          this.$message({ type: 'success', message: '修改成功' })
          this.$apollo.queries.templates.refetch()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.message.replace('GraphQL error:', '')
          })
        })
    }
  }
}
</script>
<style lang="scss">
.console-decode-template {
  height: 100%;

  .decode-template-footer {
    height: 64px;
    text-align: center;
    line-height: 64px;
    box-sizing: border-box;
    border-top: 1px solid rgba(202, 202, 202, 1);
  }

  .decode-template-table {
    height: calc(100% - 64px);
    padding: 56px 106px;
    box-sizing: border-box;

    .default-template-tip {
      font-size: 14px;
      color: #666;
      position: absolute;
      top: 30px;
    }

    .append-template-btn {
      height: 64px;
      line-height: 64px;
      text-align: center;
      cursor: pointer;
      color: #5e83f2;
      font-size: 14px;
      font-weight: bold;
      border: 1px solid #ebeef5;
      border-top: none;
    }

    .decode-template-table__header {
      height: 64px;

      th {
        text-align: center;
        background: #f3f4f4;
        color: #666;
        font-size: 14px;
        font-weight: bold;
      }
    }

    .decode-template-table__row {
      height: 64px;

      td {
        text-align: center;
        color: #666;
        font-size: 12px;
      }
    }
  }

  .decode-template-drawer {
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
