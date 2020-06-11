<template>
  <div class="device-form">
    <div class="device-form__header">
      新增设备
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
          <el-select v-model="form.materialID" placeholder="请选择料号">
            <el-option
              v-for="m in materials"
              :key="m.id"
              :label="m.name"
              :value="m.id"
            ></el-option>
          </el-select>
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
      materials: [{ name: '测试料号', id: 1 }],
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
  methods: {
    cancel() {
      this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
      this.$emit('close-drawer')
    },
    save() {}
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
