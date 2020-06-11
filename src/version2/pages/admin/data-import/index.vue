<template>
  <div class="console-import-data">
    <div class="console-import-data__header">
      <el-button class="import-btn" size="small"
        ><img
          src="~@/version2/assets/images/icon-file.png"
        />添加文件</el-button
      >
    </div>

    <div class="console-import-data__body">
      <el-table
        height="100%"
        :data="importRecords"
        header-row-class-name="import-data-table__header"
        row-class-name="import-data-table__row"
      >
        <el-table-column label="文件名称" prop="fileName"></el-table-column>
        <el-table-column label="解析模板">
          <template slot-scope="scope">
            {{ scope.row.decodeTemplate.name }}
          </template>
        </el-table-column>
        <el-table-column label="料号">
          <template slot-scope="scope">
            {{ scope.row.material.name }}
          </template>
        </el-table-column>
        <el-table-column label="设备">
          <template slot-scope="scope">
            {{ scope.row.device.name }}
          </template>
        </el-table-column>
        <el-table-column
          label="导入时间"
          :formatter="timeFomatter"
          prop="createdAt"
        ></el-table-column>
        <el-table-column label="是否完成">
          <template slot-scope="scope">
            {{ scope.row.finished ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column min-width="400px">
          <template slot-scope="scope">
            <div class="import-operation-panel">
              <span class="inline-item">20M</span>
              <el-progress
                class="inline-item"
                :show-text="false"
                :percentage="50"
                :stroke-width="10"
              ></el-progress>
              <div class="status-icon inline-item">
                <img
                  src="~@/version2/assets/images/pi-quxiao.png"
                  v-if="true"
                  @click="cancel(scope.row)"
                />
                <img
                  src="~@/version2/assets/images/pi-error.png"
                  v-if="false"
                />
                <img
                  src="~@/version2/assets/images/pi-success.png"
                  v-if="false"
                />
              </div>
              <el-button size="small" type="text" class="retry-btn inline-item"
                >重试</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="console-import-data__footer">
      <Pagination
        :currentPage="page"
        :total="total"
        :pageSizes="[20, 50, 100, 300]"
        :pageSize="20"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></Pagination>
    </div>
  </div>
</template>
<script>
import Pagination from '@/version2/components/Pagination.vue'
export default {
  components: { Pagination },
  data() {
    return {
      page: 1,
      total: 200,
      importRecords: [
        {
          fileName: '测试文件',
          decodeTemplate: { name: '默认解析模板' },
          material: { name: '测试料号' },
          device: { name: '测试设备' },
          createdAt: '2020-06-18T12:00:00+08:00',
          finished: false
        },
        {
          fileName: '测试文件',
          decodeTemplate: { name: '默认解析模板' },
          material: { name: '测试料号' },
          device: { name: '测试设备' },
          createdAt: '2020-06-18T12:00:00+08:00',
          finished: false
        },
        {
          fileName: '测试文件',
          decodeTemplate: { name: '默认解析模板' },
          material: { name: '测试料号' },
          device: { name: '测试设备' },
          createdAt: '2020-06-18T12:00:00+08:00',
          finished: false
        },
        {
          fileName: '测试文件',
          decodeTemplate: { name: '默认解析模板' },
          material: { name: '测试料号' },
          device: { name: '测试设备' },
          createdAt: '2020-06-18T12:00:00+08:00',
          finished: false
        },
        {
          fileName: '测试文件',
          decodeTemplate: { name: '默认解析模板' },
          material: { name: '测试料号' },
          device: { name: '测试设备' },
          createdAt: '2020-06-18T12:00:00+08:00',
          finished: false
        },
        {
          fileName: '测试文件',
          decodeTemplate: { name: '默认解析模板' },
          material: { name: '测试料号' },
          device: { name: '测试设备' },
          createdAt: '2020-06-18T12:00:00+08:00',
          finished: false
        }
      ]
    }
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    timeFomatter(val) {
      var t = new Date(val.createdAt)
      return t.toLocaleString()
    }
  }
}
</script>
<style lang="scss">
$--import-data-table-border__color: #dedede;

.console-import-data {
  height: 100%;
  box-sizing: border-box;
  padding: 56px 63px 0 63px;

  .console-import-data__body {
    height: calc(100% - 96px);
    padding: 32px 0;

    .el-table:before {
      display: none;
    }

    .import-data-table__header th,
    .import-data-table__row td {
      text-align: left;
      height: 48px;
      font-size: 12px;
      color: #666;
    }

    .import-data-table__header th {
      border-top: 1px solid $--import-data-table-border__color;
    }

    .import-data-table__row td:first-child,
    .import-data-table__header th:first-child {
      padding-left: 16px;
      border-left: 1px solid $--import-data-table-border__color;
    }

    .import-data-table__row td:last-child,
    .import-data-table__header th:last-child {
      border-right: 1px solid $--import-data-table-border__color;
    }

    .inline-item {
      display: inline-block;
      vertical-align: middle;
      margin: 0 12px;

      &.el-progress {
        width: 120px;

        .el-progress-bar__inner {
          background: linear-gradient(
            270deg,
            rgba(63, 227, 211, 1) 0%,
            rgba(94, 131, 242, 1) 100%
          );
        }
      }
    }
  }

  .console-import-data__header {
    .el-button.import-btn {
      padding: 9px 26px;
      background: linear-gradient(
        218deg,
        rgba(63, 227, 211, 1) 0%,
        rgba(94, 131, 242, 1) 100%
      );
      box-shadow: 0px 3px 20px rgba(94, 131, 242, 0.3);
      border-radius: 900px;
      color: #fff;

      img {
        padding-right: 8px;
      }
    }
  }
}
</style>
