<template>
  <div class="material-manage__listview">
    <div class="material-manage__listview-body">
      <el-table
        :data="materialsWrap.materials"
        stripe
        style="width: 100%"
        height="100%"
      >
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" label="厂内料号"> </el-table-column>
        <el-table-column prop="customerCode" label="客户料号">
        </el-table-column>
        <el-table-column prop="projectRemark" label="专案描述">
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="创建日期"
          :formatter="timeFormatter"
        ></el-table-column>
        <el-table-column
          prop="updatedAt"
          label="创建日期"
          :formatter="timeFormatter"
        ></el-table-column>
        <el-table-column label="配置" class-name="config-column" width="350">
          <template slot-scope="scope">
            <span class="link" @click="redirect(scope)">检测项</span>
            <span> | </span>
            <span class="link" @click="redirect(scope)">解析模板</span>
            <span> | </span>
            <span class="link" @click="redirect(scope)">已导入文件</span>
            <span> | </span>
            <span class="link" @click="redirect(scope)">编辑</span>
            <span> | </span>
            <span
              class="link"
              @click="redirect(scope)"
              style="color: rgba(251, 93, 98, 1)"
              >删除</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="material-manage__listview-footer">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[20, 50, 100, 400]"
        :page-size="limit"
        layout="total, prev, pager, next, sizes, jumper"
        :total="materialsWrap.total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<style lang="scss">
.material-manage .material-manage__listview {
  height: 100%;

  .material-manage__listview-body {
    height: calc(100% - 64px);
    padding: 32px 32px 0 32px;
    box-sizing: border-box;

    .el-table__header tr th {
      background: #5e83f2;
      height: 64px;
      border: none;
      color: #fff;

      .cell {
        font-size: 14px;
        font-weight: bold;
      }
    }

    .el-table .cell {
      padding-left: 32px;
    }

    .el-table td {
      border: none;
    }

    .el-table.el-table--enable-row-hover .el-table__body tr:hover > td {
      background: rgba(94, 131, 242, 0.16);
    }

    .el-table td.config-column .cell {
      color: rgba(63, 227, 211, 1);

      .link {
        cursor: pointer;
      }
    }
  }

  .material-manage__listview-footer {
    height: 64px;
    padding: 16px 0;
    box-sizing: border-box;
    text-align: center;
    border-top: 1px solid rgba(202, 202, 202, 1);

    .el-pagination {
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
}
</style>
<script>
import gql from 'graphql-tag'
export default {
  data() {
    return {
      pattern: '',
      page: 1,
      limit: 20,
      materialsWrap: {
        total: 0,
        materials: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
      }
    }
  },
  apollo: {
    materialsWrap: {
      query: gql`
        query($pattern: String, $page: Int!, $limit: Int!) {
          materialsWrap: materials(
            pattern: $pattern
            page: $page
            limit: $limit
          ) {
            total
            materials {
              id
              name
              createdAt
              updatedAt
              customerCode
              projectRemark
            }
          }
        }
      `,
      client: 'adminClient',
      variables() {
        return {
          pattern: this.pattern,
          page: this.page,
          limit: this.limit
        }
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val
    },
    handleCurrentChange(val) {
      this.page = val
    },
    redirect(obj) {
      console.log(obj)
    },
    timeFormatter() {
      var t = new Date(arguments[2])
      return t.toLocaleString()
    }
  }
}
</script>
