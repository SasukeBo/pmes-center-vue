<template>
  <div class="material-points">
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

    <div class="points-table">
      <el-table
        border
        header-row-class-name="import-record-table__header"
        row-class-name="import-record-table__row"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80px"
        ></el-table-column>

        <el-table-column label="name"></el-table-column>
        <el-table-column label="name"></el-table-column>
        <el-table-column label="name"></el-table-column>
        <el-table-column label="name"></el-table-column>
        <el-table-column label="操作"></el-table-column>
        <template></template>
      </el-table>
    </div>

    <div class="footer-btns">
      <FButton type="plain" size="small" @click="$router.go(-1)">取消</FButton>
      <FButton type="normal" size="small">保存</FButton>
    </div>
  </div>
</template>
<script>
import FButton from '@/version2/components/FButton.vue'
export default {
  components: {
    FButton
  },
  props: ['id', 'material'],
  created() {
    this.$store.commit('SET_PAGE_TITLE', `${this.material.name}检测项`)
  }
}
</script>
<style lang="scss">
@import '@/version2/assets/scss/variables.scss';

.material-points {
  padding: 32px 32px 0 32px;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 64px;

  .points-table {
    height: calc(100% - 106px);
    padding: 24px 0;
    box-sizing: border-box;

    .el-table {
      width: 80%;
      margin: auto;
      height: 100%;
    }

    .import-record-table__header th {
      text-align: center;
      height: 64px;
      font-size: 14px;
      color: #666;
      font-weight: bold;
      background: #f3f4f4;
    }
  }

  .tip {
    padding-top: 32px;
    text-align: center;
    font-size: 12px;
    color: #666;

    a {
      color: $--font-color__main;
      text-decoration: none;
    }
  }

  .import-points {
    text-align: center;
    padding-top: 24px;

    .el-button {
      width: 88px;
      height: 32px;
      font-size: 12px;
      font-weight: 400;
      background: linear-gradient(
        218deg,
        rgba(63, 227, 211, 1) 0%,
        rgba(94, 131, 242, 1) 100%
      );
      border-radius: 900px;
      border: none;
      box-shadow: 0px 3px 20px rgba(94, 131, 242, 0.3);

      img {
        margin-right: 4px;
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
