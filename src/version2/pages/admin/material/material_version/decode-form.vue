<template>
  <div class="admin-drawer-form decode-template-form">
    <div class="admin-drawer-form__header">
      编辑解析模板
    </div>

    <div class="admin-drawer-form__body">
      <div class="scroll-inner">
        <div class="block-title">
          配置
          <span v-if="template && template.materialVersion">
            版本：{{ template.materialVersion.version }}
          </span>
        </div>

        <el-form
          :model="form"
          size="small"
          ref="form2"
          :rules="rules2"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="数据起始行：" prop="dataRowIndex">
            <div class="cell-input">
              <el-input
                class="admin-drawer-form-cell"
                placeholder="例：15"
                v-model="form.dataRowIndex"
              ></el-input>
              <span>行</span>
            </div>
          </el-form-item>

          <el-form-item label="生产日期数据列：" prop="createdAtColumnIndex">
            <div class="cell-input">
              <el-input
                class="admin-drawer-form-cell"
                placeholder="例：B"
                v-model="form.createdAtColumnIndex"
              ></el-input>
              <span>列</span>
            </div>
          </el-form-item>

          <el-form-item label="编码数据列：" prop="barCodeIndex">
            <div class="cell-input">
              <el-input
                class="admin-drawer-form-cell"
                placeholder="例：B"
                v-model="form.barCodeIndex"
              ></el-input>
              <span>列</span>
            </div>
          </el-form-item>

          <el-form-item label="选择编码规则：" prop="barCodeRuleID">
            <el-select
              v-model="form.barCodeRuleID"
              class="admin-drawer-form-cell"
              popper-class="decode-form-barcode-rule-select-popper"
            >
              <el-option
                v-for="rule in barCodeRules"
                :key="'rule_' + rule.id"
                :label="rule.name"
                :value="rule.id"
              >
                <div>
                  <div>{{ rule.name }}</div>
                  <div
                    style="color: #8492a6; font-size: 13px; line-height: 13px"
                  >
                    {{ rule.remark }}
                  </div>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div class="item-label">
          检测项列：<span class="tip"
            >请输入检测数据在文件中所在序列号，例如：FAI6 H</span
          >
        </div>

        <div class="decode-template-form__points-form">
          <PointForm
            v-for="p in points"
            :key="'point_' + p.id"
            :value="p"
            @change="handlePointColumnChange"
          ></PointForm>
        </div>
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
import PointForm from './point-form'
import gql from 'graphql-tag'
export default {
  components: { FButton, PointForm },
  props: {
    versionID: [Number, String],
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      points: [],
      template: undefined,
      saving: false,
      columnTypeOptions: [
        { label: '字符型', value: 'String' },
        { label: '整数型', value: 'Integer' },
        { label: '浮点数', value: 'Float' },
        { label: '日期', value: 'Datetime' }
      ],
      rules2: {
        dataRowIndex: [
          { required: true, message: '此为必填项', trigger: 'blur' }
        ],
        createdAtColumnIndex: [
          { required: true, message: '此为必填项', trigger: 'blur' }
        ]
      },
      form: {
        createdAtColumnIndex: undefined,
        dataRowIndex: undefined,
        barCodeIndex: undefined,
        barCodeRuleID: undefined,
        pointColumns: []
      },
      barCodeRules: []
    }
  },
  apollo: {
    barCodeRules: {
      query: gql`
        query($search: String, $limit: Int!, $page: Int!) {
          barCodeRules: listBarCodeRules(
            search: $search
            limit: $limit
            page: $page
          ) {
            rules {
              id
              name
              remark
            }
          }
        }
      `,
      client: 'adminClient',
      variables() {
        return {
          limit: 20,
          page: 1
        }
      },
      update(data) {
        return data.barCodeRules.rules
      }
    },
    template: {
      query: gql`
        query($id: Int!) {
          template: decodeTemplateWithVersionID(id: $id) {
            id
            materialVersion {
              id
              version
            }
            barCodeIndex
            barCodeRule {
              id
              name
              remark
            }
            dataRowIndex
            createdAtColumnIndex
          }
        }
      `,
      client: 'adminClient',
      fetchPolicy: 'network-only',
      variables() {
        return {
          id: this.versionID
        }
      }
    },
    points: {
      query: gql`
        query($id: Int!) {
          points: listMaterialPoints(materialVersionID: $id) {
            id
            name
            index
          }
        }
      `,
      client: 'adminClient',
      fetchPolicy: 'network-only',
      variables() {
        return {
          id: this.versionID
        }
      }
    }
  },
  methods: {
    closeForm() {
      this.$emit('update:visible', false)
    },
    save() {
      var _this = this
      this.$refs.form2.validate((valid) => {
        if (valid) {
          _this.saving = true
          _this.$apollo
            .mutate({
              mutation: gql`
                mutation($input: DecodeTemplateInput!) {
                  response: updateDecodeTemplate(input: $input)
                }
              `,
              client: 'adminClient',
              variables: {
                input: {
                  ..._this.form,
                  id: _this.template.id
                }
              }
            })
            .then(() => {
              _this.saving = false
              _this.$message({ type: 'success', message: '保存成功' })
              _this.closeForm()
            })
            .catch((e) => {
              _this.saving = false
              _this.$GraphQLError(e)
            })
        }
      })
    },
    handlePointColumnChange({ id, value }) {
      var index = this.form.pointColumns.findIndex((p) => p.id === id)
      if (index >= 0) {
        this.form.pointColumns[index].index = value
      } else {
        this.form.pointColumns.push({ id, index: value })
      }
    },
    editCell(val) {
      this.form.productColumns[val.index][val.prop] = val.data[val.prop]
    }
  },
  watch: {
    template(val) {
      if (val) {
        this.form.createdAtColumnIndex = val.createdAtColumnIndex
        this.form.dataRowIndex = val.dataRowIndex
        this.form.barCodeIndex = val.barCodeIndex
        if (val.barCodeRule) {
          this.form.barCodeRuleID = val.barCodeRule
            ? val.barCodeRule.id
            : undefined

          var index = this.barCodeRules.findIndex(
            (r) => val.barCodeRule.id === r.id
          )
          if (index === -1) {
            this.barCodeRules.push(val.barCodeRule)
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/version2/assets/scss/admin/admin_drawer_form.scss';
.decode-template-form.admin-drawer-form {
  .admin-drawer-form__body .el-form-item {
    margin-bottom: 24px;
  }

  .decode-template-form__points-form {
    display: flex;
    flex-flow: wrap;
    padding-top: 8px;
  }
}

.decode-form-barcode-rule-select-popper {
  .el-select-dropdown__item {
    height: 55px;
  }
}
</style>
