<template>
  <div class="console-import-record">
    <div class="import-record-table">
      <el-table
        stripe
        :data="records"
        height="100%"
        header-row-class-name="import-record-table__header"
        row-class-name="import-record-table__row"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80px"
        ></el-table-column>
        <el-table-column label="文件名" prop="fileName"></el-table-column>
        <el-table-column label="设备">
          <template slot-scope="scope">
            {{ scope.row.device ? scope.row.device.name : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="导入者">
          <template slot-scope="scope">
            {{ scope.row.user ? scope.row.user.name : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="导入方式" prop="importType"></el-table-column>
        <el-table-column label="文件大小" prop="fileSize"></el-table-column>
        <el-table-column label="解析模板">
          <template slot-scope="scope">
            {{ scope.row.decodeTemplate ? scope.row.decodeTemplate.name : '-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="导入时间"
          :formatter="timeFormatter"
          prop="createdAt"
        ></el-table-column>
        <el-table-column label="数据总行数" prop="rowCount"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.finished ? '已完成' : '未完成' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              class="import-record-revert"
              type="text"
              @click="revert(scope.row)"
              >撤销</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <Pagination
      :currentPage="page"
      :total="total"
      :pageSizes="[20, 50, 100, 300]"
      :pageSize="20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></Pagination>
  </div>
</template>
<script>
import Pagination from '@/version2/components/Pagination.vue'
export default {
  props: ['id', 'material'],
  components: { Pagination },
  data() {
    return {
      total: 0,
      page: 1,
      records: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    }
  },
  created() {
    this.$store.commit('SET_PAGE_TITLE', `${this.material.name}数据导入记录`)
  },
  methods: {
    handleSizeChange(val) {
      console.log(val)
    },
    handleCurrentChange(val) {
      console.log(val)
    },
    timeFormatter() {
      var t = new Date(arguments[2])
      return t.toLocaleString()
    }
  }
}
</script>
<style lang="scss">
.console-import-record {
  height: 100%;

  .import-record-table {
    padding: 32px 32px 0 32px;
    box-sizing: border-box;
    height: calc(100% - 64px);

    .el-table:before {
      display: none;
    }

    .import-record-table__header {
      height: 64px;

      th {
        background: #5e83f2;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
      }
    }

    .cell {
      text-align: center;
    }

    .import-record-table__row {
      height: 48px;

      &.el-table__row--striped {
        background: rgba(243, 244, 244, 0.8);
      }

      td {
        padding: 0;
        border-bottom: none;
      }

      .cell {
        font-size: 12px;
        color: #666;
        font-weight: 400;
      }
    }

    .import-record-revert {
      color: #3fe3d3;
      font-size: 12px;
    }
  }
}
</style>
