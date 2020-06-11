<template>
  <div class="decode-template-form">
    <div class="decode-template-form__header">
      新增模板
    </div>

    <div class="decode-template-form__body">
      <div class="scroll-inner">
        <div class="block-title">解析模板</div>
        <el-form :form="form" inline size="small">
          <el-form-item label="模板名称：" prop="name">
            <el-input
              class="decode-template-form-cell"
              v-model="form.name"
            ></el-input>
          </el-form-item>

          <el-form-item label="备注：" prop="description">
            <el-input
              class="decode-template-form-cell"
              v-model="form.description"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="block-title">配置</div>
        <el-form :form="form" inline size="small">
          <el-form-item label="数据起始行：" prop="">
            <div class="cell-input">
              <el-input
                class="decode-template-form-cell"
                placeholder="例：15"
              ></el-input>
              <span>行</span>
            </div>
          </el-form-item>

          <el-form-item label="生产日期数据列：" prop="">
            <div class="cell-input">
              <el-input
                class="decode-template-form-cell"
                placeholder="例：B"
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
                prop="name"
                @update="editCell"
              ></TableCellForm>
            </template>
          </el-table-column>
          <el-table-column label="所在列" prop="index">
            <template slot-scope="scope">
              <TableCellForm
                :row="scope.row"
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
            v-for="(v, k) in form.pointColumns"
            :key="'point_' + k"
            :label="k"
            :value="v"
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
      <FButton size="small" @click="save">保存</FButton>
    </div>
  </div>
</template>
<script>
import FButton from '@/version2/components/FButton.vue'
import TableCellForm from '@/version2/components/TableCellForm.vue'
import PointForm from './point-form'
export default {
  components: { FButton, PointForm, TableCellForm },
  props: ['id'],
  data() {
    return {
      columnTypeOptions: [
        { label: '字符型', value: 'String' },
        { label: '整数型', value: 'Integer' },
        { label: '浮点数', value: 'Float' },
        { label: '日期', value: 'Datetime' }
      ],
      form: {
        default: false,
        name: '',
        pointColumns: {
          FAI4_G7: 'A',
          FAI4_G8: 'A',
          FAI4_G9: 'A',
          FAI4_N1: 'A',
          FAI4_G2: 'A',
          FAI4_N3: 'A',
          FAI4_N4: 'A',
          FAI4_N5: 'A',
          FAI4_N6: 'A',
          FAI4_N7: 'A',
          FAI4_N8: 'A',
          FAI4_N9: 'A',
          FAI4_F8: 'A',
          FAI4_H8: 'A'
        },
        productColumns: [
          { name: 'NO.', index: 'A', type: 'Integer' },
          { name: '生产日期', index: 'B', type: 'Datetime' },
          { name: '线体号', index: 'C', type: 'String' }
        ]
      }
    }
  },
  methods: {
    cancel() {},
    save() {},
    handlePointColumnChange({ key, value }) {
      this.form.pointColumns[key] = value
    },
    editCell(val) {
      this.form.productColumns[val.id - 1][val.prop] = val.value
    },
    removeProductColumn(row) {
      var index = this.form.productColumns.findIndex((i) => i.name === row.name)
      this.form.productColumns.splice(index, 1)
    },
    appendProductColumn() {
      this.form.productColumns.push({})
    }
  }
}
</script>
<style lang="scss">
@import '@/version2/assets/scss/admin-material-decode-template-decode-form.scss';
</style>
