<template>
  <el-dialog class="material-dialog" :visible="visible" width="400px">
    <div class="header">添加料号</div>
    <div class="material-form">
      <el-form
        :model="form"
        :rules="rules"
        label-width="80px"
        size="mini"
        ref="material-form"
      >
        <el-form-item prop="name" label="厂内料号:">
          <el-input v-model="form.name" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="客户料号:">
          <el-input v-model="form.customerCode"></el-input>
        </el-form-item>
        <el-form-item label="专案描述:">
          <el-input v-model="form.projectRemark"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="footer-operations">
      <el-button
        type="primary"
        plain
        size="mini"
        style="background: #D6DDF4; color: #5E83F2; border-color: #D6DDF4"
        @click="closeDialog"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="mini"
        style="margin-left: 24px"
        :loading="loading"
        @click="submit"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import gql from 'graphql-tag'
export default {
  props: ['visible', 'isEdit', 'material'],
  data() {
    return {
      rules: {
        name: [{ required: true, message: '料号名称必填', trigger: 'blur' }]
      },
      form: {
        name: '',
        customerCode: '',
        projectRemark: ''
      },
      loading: false
    }
  },
  watch: {
    isEdit: {
      immediate: true,
      handler: function(v) {
        if (v) {
          this.form.name = this.material.name
          this.form.customerCode = this.material.customerCode
          this.form.projectRemark = this.material.projectRemark
        }
      }
    }
  },
  methods: {
    closeDialog() {
      this.form.name = ''
      this.form.customerCode = ''
      this.form.projectRemark = ''
      this.$emit('update:isEdit', false)
      this.$emit('update:visible', false)
    },
    submit() {
      this.$refs['material-form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            this.$apollo
              .mutate({
                mutation: gql`
                  mutation($input: MaterialUpdateInput!) {
                    updateMaterial(input: $input) {
                      id
                      name
                      customerCode
                      projectRemark
                    }
                  }
                `,
                variables: {
                  input: {
                    id: this.material.id,
                    customerCode: this.form.customerCode,
                    projectRemark: this.form.projectRemark
                  }
                }
              })
              .then(({ data: { updateMaterial } }) => {
                this.$emit('after-update', updateMaterial)
                this.loading = false
                this.closeDialog()
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
              })
              .catch((e) => {
                this.loading = false
                this.$message({
                  type: 'error',
                  message: e.message.replace('GraphQL error:', '')
                })
              })
          } else {
            this.$apollo
              .mutate({
                mutation: gql`
                  mutation($input: MaterialCreateInput!) {
                    addMaterial(input: $input) {
                      material {
                        id
                        name
                        customerCode
                        projectRemark
                      }
                      status {
                        pending
                        message
                        fileIDs
                      }
                    }
                  }
                `,
                variables: {
                  input: {
                    name: this.form.name,
                    customerCode: this.form.customerCode,
                    projectRemark: this.form.projectRemark
                  }
                }
              })
              .then(({ data: { addMaterial } }) => {
                var material = {
                  ...addMaterial.material,
                  pending: false,
                  fileIDs: []
                }
                if (addMaterial.status) {
                  material.pending = addMaterial.status.pending
                  material.fileIDs = addMaterial.status.fileIDs
                }
                this.loading = false
                this.$emit('after-create', material)
                this.closeDialog()
              })
              .catch((e) => {
                this.loading = false
                this.$message({
                  type: 'error',
                  message: e.message.replace('GraphQL error:', '')
                })
              })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.theme_1-app .material-dialog {
  .el-dialog {
    border-radius: 5px;
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;

    .header {
      height: 48px;
      line-height: 48px;
      padding-left: 24px;
      background: #5e83f2;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    .material-form {
      padding: 28px 45px;
    }

    .el-form-item .el-form-item__label {
      font-size: 12px;
    }

    .el-form-item:last-child {
      margin-bottom: 0;
    }

    .footer-operations {
      text-align: center;
      height: 64px;
      background: #ececef;
      line-height: 64px;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}
</style>
