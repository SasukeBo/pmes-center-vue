<template>
  <div class="admin-page-pagination">
    <el-pagination
      background
      class="custom-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: ['pageSizes', 'pageSize', 'total', 'currentPage'],
  methods: {
    handleSizeChange(val) {
      this.$emit('size-change', val)
    },
    handleCurrentChange(val) {
      this.$emit('current-change', val)
    }
  }
}
</script>
<style lang="scss">
.admin-page-pagination {
  height: 64px;
  padding: 16px 0;
  box-sizing: border-box;
  text-align: center;
  border-top: 1px solid rgba(202, 202, 202, 1);

  .el-pagination.custom-pagination {
    .el-pagination__total {
      margin-right: 8px;
      color: rgba(102, 102, 102, 0.7);
      font-size: 12px;
    }

    .btn-prev,
    .btn-next,
    .el-pager .number {
      margin: 0;
      margin-right: 8px;
      border-radius: 8px;
      color: rgba(102, 102, 102, 0.7);
      font-size: 12px;
      font-weight: 400;
    }

    .btn-prev,
    .btn-next {
      background: #fff;
      border: 1px solid rgba(229, 229, 229, 1);
    }

    .el-pager .number.active {
      color: #fff;
      background: #5e83f2;
    }

    .el-input__inner {
      border-radius: 8px;
    }

    .el-pagination__sizes {
      margin: 0;
      color: rgba(102, 102, 102, 0.7);
      font-size: 12px;
      margin-right: 8px;
    }

    .el-pagination__jump {
      color: rgba(102, 102, 102, 0.7);
      font-size: 12px;
      margin-left: 0;

      .el-input__inner {
        width: 28px;
        padding: 0;
      }
    }
  }
}
</style>
