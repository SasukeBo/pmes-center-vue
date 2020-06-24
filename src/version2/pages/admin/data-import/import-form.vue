<template>
  <div class="console-import-data__import-form">
    <div class="import-form__header">
      添加文件
    </div>

    <div class="import-form__body">
      <el-form
        :model="form"
        :rules="rules"
        size="small"
        label-width="100px"
        ref="form"
      >
        <el-form-item label="料号:" prop="materialID">
          <el-select
            v-model="form.materialID"
            filterable
            clearable
            remote
            size="small"
            placeholder="请选择料号"
            :remote-method="searchMaterials"
            :loading="searchMaterialsLoading"
          >
            <el-option
              v-for="m in materials"
              :key="m.id"
              :label="m.name"
              :value="m.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备:" prop="deviceID">
          <el-select
            clearable
            size="small"
            v-model="form.deviceID"
            :disabled="!form.materialID"
            placeholder="请先选择料号，再选择设备"
          >
            <el-option
              v-for="m in devices"
              :key="m.id"
              :label="m.name"
              :value="m.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="解析模板:" prop="decodeTemplateID">
          <el-select
            clearable
            size="small"
            :disabled="!form.materialID"
            v-model="form.decodeTemplateID"
            placeholder="请先选择料号，再选择模板"
          >
            <el-option
              v-for="m in decodeTemplates"
              :key="m.id"
              :label="m.name"
              :value="m.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-upload
        multiple
        ref="upload"
        action="/posts"
        class="data-file-upload"
        :on-remove="handleUploadRemove"
        :on-error="handleUploadError"
        :on-success="handleUploadSuccess"
      >
        <el-button class="import-btn" size="small">
          <img src="~@/version2/assets/images/pi-upload.png" />上传文件
        </el-button>
        <div slot="tip" class="data-file-upload__tip">
          只能上传xlsx文件
        </div>
      </el-upload>
    </div>

    <div class="import-form__footer">
      <FButton size="small" @click="close" type="plain">取消</FButton>
      <FButton size="small" @click="save" :loading="saving">保存</FButton>
    </div>
  </div>
</template>
<script>
import FButton from '@/version2/components/FButton.vue'
import gql from 'graphql-tag'
export default {
  name: 'ImportForm',
  components: { FButton },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        materialID: undefined,
        deviceID: undefined,
        decodeTemplateID: undefined,
        fileTokens: []
      },
      saving: false,
      searchMaterialsLoading: false,
      materials: [],
      devices: [],
      decodeTemplates: [],
      rules: {
        materialID: [
          { required: true, message: '料号为必选项', trigger: 'blur' }
        ],
        deviceID: [
          { required: true, message: '设备为必选项', trigger: 'blur' }
        ],
        decodeTemplateID: [
          { required: true, message: '解析模板为必选项', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleUploadRemove(file) {
      var index = this.form.fileTokens.findIndex(
        (t) => t === file.response.token
      )
      this.form.fileTokens.splice(index, 1)
    },
    handleUploadSuccess(res) {
      this.form.fileTokens.push(res.token)
    },
    handleUploadError(err) {
      var response = JSON.parse(err.message)
      this.$message({ type: 'error', message: response.errors[0].message })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saving = true
          this.$apollo
            .mutate({
              mutation: gql`
                mutation(
                  $materialID: Int!
                  $deviceID: Int!
                  $decodeTemplateID: Int!
                  $fileTokens: [String!]!
                ) {
                  response: importData(
                    materialID: $materialID
                    deviceID: $deviceID
                    decodeTemplateID: $decodeTemplateID
                    fileTokens: $fileTokens
                  )
                }
              `,
              client: 'adminClient',
              variables: {
                ...this.form
              }
            })
            .then(() => {
              this.saving = false
              this.$message({ type: 'success', message: '导入数据成功' })
              this.close()
              this.$emit('update-list')
            })
            .catch((e) => {
              this.$GraphQLError(e)
              this.saving = false
            })
        }
      })
    },
    clearForm() {
      this.form.materialID = undefined
      this.form.deviceID = undefined
      this.form.decodeTemplateID = undefined
      this.form.fileTokens = []
      this.$refs.form.clearValidate()
    },
    close() {
      this.$emit('update:visible', false)
      this.clearForm()
      this.$refs.upload.clearFiles()
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
            this.$GraphQLError(e)
          })
      }
    },
    getDevices() {
      var variables = {
        materialID: this.form.materialID,
        page: 1,
        limit: 1000
      }
      this.$apollo
        .query({
          query: gql`
            query(
              $pattern: String
              $materialID: Int
              $page: Int!
              $limit: Int!
            ) {
              response: listDevices(
                pattern: $pattern
                materialID: $materialID
                page: $page
                limit: $limit
              ) {
                devices {
                  id
                  name
                  material {
                    id
                    name
                  }
                }
              }
            }
          `,
          client: 'adminClient',
          variables
        })
        .then(({ data: { response } }) => {
          this.devices = response.devices
        })
        .catch((e) => this.$GraphQLError(e))
    },
    getDecodeTemplates() {
      this.$apollo
        .query({
          query: gql`
            query($materialID: Int!) {
              response: listDecodeTemplate(materialID: $materialID) {
                id
                name
              }
            }
          `,
          client: 'adminClient',
          variables: {
            materialID: this.form.materialID
          }
        })
        .then(({ data: { response } }) => {
          this.decodeTemplates = response
        })
        .catch((e) => this.$GraphQLError(e))
    }
  },
  watch: {
    'form.materialID': function(val) {
      if (val) {
        this.getDevices()
        this.getDecodeTemplates()
      } else {
        this.form.deviceID = undefined
        this.form.decodeTemplateID = undefined
      }
    }
  }
}
</script>
<style lang="scss">
.console-import-data__import-form {
  height: 100%;

  .import-form__body {
    height: calc(100% - 128px);
    width: 420px;
    margin: auto;

    .el-form {
      width: 420px;
      margin: auto;
      padding-top: 56px;

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

    .data-file-upload {
      padding-left: 100px;

      .data-file-upload__tip {
        font-size: 12px;
        color: #999;
        padding-top: 8px;
      }

      .el-button.import-btn {
        padding: 9px 26px;
        background: linear-gradient(
          218deg,
          rgba(63, 227, 211, 1) 0%,
          rgba(94, 131, 242, 1) 100%
        );
        box-shadow: 0px 3px 20px rgba(94, 131, 242, 0.3);
        border-radius: 900px;
        color: #fff;

        img {
          padding-right: 8px;
        }
      }
    }
  }

  .import-form__header {
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

  .import-form__footer {
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
