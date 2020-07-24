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

      <PointsForm v-if="step === 2" :dataset.sync="points"></PointsForm>
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
import PointsForm from '@/version2/pages/admin/material/components/PointsForm.vue'
import FButton from '@/version2/pages/admin/components/FButton.vue'
import gql from 'graphql-tag'

export default {
  components: {
    FButton,
    PointsForm
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
    }
  }
}
</script>
