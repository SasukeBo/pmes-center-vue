<template>
  <div class="admin-bar-code-rule-form admin-drawer-form">
    <div class="admin-drawer-form__header">
      {{ rule ? '编辑编码规则' : '创建编码规则' }}
    </div>

    <div class="admin-drawer-form__body">
      <div class="scroll-inner">
        <div class="block-title">
          基本信息
        </div>

        <el-form
          :model="form"
          :rules="rules"
          size="small"
          label-position="right"
          label-width="80px"
        >
          <el-form-item label="名称：" prop="name">
            <el-input
              v-model="form.name"
              class="admin-drawer-form-cell wide-input"
              placeholder="填写编码名称"
            ></el-input>
          </el-form-item>

          <el-form-item label="描述：" prop="remark">
            <el-input
              class="admin-drawer-form-cell wide-input"
              v-model="form.remark"
              placeholder="填写编码描述"
            ></el-input>
          </el-form-item>

          <el-form-item label="编码长度：" prop="codeLength">
            <div class="cell-input">
              <el-input
                style="width: 72px"
                v-model="form.codeLength"
                class="admin-drawer-form-cell"
              ></el-input>
              <span>位</span>
            </div>
          </el-form-item>
        </el-form>

        <div class="block-title">
          编码规则
        </div>

        <RuleItemForm :items.sync="items" v-if="visible"></RuleItemForm>
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
import RuleItemForm from './rule-item-form'
export default {
  name: 'AdminBarCodeRuleForm',
  components: { FButton, RuleItemForm },
  props: {
    rule: Object,
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      saving: false,
      rules: {
        name: [{ required: true, trigger: 'blur', message: '名称为必填项' }],
        remark: [
          { required: true, trigger: 'blur', message: '编码描述为必填项' }
        ],
        codeLength: [
          { required: true, trigger: 'blur', message: '编码长度为必填项' }
        ]
      },
      form: {
        name: '',
        remark: '',
        codeLength: 0
      },
      items: []
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler: function(val) {
        if (val && this.rule) {
          this.form.name = this.rule.name
          this.form.remark = this.rule.remark
          this.form.codeLength = this.rule.codeLength
          this.items = this.rule.items.map((item) => {
            delete item.__typename
            return item
          })
        } else {
          this.form.name = ''
          this.form.remark = ''
          this.form.codeLength = 0
          this.items = []
        }
      }
    }
  },
  methods: {
    closeForm() {
      this.$emit('update:visible', false)
    },
    save() {}
  }
}
</script>
<style lang="scss">
@import '@/version2/assets/scss/admin/admin_drawer_form.scss';

.admin-bar-code-rule-form.admin-drawer-form {
  .el-form-item {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
