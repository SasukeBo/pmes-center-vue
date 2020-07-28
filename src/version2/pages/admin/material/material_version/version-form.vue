<template>
  <div class="admin-drawer-form material-version-form">
    <div class="admin-drawer-form__header">
      新增版本
    </div>

    <div class="admin-drawer-form__body">
      <div class="scroll-inner">
        <div>
          <el-form
            ref="form"
            :model="form"
            size="small"
            width="420px"
            label-width="70px"
            label-position="right"
            :rules="rules"
          >
            <el-form-item prop="version" label="版本号：">
              <div class="cell-input">
                <el-input
                  class="admin-drawer-form-cell wide-input"
                  v-model="form.version"
                  placeholder="请输入版本号"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item prop="description" label="版本说明：">
              <div class="cell-input">
                <el-input
                  class="admin-drawer-form-cell wide-input"
                  v-model="form.description"
                  placeholder="请输入版本说明"
                ></el-input>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <PointsForm :dataset.sync="points"></PointsForm>
      </div>
    </div>

    <div class="admin-drawer-form__footer">
      <FButton size="small" @click="closeForm" type="plain">关闭</FButton>
      <FButton size="small" @click="save" :loading="saving">保存</FButton>
    </div>
  </div>
</template>
<script>
import FButton from '@/version2/pages/admin/components/FButton.vue'
import PointsForm from '@/version2/pages/admin/material/components/PointsForm.vue'
import gql from 'graphql-tag'

export default {
  name: 'AdminMaterialVersionForm',
  components: { FButton, PointsForm },
  props: {
    materialID: [Number, String]
  },
  data() {
    return {
      saving: false,
      form: {
        version: '',
        description: ''
      },
      points: [],
      rules: {
        version: [
          { required: true, trigger: 'blur', message: '版本号为必填项' }
        ]
      }
    }
  },
  methods: {
    closeForm() {
      this.$emit('update:visible', false)
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.saving = true
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($input: MaterialVersionInput!) {
                response: createMaterialVersion(input: $input)
              }
            `,
            client: 'adminClient',
            variables: {
              input: {
                materialID: this.materialID,
                version: this.form.version,
                description: this.form.description,
                active: false,
                points: this.points
              }
            }
          })
          .then(() => {
            this.saving = false
            this.$message({ type: 'success', message: '保存成功' })
            this.$emit('update-list')
            this.closeForm()
          })
          .catch((e) => {
            this.saving = false
            this.$GraphQLError(e)
          })
      })
    }
  }
}
</script>
<style lang="scss">
@import '@/version2/assets/scss/admin/admin_drawer_form.scss';
.new-version-drawer .material-version-form {
  .admin-drawer-form__body .el-form {
    margin-top: 56px;

    .el-form-item {
      margin-bottom: 24px;
    }
  }

  .points-form {
    text-align: left;
  }
}
</style>
