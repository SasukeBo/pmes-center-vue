<template>
  <div class="material-create-form">
    <div class="header-indicator">
      <div :class="['indicator', step === 1 ? 'active' : '']">1.新增料号</div>
      <div :class="['indicator', step === 2 ? 'active' : '']">2.添加检测项</div>
    </div>

    <div class="form-body">
      <div class="material-form" v-if="step === 1">
        <el-form
          :model="form1"
          label-width="82px"
          size="small"
          ref="form1"
          :rules="rule1"
        >
          <el-form-item label="厂内料号：" prop="name">
            <el-input
              v-model="form1.name"
              placeholder="请输入厂内料号"
            ></el-input>
          </el-form-item>

          <el-form-item label="客户料号：">
            <el-input
              v-model="form1.customerCode"
              placeholder="请输入客户料号"
            ></el-input>
          </el-form-item>

          <el-form-item label="专案描述：">
            <el-input
              v-model="form1.projectRemark"
              placeholder="请输入专案描述"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="points-form" v-if="step === 2">
        <div class="tip">
          检测项录入支持导入，点击 <a href="javascript:;">下载模板</a>
        </div>

        <div class="import-points">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :limit="1"
          >
            <el-button size="small" type="primary"
              ><img
                src="~@/version2/assets/images/upload-btn-icon.png"
              />导入</el-button
            >
          </el-upload>
        </div>

        <div class="table-form">
          <div class="table-header table-row">
            <div class="table-cell">检测点位</div>
            <div class="table-cell">USL</div>
            <div class="table-cell">Nominal</div>
            <div class="table-cell">LSL</div>
          </div>

          <div class="table-body" ref="table-body">
            <div
              class="table-body__row table-row"
              v-for="p in points"
              :key="'point_' + p.id"
            >
              <div class="table-cell">
                <TableCellForm
                  :row="p"
                  prop="name"
                  @update="editCell"
                ></TableCellForm>
              </div>
              <div class="table-cell">
                <TableCellForm
                  :row="p"
                  prop="usl"
                  @update="editCell"
                ></TableCellForm>
              </div>
              <div class="table-cell">
                <TableCellForm
                  :row="p"
                  prop="nominal"
                  @update="editCell"
                ></TableCellForm>
              </div>
              <div class="table-cell">
                <TableCellForm
                  :row="p"
                  prop="lsl"
                  @update="editCell"
                ></TableCellForm>
              </div>
              <div class="delete-row-btn">
                <img
                  src="~@/version2/assets/images/pi-quxiao.png"
                  @click="removeRow(p)"
                />
              </div>
            </div>
          </div>

          <div class="table-footer" @click="addPoint()">
            + 手动添加
          </div>
        </div>
      </div>
    </div>

    <div class="footer-btns">
      <FButton
        type="plain"
        size="small"
        v-if="step === 1"
        @click="$router.push({ name: 'console-material-listview' })"
      >
        取消
      </FButton>
      <FButton v-if="step === 1" type="normal" size="small" @click="step = 2"
        >下一步</FButton
      >
      <FButton v-if="step === 2" type="plain" size="small" @click="step = 1"
        >上一步</FButton
      >
      <FButton v-if="step === 2" type="normal" size="small" @click="submit"
        >确定</FButton
      >
    </div>
  </div>
</template>
<style lang="scss">
@import '@/version2/assets/scss/material_manage_createform.scss';
</style>
<script>
import TableCellForm from '@/version2/pages/admin/material/table-cell-form.vue'
import FButton from '@/version2/components/FButton.vue'
export default {
  components: {
    FButton,
    TableCellForm
  },
  data() {
    return {
      step: 1,
      rule1: {
        name: [{ required: true, message: '厂内料号为必填项', trigger: 'blur' }]
      },
      form1: {
        name: '',
        customerCode: '',
        projectRemark: ''
      },
      points: [
        {
          id: 1,
          name: 'FAI6',
          usl: 0.34,
          nominal: 0.35,
          lsl: 0.37
        }
      ]
    }
  },
  created() {
    this.$store.commit('SET_PAGE_TITLE', '新增料号')
  },
  methods: {
    submit() {},
    addPoint() {
      this.points.push({
        id: this.points.length + 1,
        name: '',
        usl: 0,
        nominal: 0,
        lsl: 0
      })

      var el = this.$refs['table-body']
      setTimeout(() => {
        el.scrollTo(0, el.scrollHeight)
      }, 100)
    },
    display(scope) {
      console.log(scope)
    },
    editCell(val) {
      this.points[val.id - 1][val.prop] = val.value
    },
    removeRow(row) {
      var index = this.points.findIndex((p) => p.id === row.id)
      this.points.splice(index, 1)
    }
  }
}
</script>
