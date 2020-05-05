<template>
  <div class="product-data">
    <el-table
      :data="productWrap.products"
      stripe
      style="width: 100%"
      class="clusterize"
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

    <el-pagination
      background
      layout="prev, pager, next"
      :total="productWrap.total"
      :page-size="300"
      :current-page.sync="page"
    >
    </el-pagination>
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
            deviceID: this.deviceID,
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
  margin-bottom: 32px;
  .el-pagination {
    margin-top: 16px;
    text-align: center;
  }
}
</style>
