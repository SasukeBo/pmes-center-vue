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

          <el-form-item label="目标良率：" prop="yieldScore">
            <el-input
              v-model="form1.yieldScore"
              placeholder="请输入目标良率"
              class="yield-score-input"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="points-form" v-if="step === 2">
        <div class="tip">
          检测项录入支持导入，点击
          <a
            href="/downloads/xlsx?file_token=points_import_template"
            target="_blank"
            >下载模板</a
          >
        </div>

        <div class="import-points">
          <el-upload
            action="/"
            accept=".xlsx"
            :http-request="handleUpload"
            :limit="1"
            ref="pointUpload"
            :show-file-list="false"
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
            <div class="table-cell">所在列</div>
          </div>

          <div class="table-body" ref="table-body">
            <div
              class="table-body__row table-row"
              v-for="(p, i) in points"
              :key="'point_' + i"
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
                  prop="upperLimit"
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
                  prop="lowerLimit"
                  @update="editCell"
                ></TableCellForm>
              </div>
              <div class="table-cell">
                <TableCellForm
                  :row="p"
                  prop="index"
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
      <FButton v-if="step === 1" type="normal" size="small" @click="goStep(2)"
        >下一步</FButton
      >
      <FButton v-if="step === 2" type="plain" size="small" @click="goStep(1)"
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
import TableCellForm from '@/version2/pages/admin/components/TableCellForm.vue'
import FButton from '@/version2/pages/admin/components/FButton.vue'
import gql from 'graphql-tag'

export default {
  components: {
    FButton,
    TableCellForm
  },
  data() {
    return {
      step: 1,
      submitting: false,
      rule1: {
        name: [{ required: true, message: '厂内料号为必填项', trigger: 'blur' }]
      },
      form1: {
        name: '',
        customerCode: '',
        yieldScore: 0,
        projectRemark: ''
      },
      points: []
    }
  },
  created() {
    this.$store.commit('SET_PAGE_TITLE', '新增料号')
  },
  methods: {
    goStep(step) {
      if (this.step === 1) {
        this.$refs.form1.validate((valid) => {
          if (valid) {
            this.step = step
          }
        })
      } else {
        this.step = step
      }
    },
    submit() {
      this.submitting = true
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: MaterialCreateInput!) {
              response: addMaterial(input: $input) {
                id
                name
                yieldScore
                customerCode
                projectRemark
              }
            }
          `,
          variables: {
            input: {
              name: this.form1.name,
              customerCode: this.form1.customerCode,
              projectRemark: this.form1.projectRemark,
              yieldScore: this.form1.yieldScore,
              points: this.points
            }
          },
          client: 'adminClient'
        })
        .then(({ data: { response } }) => {
          this.submitting = false
          this.$message({ type: 'success', message: '料号创建成功' })
          this.$router.push({ name: 'console-material-listview' })
        })
        .catch((e) => {
          this.submitting = false
          this.$GraphQLError(e)
        })
    },
    addPoint() {
      this.points.push({
        name: '',
        upperLimit: undefined,
        nominal: undefined,
        lowerLimit: undefined
      })

      var el = this.$refs['table-body']
      setTimeout(() => {
        el.scrollTo(0, el.scrollHeight)
      }, 100)
    },
    editCell(val) {
      var data = val.data
      var prop = val.prop
      var index = this.points.findIndex((p) => p.name === data.name)
      this.points[index][prop] = data[prop]
    },
    removeRow(row) {
      var index = this.points.findIndex((p) => p.name === row.name)
      this.points.splice(index, 1)
    },
    handleUpload({ file }) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($file: Upload!) {
              response: parseImportPoints(file: $file) {
                id
                name
                index
                nominal
                upperLimit
                lowerLimit
              }
            }
          `,
          client: 'adminClient',
          variables: {
            file
          }
        })
        .then(({ data: { response } }) => {
          var points = response.map((p) => {
            delete p.__typename
            delete p.id
            return p
          })
          this.points = this.points.concat(points)
          this.$refs.pointUpload.clearFiles()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.message.replace('GraphQL error:', '')
          })
          this.$refs.pointUpload.clearFiles()
        })
    }
  }
}
</script>
