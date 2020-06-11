<template>
  <div class="device-manage__listview">
    <div class="device-manage__listview-header">
      <div class="search-input">
        <el-input
          placeholder="搜索设备"
          v-model="searchForm.pattern"
          size="small"
        >
        </el-input>

        <el-button size="mini">搜索</el-button>
      </div>

      <div class="material-select">
        <el-select
          size="small"
          v-model="searchForm.materialID"
          placeholder="料号筛选"
        >
          <el-option
            v-for="m in materials"
            :key="m.id"
            :label="m.name"
            :value="m.id"
          ></el-option>
        </el-select>
      </div>

      <div class="add-button">
        <el-button size="small" @click="drawerVisible = true"
          >添加设备</el-button
        >
      </div>
    </div>

    <div class="device-manage__listview-body">
      <el-table
        stripe
        height="100%"
        :data="devices"
        header-row-class-name="device-table__header"
        row-class-name="device-table__row"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80px"
        ></el-table-column>
        <el-table-column label="设备名称" prop="name"></el-table-column>
        <el-table-column label="料号名称">
          <template slot-scope="scope">
            {{ scope.row.material.name }}
          </template>
        </el-table-column>
        <el-table-column label="Token" prop="uuid"> </el-table-column>
        <el-table-column label="IP" prop="ip"></el-table-column>
        <el-table-column label="厂商" prop="deviceSupplier"></el-table-column>
        <el-table-column label="实时数据">
          <template slot-scope="scope">
            {{ scope.row.isRealtime ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="物理地址" prop="address"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button class="op-btn" type="text" @click="edit(scope.row)"
              >编辑</el-button
            >
            <span> | </span>
            <el-button
              class="op-btn"
              type="text"
              @click="
                $router.push({
                  name: 'console-device-import-record',
                  params: { id: scope.row.id }
                })
              "
              >导入记录</el-button
            >
            <span> | </span>
            <el-button
              class="op-btn danger"
              type="text"
              @click="remove(scope.row)"
              >删除</el-button
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

    <el-drawer
      :withHeader="false"
      direction="rtl"
      :close-on-press-escape="false"
      custom-class="device-form-drawer"
      :visible.sync="drawerVisible"
      :before-close="handleClose"
    >
      <DeviceForm
        :device="editDevice"
        @close-drawer="drawerVisible = false"
      ></DeviceForm>
    </el-drawer>
  </div>
</template>
<script>
import Pagination from '@/version2/components/Pagination.vue'
import DeviceForm from './device-form'
export default {
  components: { Pagination, DeviceForm },
  data() {
    return {
      page: 1,
      total: 100,
      materials: [],
      editDevice: undefined,
      drawerVisible: false,
      searchForm: {
        pattern: '',
        materialID: undefined
      },
      devices: [
        {
          name: '设备1',
          material: { name: '1828' },
          uuid: '123fa32fa35g894h-43fg28-9fja329jgas8g48ur',
          ip: '192.168.5.198',
          deviceSupplier: '欧姆龙',
          isRealtime: true,
          address: '富诚达B1栋三楼'
        },
        {
          name: '设备1',
          material: { name: '1828' },
          uuid: '123fa32fa35g894h-43fg28-9fja329jgas8g48ur',
          ip: '192.168.5.198',
          deviceSupplier: '欧姆龙',
          isRealtime: true,
          address: '富诚达B1栋三楼'
        }
      ]
    }
  },
  methods: {
    edit() {},
    remove() {},
    handleClose() {},
    handleSizeChange(val) {},
    handleCurrentChange(val) {}
  }
}
</script>
<style lang="scss">
@import '@/version2/assets/scss/variables.scss';

.el-drawer__container:focus {
  outline: none;
}

.device-manage__listview {
  height: 100%;

  .device-manage__listview-header {
    position: absolute;
    padding-left: 264px;
    display: flex;
    top: -48px;
    box-sizing: border-box;
    width: 100%;

    .add-button {
      flex: 1;
      text-align: right;
      margin-right: 32px;

      .el-button {
        background: linear-gradient(
          218deg,
          rgba(63, 227, 211, 1) 0%,
          rgba(94, 131, 242, 1) 100%
        );
        box-shadow: 0px 3px 20px rgba(94, 131, 242, 0.3);
        border-radius: 900px;
        color: #fff;
      }
    }

    .search-input {
      width: 240px;
      position: relative;

      .el-button {
        position: absolute;
        border: none;
        background: rgba(94, 131, 242, 1);
        color: #fff;
        border-radius: 900px;
        margin: 3px 4px;
        right: -1px;
        box-shadow: 0px 0px 5px rgba(94, 131, 242, 0.48);
      }
    }

    .material-select {
      margin-left: 24px;
      width: 160px;
    }

    .el-input {
      position: relative;

      .el-input__inner {
        border-radius: 900px;
        border: none;
        padding-right: 60px;
      }

      .el-input-group__append {
        position: absolute;
        right: 0;
        top: 0;
        height: 24px;
        margin: 4px;
      }
    }
  }

  .device-manage__listview-body {
    height: calc(100% - 64px);
    padding: 32px;
    box-sizing: border-box;

    .el-table {
      &:before {
        display: none;
      }

      .device-table__header th {
        height: 64px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        background: $--bg-color__main;
      }

      .device-table__row td {
        color: #666;
        line-height: 12px;
        font-size: 12px;
        text-align: center;
        height: 48px;
        transition: all 0.3s ease;

        .op-btn {
          color: #3fe3d3;
          font-size: 12px;

          &.danger {
            color: #fb5d62;
          }
        }
      }

      .device-table__row:hover td {
        background: rgba(94, 131, 242, 0.16);
      }
    }
  }

  .device-form-drawer {
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
