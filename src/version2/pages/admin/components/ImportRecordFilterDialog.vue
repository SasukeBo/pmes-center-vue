<template>
  <el-dialog
    title="过滤条件"
    :visible.sync="dialogVisible"
    width="600px"
    custom-class="record-filter-dialog"
  >
    <el-form
      ref="recordFilterForm"
      :model="searchForm"
      label-width="120px"
      size="small"
      class="record-filter-form"
    >
      <el-form-item label="日期范围" prop="duration">
        <el-date-picker
          v-model="searchForm.duration"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="指定日期" prop="date">
        <el-date-picker
          v-model="searchForm.date"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="导入状态" prop="status">
        <el-select
          style="width: 220px"
          v-model="searchForm.status"
          multiple
          placeholder="状态多选"
        >
          <el-option v-for="(v, k) in statusMap" :key="k" :label="v" :value="k">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文件名模糊搜索" prop="fileName">
        <el-input
          v-model="searchForm.fileName"
          style="width: 220px"
          placeholder="搜索名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="导入者筛选" prop="userID">
        <el-select
          style="width: 220px"
          v-model="searchForm.userID"
          placeholder="选择用户"
        >
          <el-option
            v-for="u in users"
            :key="u.id"
            :label="u.account"
            :value="u.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="small">取 消</el-button>
      <el-button type="primary" size="small" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'ImportRecordFilterDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object
    }
  },
  data() {
    return {
      statusMap: {
        Finished: '已完成',
        Failed: '失败',
        Loading: '导入中',
        Reverted: '已撤销'
      },
      dialogVisible: false,
      users: [],
      searchForm: {
        duration: [],
        status: []
      }
    }
  },
  apollo: {
    users: {
      query: gql`
        query {
          users {
            id
            account
          }
        }
      `,
      client: 'adminClient'
    }
  },
  methods: {
    cancel() {
      this.$refs.recordFilterForm.resetFields()
      this.$emit('update:visible', false)
    },
    submit() {
      this.$emit('update:form', this.searchForm)
      this.$emit('update:visible', false)
    }
  },
  watch: {
    dialogVisible(val) {
      this.$emit('update:visible', val)
    },
    visible(val) {
      this.dialogVisible = this.visible
    }
  },
  created() {
    this.searchForm = {
      ...this.form
    }
    this.dialogVisible = this.visible
  }
}
</script>

<style lang="scss">
.record-filter-dialog.el-dialog {
  border-radius: 8px;

  .el-dialog__header {
    background: #5e83f2;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    .el-dialog__title,
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }
}
</style>
