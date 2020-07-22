<template>
  <div class="material-edit-form">
    <el-form :form="form" label-width="100px" size="small">
      <el-form-item label="厂内料号" prop="name">
        <el-input disabled :value="form.name"></el-input>
      </el-form-item>

      <el-form-item label="客户料号" prop="customerCode">
        <el-input
          v-model="form.customerCode"
          placeholder="请输入客户料号"
        ></el-input>
      </el-form-item>

      <el-form-item label="专案描述" prop="projectRemark">
        <el-input
          v-model="form.projectRemark"
          placeholder="请输入专案描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="目标良率" prop="yieldScore">
        <el-input
          v-model="form.yieldScore"
          placeholder="请输入目标良率"
          class="yield-score-input"
        >
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
    </el-form>

    <div class="footer-btns">
      <FButton type="plain" size="small" @click="$router.go(-1)">返回</FButton>
      <FButton type="normal" size="small" :loading="saving" @click="save"
        >保存</FButton
      >
    </div>
  </div>
</template>
<script>
import FButton from '@/version2/pages/admin/components/FButton.vue'
import gql from 'graphql-tag'
export default {
  components: {
    FButton
  },
  props: {
    id: [String, Number]
  },
  data() {
    return {
      saving: false,
      form: {
        name: '',
        customerCode: '',
        projectRemark: '',
        yieldScore: 0
      }
    }
  },
  methods: {
    save() {
      this.saving = true
      var yieldScore = parseFloat(this.form.yieldScore) / 100
      var data = { ...this.form, yieldScore }
      delete data.name
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: MaterialUpdateInput!) {
              response: updateMaterial(input: $input) {
                id
              }
            }
          `,
          client: 'adminClient',
          variables: {
            input: {
              ...data,
              id: this.id
            }
          }
        })
        .then(() => {
          this.saving = false
          this.$message({ type: 'success', message: '保存料号信息成功' })
          this.$router.push({ name: 'console-material-listview' })
        })
        .catch((e) => {
          this.saving = false
          this.$message({
            type: 'error',
            message: e.message.replace('GraphQL error:', '')
          })
        })
    }
  },
  created() {
    this.$apollo
      .query({
        query: gql`
          query($id: Int!) {
            response: material(id: $id) {
              id
              name
              yieldScore
              customerCode
              projectRemark
            }
          }
        `,
        client: 'adminClient',
        variables: {
          id: this.id
        }
      })
      .then(({ data: { response } }) => {
        this.form.name = response.name
        this.form.customerCode = response.customerCode
        this.form.projectRemark = response.projectRemark
        this.form.yieldScore = response.yieldScore * 100
      })
      .catch((e) => {
        this.$GraphQLError(e)
      })
  }
}
</script>

<style lang="scss">
.material-edit-form {
  padding-top: 64px;

  .el-form {
    width: 520px;
    margin: auto;

    .el-input__inner {
      background: rgba(243, 244, 244, 1);
      opacity: 1;
      border: none;
      box-sizing: border-box;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .yield-score-input .el-input-group__append {
      background: none;
      color: #333;
      font-weight: bold;
      border: none;
    }

    .el-input:not(.is-disabled) .el-input__inner {
      &:active,
      &:focus,
      &:hover {
        background: rgba(94, 131, 242, 0.1);
        box-shadow: 0px 3px 6px rgba(94, 131, 242, 0.4);
        opacity: 1;
        border-radius: 8px;
      }
    }
  }

  .footer-btns {
    text-align: center;
    position: absolute;
    width: 100%;
    left: 0;
    height: 64px;
    bottom: 0;
    line-height: 64px;
    border-top: 1px solid rgba(202, 202, 202, 1);
  }
}
</style>
