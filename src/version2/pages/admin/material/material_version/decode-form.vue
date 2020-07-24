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
        <el-form :model="form" inline size="small" ref="form2" :rules="rules2">
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
                prop="label"
                @update="editCell"
              ></TableCellForm>
            </template>
          </el-table-column>
          <el-table-column label="属性Token" prop="token"> </el-table-column>
          <el-table-column label="前缀" prop="prefix"> </el-table-column>
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
import TableCellForm from '@/version2/pages/admin/components/TableCellForm.vue'
import PointForm from './point-form'
import gql from 'graphql-tag'
export default {
  components: { FButton, PointForm, TableCellForm },
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
        pointColumns: [],
        productColumns: []
      }
    }
  },
  apollo: {
    template: {
      query: gql`
        query($id: Int!) {
          template: decodeTemplateWithVersionID(id: $id) {
            id
            materialVersion {
              id
              version
            }
            dataRowIndex
            createdAtColumnIndex
            productColumns {
              prefix
              label
              token
              index
              type
            }
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
                  response: saveDecodeTemplate(input: $input)
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
        this.form.productColumns = val.productColumns
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/version2/assets/scss/admin/admin_drawer_form.scss';
.decode-template-drawer {
  .product-columns-table {
    margin-top: 8px;

    .product-columns-table__row {
      height: 64px;

      td {
        padding: 0;
      }

      .cell {
        text-align: center;
      }
    }

    .table-cell-form__show {
      text-align: center;
    }

    .product-columns-table__header {
      height: 64px;
      box-sizing: border-box;

      th {
        color: #666;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        background: #f3f4f4;
      }
    }

    .el-table__empty-block {
      display: none;
    }

    .product-columns-table__append-btns {
      height: 64px;
      box-sizing: border-box;
      line-height: 64px;
      text-align: center;
      color: #5e83f2;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: rgba(94, 131, 242, 0.7);
      }
    }
  }

  .points-form {
    display: flex;
    flex-flow: wrap;
    padding-top: 8px;
  }
}
</style>
