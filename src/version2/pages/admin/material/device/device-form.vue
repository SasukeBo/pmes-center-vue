<template>
  <div class="device-form">
    <div class="device-form__header">
      新增检测设备
    </div>

    <div class="device-form__body">
      <el-form
        :model="form"
        :rules="rules"
        size="small"
        label-width="100px"
        ref="form"
      >
        <el-form-item prop="name" label="设备名称:">
          <el-input v-model="form.name" placeholder="请输入设备名称"></el-input>
        </el-form-item>

        <el-form-item label="料号:" prop="materialID">
          <el-input v-model="materialName" disabled> </el-input>
        </el-form-item>
        <el-form-item label="厂商:">
          <el-input
            v-model="form.deviceSupplier"
            placeholder="请输入厂商"
          ></el-input>
        </el-form-item>
        <el-form-item label="物理地址:">
          <el-input
            v-model="form.address"
            placeholder="请输入物理地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="实时数据:">
          <el-switch
            v-model="form.isRealtime"
            active-color="#3FE3D3"
            inactive-color="#CACACA"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </div>

    <div class="device-form__footer">
      <FButton size="small" @click="closeDrawer" type="plain">取消</FButton>
      <FButton size="small" @click="save" :loading="saving">保存</FButton>
    </div>
  </div>
</template>
<script>
import FButton from '@/version2/pages/admin/components/FButton.vue'
import gql from 'graphql-tag'
export default {
  name: 'DeviceForm',
  components: { FButton },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    data: Object,
    materialID: [String, Number]
  },
  data() {
    return {
      searchMaterialsLoading: false,
      saving: false,
      material: undefined,
      materialName: '',
      rules: {
        name: [
          { required: true, message: '设备名称为必填项', trigger: 'blur' }
        ],
        materialID: [
          { required: true, message: '设备料号为必选项', trigger: 'blur' }
        ]
      },
      form: {
        name: '',
        deviceSupplier: '',
        materialID: undefined,
        address: '',
        isRealtime: false
      }
    }
  },
  apollo: {
    material: {
      query: gql`
        query($id: Int!) {
          material(id: $id) {
            id
            name
          }
        }
      `,
      client: 'adminClient',
      variables() {
        return {
          id: this.materialID
        }
      }
    }
  },
  methods: {
    clearForm() {
      this.form = {
        name: '',
        deviceSupplier: '',
        materialID: undefined,
        address: '',
        isRealtime: false
      }
      this.materials = []
      this.$refs.form.clearValidate()
    },
    closeDrawer() {
      this.$emit('update:visible', false)
      this.clearForm()
    },
    save() {
      this.saving = true
      var input = {
        ...this.form
      }
      input.remark = this.form.name
      if (this.isEdit) {
        input.id = this.data.id
      }
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: DeviceInput!) {
              response: saveDevice(input: $input) {
                id
              }
            }
          `,
          client: 'adminClient',
          variables: { input }
        })
        .then(() => {
          this.saving = false
          this.closeDrawer()
          this.$emit('refetchDevice')
          this.$message({ type: 'success', message: '创建设备成功' })
        })
        .catch((e) => {
          this.saving = false
          this.$message({
            type: 'error',
            message: e.message.replace('GraphQL error:', '')
          })
        })
    },
    searchMaterials(query) {
      if (query !== '') {
        this.searchMaterialsLoading = true
        this.$apollo
          .query({
            query: gql`
              query($pattern: String, $page: Int!, $limit: Int!) {
                response: materials(
                  pattern: $pattern
                  page: $page
                  limit: $limit
                ) {
                  materials {
                    id
                    name
                  }
                }
              }
            `,
            client: 'adminClient',
            variables: {
              pattern: query,
              page: 1,
              limit: 20
            }
          })
          .then(({ data: { response } }) => {
            this.searchMaterialsLoading = false
            this.materials = response.materials
          })
          .catch((e) => {
            this.searchMaterialsLoading = false
            this.$message({
              type: 'error',
              message: e.message.replace('GraphQL error:', '')
            })
          })
      }
    }
  },
  watch: {
    material: {
      immediate: true,
      handler: function(val) {
        if (val) {
          this.form.materialID = val.id
          this.materialName = val.name
        }
      }
    },
    visible: {
      immediate: true,
      handler: function(val) {
        if (this.visible && this.isEdit && this.data) {
          this.form.name = this.data.name
          this.form.deviceSupplier = this.data.deviceSupplier
          this.form.address = this.data.address
          this.form.isRealtime = this.data.isRealtime
        }
        this.form.materialID = this.materialID
      }
    }
  }
}
</script>
<style lang="scss">
.device-form-drawer .el-drawer__body {
  height: 100%;
}

.device-form-drawer .device-form {
  height: 100%;

  .device-form__body {
    height: calc(100% - 128px);

    .el-form {
      width: 420px;
      margin: auto;
      padding: 56px 0;

      .el-form-item {
        margin-bottom: 24px;
      }

      .el-form-item .el-input {
        width: 300px;

        .el-input__inner {
          background: #f3f4f4;
          border-radius: 8px;
          border: none;
        }
      }
    }
  }

  .device-form__header {
    height: 64px;
    line-height: 64px;
    box-sizing: border-box;
    margin: 0;
    padding: 0 24px;
    color: #6a6a6a;
    font-size: 20px;
    font-weight: bold;
    background: #f3f4f4;
  }

  .device-form__footer {
    height: 64px;
    line-height: 64px;
    box-sizing: border-box;
    text-align: center;
    border-top: 1px solid #cacaca;

    .el-button {
      width: 88px;
      margin: 0 16px;
    }
  }
}
</style>
