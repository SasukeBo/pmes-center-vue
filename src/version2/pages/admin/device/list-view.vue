<template>
  <div class="device-manage__listview">
    <div class="device-manage__listview-header">
      <div class="search-input">
        <el-input
          placeholder="搜索设备"
          v-model="searchForm.pattern"
          size="small"
          @keyup.enter.native.prevent="search = searchForm.pattern"
        >
        </el-input>

        <el-button @click="search = searchForm.pattern" size="mini"
          >搜索</el-button
        >
      </div>

      <div class="material-select">
        <el-select
          v-model="searchForm.materialID"
          filterable
          clearable
          remote
          size="small"
          placeholder="料号筛选"
          :remote-method="searchMaterials"
          :loading="searchMaterialsLoading"
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
        <el-button size="small" @click="appendButton">添加设备</el-button>
      </div>
    </div>

    <div class="device-manage__listview-body">
      <el-table
        stripe
        height="100%"
        :data="deviceWrap.devices"
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
        <el-table-column label="IP">
          <template slot-scope="scope">
            {{ scope.row.ip ? scope.row.ip : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="厂商">
          <template slot-scope="scope">
            {{ scope.row.deviceSupplier ? scope.row.deviceSupplier : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="实时数据">
          <template slot-scope="scope">
            {{ scope.row.isRealtime ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="物理地址">
          <template slot-scope="scope">
            {{ scope.row.address ? scope.row.address : '-' }}
          </template>
        </el-table-column>
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
      :total="deviceWrap.total"
      :pageSizes="[20, 50, 100, 300]"
      :pageSize="limit"
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
        :visible.sync="drawerVisible"
        :data="editDevice"
        :isEdit="isEdit"
        @refetchDevice="$apollo.queries.deviceWrap.refetch()"
      ></DeviceForm>
    </el-drawer>
  </div>
</template>
<script>
import Pagination from '@/version2/components/Pagination.vue'
import DeviceForm from './device-form'
import gql from 'graphql-tag'
export default {
  name: 'DeviceList',
  components: { Pagination, DeviceForm },
  apollo: {
    deviceWrap: {
      query: gql`
        query($pattern: String, $materialID: Int, $page: Int!, $limit: Int!) {
          deviceWrap: listDevices(
            pattern: $pattern
            materialID: $materialID
            page: $page
            limit: $limit
          ) {
            total
            devices {
              id
              name
              material {
                id
                name
              }
              uuid
              ip
              deviceSupplier
              isRealtime
              address
            }
          }
        }
      `,
      client: 'adminClient',
      variables() {
        return {
          pattern: this.search,
          materialID: this.searchForm.materialID,
          page: this.page,
          limit: this.limit
        }
      }
    }
  },
  data() {
    return {
      page: 1,
      limit: 20,
      searchMaterialsLoading: false,
      materials: [],
      isEdit: false,
      editDevice: undefined,
      drawerVisible: false,
      search: '',
      searchForm: {
        pattern: '',
        materialID: undefined
      },
      deviceWrap: {
        total: 0,
        devices: []
      }
    }
  },
  methods: {
    edit(device) {
      this.isEdit = true
      this.editDevice = device
      this.drawerVisible = true
    },
    appendButton() {
      this.isEdit = false
      this.editDevice = undefined
      this.drawerVisible = true
    },
    remove(device) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: Int!) {
              response: deleteDevice(id: $id)
            }
          `,
          client: 'adminClient',
          variables: {
            id: device.id
          }
        })
        .then(() => {
          this.$message({ type: 'success', message: '删除成功' })
          var index = this.deviceWrap.devices.findIndex(
            (d) => d.id === device.id
          )
          this.deviceWrap.devices.splice(index, 1)
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.message.replace('GraphQL error:', '')
          })
        })
    },
    handleClose() {
      this.drawerVisible = false
    },
    handleSizeChange(val) {
      this.limit = val
    },
    handleCurrentChange(val) {
      this.page = val
    },
    searchMaterials(query) {
      if (query !== '') {
        this.searchMaterialsLoading = true
        this.$apollo
          .query({
            query: gql`
              query($pattern: String, $page: Int!, $limit: Int!) {
                response: materials(
                  pattern: $pattern
                  page: $page
                  limit: $limit
                ) {
                  materials {
                    id
                    name
                  }
                }
              }
            `,
            client: 'adminClient',
            variables: {
              pattern: query,
              page: 1,
              limit: 20
            }
          })
          .then(({ data: { response } }) => {
            this.searchMaterialsLoading = false
            this.materials = response.materials
          })
          .catch((e) => {
            this.searchMaterialsLoading = false
            this.$message({
              type: 'error',
              message: e.message.replace('GraphQL error:', '')
            })
          })
      }
    }
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
