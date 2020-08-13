<template>
  <div class="rule-item-form">
    <div class="admin-table-form">
      <div class="table-header table-row">
        <div class="table-cell">名称</div>
        <div class="table-cell">英文名称</div>
        <div class="table-cell">值类型</div>
        <div class="table-cell">索引范围</div>
      </div>

      <div class="table-body">
        <div
          class="table-body__row table-row"
          v-for="(item, i) in ruleItems"
          :key="'item_' + i"
        >
          <div class="table-cell">
            <TableCellForm
              :row="item"
              prop="label"
              @update="editCell"
            ></TableCellForm>
          </div>

          <div class="table-cell">
            <TableCellForm
              :row="item"
              prop="name"
              @update="editCell"
            ></TableCellForm>
          </div>

          <div class="table-cell">
            <TableCellForm use-slot>
              <RuleItemTypeForm
                :row="item"
                :type.sync="item.type"
                :dayCode.sync="item.dayCode"
                :dayCodeReject.sync="item.dayCodeReject"
                :monthCode.sync="item.monthCode"
                :monthCodeReject.sync="item.monthCodeReject"
                :categorySet.sync="item.categorySet"
              ></RuleItemTypeForm>
            </TableCellForm>
          </div>

          <div class="table-cell">
            <TableCellForm use-slot>
              <RuleItemRangeForm
                :range.sync="item.indexRange"
              ></RuleItemRangeForm>
            </TableCellForm>
          </div>
          <div class="delete-row-btn">
            <img
              src="~@//assets/images/pi-quxiao.png"
              @click="removeRow(item)"
            />
          </div>
        </div>
      </div>

      <div class="table-footer" @click="addItem()">
        + 手动添加
      </div>
    </div>
  </div>
</template>
<script>
import TableCellForm from '@//pages/admin/components/TableCellForm.vue'
import RuleItemRangeForm from './rule-item-range-form'
import RuleItemTypeForm from './rule-item-type-form'

export default {
  name: 'RuleItemForm',
  props: {
    items: Array
  },
  components: { TableCellForm, RuleItemRangeForm, RuleItemTypeForm },
  data() {
    return {
      ruleItems: []
    }
  },
  methods: {
    editCell(val) {
      var data = val.data
      var prop = val.prop
      var index = this.ruleItems.findIndex((item) => item.key === data.key)
      this.ruleItems[index][prop] = data[prop]
      this.updateList()
    },
    removeRow(row) {
      var index = this.ruleItems.findIndex((item) => item.key === row.key)
      this.ruleItems.splice(index, 1)
      this.updateList()
    },
    addItem() {
      this.ruleItems.push({
        key: '',
        label: '',
        type: 'Category',
        indexRange: [],
        dayCode: [],
        monthCode: []
      })
      this.updateList()
    },
    updateList() {
      this.$emit('update:items', this.ruleItems)
    }
  },
  created() {
    this.ruleItems = this.items.map((item) => item)
  }
}
</script>
<style lang="scss">
@import '@//assets/scss/admin/admin_form_table.scss';
</style>
