<template>
  <div class="console-import-data__import-form">
    <div class="import-form__header">
      添加文件
    </div>

    <div class="import-form__body">
      <el-form :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="料号:" prop="materialID">
          <el-select v-model="form.materialID">
            <el-option
              v-for="m in materials"
              :key="'material_' + m.id"
              :label="m.name"
              :value="m.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备:" prop="deviceID">
          <el-select v-model="form.deviceID">
            <el-option
              v-for="d in device"
              :key="'device_' + d.id"
              :label="d.name"
              :value="d.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="解析模板:" prop="decodeTemplateID">
          <el-select v-model="form.decodeTemplateID">
            <el-option
              v-for="d in decodeTemplates"
              :key="'decodeTemplate_' + d.id"
              :label="d.name"
              :value="d.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-upload
        class="data-file-upload"
        action="/test/upload"
        multiple
        :file-list="fileList"
      >
        <el-button class="import-btn" size="small" @click="drawerVisible = true"
          ><img
            src="~@/version2/assets/images/pi-upload.png"
          />上传文件</el-button
        >
        <div slot="tip" class="data-file-upload__tip">
          只能上传xlsx文件
        </div>
      </el-upload>
    </div>

    <div class="import-form__footer">
      <FButton size="small" @click="cancel" type="plain">取消</FButton>
      <FButton size="small" @click="save">保存</FButton>
    </div>
  </div>
</template>
<script>
import FButton from '@/version2/components/FButton.vue'
export default {
  components: { FButton },
  data() {
    return {
      form: {
        materialID: undefined,
        deviceID: undefined,
        decodeTemplateID: undefined
      },
      materials: [],
      devices: [],
      decodeTemplate: [],
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
    save() {},
    cancel() {}
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
