<template>
  <div class="console-decode-template">
    <div class="decode-template-table">
      <el-table
        border
        height="100%"
        :data="templates"
        header-row-class-name="decode-template-table__header"
        row-class-name="decode-template-table__row"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80px"
        ></el-table-column>
        <el-table-column label="模板名称" prop="name"></el-table-column>
        <el-table-column label="默认模板" prop="default">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.default"
              @change="changeDefault(scope.row)"
              active-color="#3FE3D3"
              inactive-color="#CACACA"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建人">
          <template slot-scope="scope">
            {{ scope.row.user ? scope.row.user.name : '-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建日期"
          prop="createdAt"
          :formatter="timeFormatter"
        ></el-table-column>
        <el-table-column label="备注" prop="description"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <span> | </span>
            <el-button type="text" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <template slot="append">
          <div class="append-template-btn" @click="appendTemplate">
            + 新增模板
          </div>
        </template>
      </el-table>
    </div>

    <div class="decode-template-footer">
      <FButton size="small" @click="$router.go(-1)" type="plain">返回</FButton>
    </div>

    <el-drawer
      :withHeader="false"
      direction="rtl"
      :close-on-press-escape="false"
      custom-class="decode-template-drawer"
      :visible.sync="drawerVisible"
      :before-close="handleClose"
    >
      <DecodeForm :materialID="id"></DecodeForm>
    </el-drawer>
  </div>
</template>
<script>
import DecodeForm from './decode-form.vue'
import FButton from '@/version2/components/FButton.vue'
export default {
  props: ['id', 'material'],
  components: { FButton, DecodeForm },
  data() {
    return {
      drawerVisible: false,
      templates: [
        {
          id: 1,
          name: '模板1',
          default: false,
          user: { name: 'user1' },
          createdAt: '2020-03-04T12:00:00+08:00',
          description: '描述一下'
        },
        {
          id: 2,
          name: '模板2',
          default: true,
          user: { name: 'user2' },
          createdAt: '2020-04-18T12:00:00+08:00',
          description: '描述一下'
        }
      ]
    }
  },
  created() {
    this.$store.commit('SET_PAGE_TITLE', `${this.material.name}解析模板`)
  },
  methods: {
    handleClose() {
      this.drawerVisible = false
    },
    timeFormatter() {
      var t = new Date(arguments[2])
      return t.toLocaleString()
    },
    edit(val) {},
    remove(val) {},
    appendTemplate() {
      this.drawerVisible = true
    },
    changeDefault(val) {
      var index = this.templates.findIndex((i) => i.default && i.id !== val.id)
      if (index > -1) {
        this.templates[index].default = false
      }
      // 调用接口 修改 default 值
    }
  }
}
</script>
<style lang="scss">
.console-decode-template {
  height: 100%;

  .decode-template-footer {
    height: 64px;
    text-align: center;
    line-height: 64px;
    box-sizing: border-box;
    border-top: 1px solid rgba(202, 202, 202, 1);
  }

  .decode-template-table {
    height: calc(100% - 64px);
    padding: 56px 106px;
    box-sizing: border-box;

    .el-table {
      border-left: none;

      &:before,
      &:after {
        display: none;
      }
    }

    .append-template-btn {
      height: 64px;
      line-height: 64px;
      text-align: center;
      cursor: pointer;
      color: #5e83f2;
      font-size: 14px;
      font-weight: bold;
      border: 1px solid #ebeef5;
      border-top: none;
    }

    .decode-template-table__header {
      height: 64px;

      th {
        text-align: center;
        background: #f3f4f4;
        color: #666;
        font-size: 14px;
        font-weight: bold;
      }
    }

    .decode-template-table__row {
      height: 64px;

      td {
        text-align: center;
        color: #666;
        font-size: 12px;

        &:first-child {
          border-left: 1px solid #ebeef5;
        }
      }
    }
  }

  .decode-template-drawer {
    width: 83% !important;

    &:focus {
      outline: none;
    }

    .el-drawer__body:focus {
      outline: none;
    }
  }
}
</style>
