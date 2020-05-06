<template>
  <div class="product-data">
    <el-table
      :data="productWrap.products"
      stripe
      empty-text="暂无数据"
      style="width: 100%; height: calc(100% - 44px)"
      class="clusterize"
      height="100%"
      v-loading="$apollo.queries.productWrap.loading"
    >
      <el-table-column prop="id" label="ID" width="180" :fixed="false">
      </el-table-column>
      <el-table-column label="是否合格" width="80" :fixed="false">
        <template slot-scope="scope">
          {{ scope.row.qualified ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="生产时间" width="180" :fixed="false">
        <template slot-scope="scope">
          {{ timeFormat(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="尺寸数据">
        <el-table-column
          v-for="(point, i) in productWrap.tableHeader"
          :label="point"
          :key="'table-size_' + i"
        >
          <template slot-scope="scope">
            {{ scope.row.pointValue[point] }}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <div class="product-data-pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="productWrap.total"
        :page-size="300"
        :current-page.sync="page"
      >
      </el-pagination>

      <el-button size="small" type="primary" icon="el-icon-download"
        >导出数据</el-button
      >
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
  name: 'ProductData',
  props: {
    materialID: [String, Number],
    deviceID: [String, Number],
    beginTime: {
      type: Date,
      default: undefined
    },
    endTime: {
      type: Date,
      default: undefined
    }
  },
  apollo: {
    productWrap: {
      query: gql`
        query($searchInput: Search!, $page: Int!, $limit: Int!) {
          productWrap: products(
            searchInput: $searchInput
            page: $page
            limit: $limit
          ) {
            tableHeader
            products {
              id
              uuid
              qualified
              pointValue
              createdAt
            }
            status {
              pending
              message
              fileIDs
            }
            total
          }
        }
      `,
      variables() {
        return {
          searchInput: {
            materialID: this.materialID,
            deviceID: this.deviceID ? this.deviceID : undefined,
            beginTime: this.beginTime,
            endTime: this.endTime
          },
          page: this.page,
          limit: this.limit
        }
      }
    }
  },
  data() {
    return {
      productWrap: {
        tableHeader: [],
        products: [],
        status: {
          pending: false,
          message: '',
          fileIDs: []
        },
        total: 0
      },
      page: 1,
      limit: 300
    }
  },
  methods: {
    timeFormat(val) {
      var t = new Date(val)
      return t.toLocaleString()
    }
  }
}
</script>
<style lang="scss">
.material-view .product-data {
  height: 100%;
  overflow: hidden;
  margin-bottom: 32px;

  .product-data-pagination {
    display: flex;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    box-sizing: border-box;
    background: #fff;
    padding: 8px 32px;
    z-index: 2020;

    .el-pagination {
      flex: 1;
    }
  }
}
</style>
