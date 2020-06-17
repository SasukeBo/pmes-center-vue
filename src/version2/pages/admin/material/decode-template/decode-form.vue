<template>
  <div class="decode-template-form">
    <div class="decode-template-form__header">
      {{ isEdit ? '编辑' : '新增' }}模板
    </div>

    <div class="decode-template-form__body">
      <div class="scroll-inner">
        <div class="block-title">解析模板</div>
        <el-form :model="form" inline size="small" :rules="rules1" ref="form1">
          <el-form-item label="模板名称：" prop="name">
            <el-input
              class="decode-template-form-cell"
              v-model="form.name"
            ></el-input>
          </el-form-item>

          <el-form-item label="备注：" prop="description">
            <el-input
              class="decode-template-form-cell description"
              v-model="form.description"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="block-title">配置</div>
        <el-form :model="form" inline size="small" ref="form2" :rules="rules2">
          <el-form-item label="数据起始行：" prop="dataRowIndex">
            <div class="cell-input">
              <el-input
                class="decode-template-form-cell"
                placeholder="例：15"
                v-model="form.dataRowIndex"
              ></el-input>
              <span>行</span>
            </div>
          </el-form-item>

          <el-form-item label="生产日期数据列：" prop="createdAtColumnIndex">
            <div class="cell-input">
              <el-input
                class="decode-template-form-cell"
                placeholder="例：B"
                v-model="form.createdAtColumnIndex"
              ></el-input>
              <span>列</span>
            </div>
          </el-form-item>
        </el-form>

        <div class="item-label">
          产品属性列：<span class="tip"
            >请添加产品属性并输入产品属性所在列，例如：属性 NO. 所在列 A</span
          >
        </div>

        <el-table
          :data="form.productColumns"
          border
          class="product-columns-table"
          header-row-class-name="product-columns-table__header"
          row-class-name="product-columns-table__row"
        >
          <el-table-column label="产品属性">
            <template slot-scope="scope">
              <TableCellForm
                :row="scope.row"
                :index="scope.$index"
                prop="name"
                @update="editCell"
              ></TableCellForm>
            </template>
          </el-table-column>
          <el-table-column label="所在列" prop="index">
            <template slot-scope="scope">
              <TableCellForm
                :row="scope.row"
                :index="scope.$index"
                prop="index"
                @update="editCell"
              ></TableCellForm>
            </template>
          </el-table-column>
          <el-table-column label="值类型" prop="type">
            <template slot-scope="scope">
              <TableCellForm
                :row="scope.row"
                :index="scope.$index"
                prop="type"
                type="select"
                @update="editCell"
                :options="columnTypeOptions"
              ></TableCellForm>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="removeProductColumn(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <template slot="append">
            <div
              class="product-columns-table__append-btns"
              @click="appendProductColumn"
            >
              + 添加
            </div>
          </template>
        </el-table>

        <div class="item-label">
          检测项列：<span class="tip"
            >请输入检测数据在文件中所在序列号，例如：FAI6 H</span
          >
        </div>

        <div class="points-form">
          <PointForm
            v-for="p in points"
            :key="'point_' + p.id"
            :label="p.name"
            :value="form.pointColumns[p.name]"
            @change="handlePointColumnChange"
          ></PointForm>
        </div>

        <div class="item-label">
          设置为默认模板：
          <el-switch
            v-model="form.default"
            active-color="#3FE3D3"
            inactive-color="#CACACA"
          >
          </el-switch>
        </div>
      </div>
    </div>
    <div class="decode-template-form__footer">
      <FButton size="small" @click="cancel" type="plain">取消</FButton>
      <FButton size="small" @click="save" :loading="saving">保存</FButton>
    </div>
  </div>
</template>
<script>
import FButton from '@/version2/components/FButton.vue'
import TableCellForm from '@/version2/components/TableCellForm.vue'
import PointForm from './point-form'
import gql from 'graphql-tag'
export default {
  components: { FButton, PointForm, TableCellForm },
  props: {
    materialID: [Number, String],
    isEdit: {
      type: Boolean,
      default: false
    },
    data: Object,
    visible: {
      type: Boolean,
      default: false
    },
    points: Array
  },
  data() {
    return {
      saving: false,
      columnTypeOptions: [
        { label: '字符型', value: 'String' },
        { label: '整数型', value: 'Integer' },
        { label: '浮点数', value: 'Float' },
        { label: '日期', value: 'Datetime' }
      ],
      rules1: {
        name: [{ required: true, message: '此为必填项', trigger: 'blur' }]
      },
      rules2: {
        dataRowIndex: [
          { required: true, message: '此为必填项', trigger: 'blur' }
        ],
        createdAtColumnIndex: [
          { required: true, message: '此为必填项', trigger: 'blur' }
        ]
      },
      form: {
        default: false,
        name: '',
        description: '',
        createdAtColumnIndex: undefined,
        dataRowIndex: undefined,
        pointColumns: {},
        productColumns: []
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('update:visible', false)
      this.clearFormData()
    },
    clearFormData() {
      this.form.default = false
      this.form.name = ''
      this.form.description = ''
      this.form.pointColumns = {}
      this.form.productColumns = []
      this.form.createdAtColumnIndex = undefined
      this.form.dataRowIndex = undefined
    },
    save() {
      var _this = this
      _this.$refs.form1.validate((valid) => {
        if (valid) {
          _this.$refs.form2.validate((valid) => {
            if (valid) {
              _this.saving = true
              _this.$apollo
                .mutate({
                  mutation: gql`
                    mutation($input: DecodeTemplateInput!) {
                      response: saveDecodeTemplate(input: $input) {
                        id
                      }
                    }
                  `,
                  client: 'adminClient',
                  variables: {
                    input: {
                      ..._this.form,
                      id:
                        _this.isEdit && _this.data ? _this.data.id : undefined,
                      materialID: _this.materialID
                    }
                  }
                })
                .then(({ data: { response } }) => {
                  _this.saving = false
                  _this.$message({ type: 'success', message: '保存成功' })
                  _this.$emit('update-list')
                  _this.$emit('update:visible', false)
                })
                .catch((e) => {
                  _this.saving = false
                  _this.$message({
                    type: 'error',
                    message: e.message.replace('GraphQL error:', '"')
                  })
                })
            }
          })
        }
      })
    },
    handlePointColumnChange({ key, value }) {
      this.form.pointColumns[key] = value
    },
    editCell(val) {
      this.form.productColumns[val.index][val.prop] = val.data[val.prop]
    },
    removeProductColumn(row) {
      var index = this.form.productColumns.findIndex((i) => i.name === row.name)
      this.form.productColumns.splice(index, 1)
    },
    appendProductColumn() {
      this.form.productColumns.push({})
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler: function(val) {
        if (this.visible && this.isEdit && this.data) {
          this.form.default = this.data.default
          this.form.name = this.data.name
          this.form.description = this.data.description
          this.form.dataRowIndex = this.data.dataRowIndex
          this.form.createdAtColumnIndex = this.data.createdAtColumnIndex
          this.form.pointColumns = this.data.pointColumns
          this.form.productColumns = this.data.productColumns.map((column) => {
            delete column.__typename
            return column
          })
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/version2/assets/scss/admin-material-decode-template-decode-form.scss';
</style>
