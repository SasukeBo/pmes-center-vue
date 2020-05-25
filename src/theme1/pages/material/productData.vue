<template>
  <div class="product-data">
    <vxe-table
      stripe
      :data="results"
      v-loading="$apollo.queries.productWrap.loading && results.length === 0"
    >
      <vxe-table-column width="80" title="ID" field="id"> </vxe-table-column>
      <vxe-table-column
        title="是否合格"
        width="80"
        field="qualified"
        :formatter="formatQualified"
      >
      </vxe-table-column>
      <vxe-table-column
        title="生产时间"
        width="180"
        field="createdAt"
        :formatter="formatTime"
      >
      </vxe-table-column>
      <vxe-table-column title="2D条码" width="300" field="d2code">
      </vxe-table-column>
      <vxe-table-column title="线体号" field="lineID"> </vxe-table-column>
      <vxe-table-column title="冶具号" field="jigID"> </vxe-table-column>
      <vxe-table-column title="模号" field="mouldID"> </vxe-table-column>
      <vxe-table-column title="班别" field="shiftNumber"> </vxe-table-column>
      <vxe-table-column width="150">
        <template slot="header">
          <el-button
            size="small"
            class="export-product-data-btn"
            @click="exportData"
            :loading="downloading"
          >
            导出数据
          </el-button>
        </template>
        <template v-slot="{ row }">
          <el-button
            @click="viewRow(row)"
            type="primary"
            disabled
            size="mini"
            class="view-points-btn"
            >检测值</el-button
          >
        </template>
      </vxe-table-column>
    </vxe-table>

    <div
      class="loading"
      v-show="$apollo.queries.productWrap.loading && results.length > 0"
      v-loading="$apollo.queries.productWrap.loading"
    ></div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import { pipeToUndefined } from '@/helpers'
import XEUtils from 'xe-utils'

export default {
  name: 'ProductData',
  props: {
    id: [String, Number],
    searchForm: Object
  },
  apollo: {
    productWrap: {
      query: gql`
        query($searchInput: Search!, $offset: Int, $limit: Int!) {
          productWrap: products(
            searchInput: $searchInput
            offset: $offset
            limit: $limit
          ) {
            tableHeader
            products {
              id
              uuid
              qualified
              pointValue
              createdAt
              d2code
              lineID
              jigID
              mouldID
              shiftNumber
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
        var s = this.searchForm
        return {
          searchInput: {
            materialID: this.id,
            deviceID: pipeToUndefined(s.deviceID),
            beginTime: pipeToUndefined(s.beginTime),
            endTime: pipeToUndefined(s.endTime),
            extra: {
              lineID: pipeToUndefined(s.lineID),
              jigID: pipeToUndefined(s.jigID),
              mouldID: pipeToUndefined(s.mouldID),
              shiftNumber: pipeToUndefined(s.shiftNumber)
            }
          },
          offset: this.offset,
          limit: this.limit
        }
      }
    }
  },
  data() {
    return {
      downloading: false,
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
      results: [],
      offset: 0,
      limit: 30,
      isFetchMore: false
    }
  },
  watch: {
    productWrap(nv) {
      if (nv && nv.products) {
        Object.freeze(this.results)
        if (this.isFetchMore) {
          this.results = this.results.concat(nv.products)
          this.isFetchMore = false
        } else {
          this.results = nv.products
        }
      }
    }
  },
  created() {
    var _this = this
    window.onscroll = function() {
      var scrollTop = document.documentElement.scrollTop
      var clientHeight = document.body.clientHeight
      var scrollHeight = document.body.scrollHeight

      if (scrollTop + clientHeight >= scrollHeight - 700) {
        if (_this.results.length < _this.productWrap.total) {
          _this.offset = _this.results.length - 1
          _this.isFetchMore = true
        }
      }
    }
  },
  methods: {
    formatPointValue({ column, row }) {
      return row.pointValue[column.title]
    },
    formatQualified({ cellValue }) {
      return cellValue ? '是' : '否'
    },
    formatTime({ cellValue }) {
      var t = new Date(cellValue)
      return XEUtils.toDateString(t, 'yyyy-MM-dd HH:ss:mm')
    },
    viewRow(row) {
      console.log(row)
    },
    exportData() {
      this.downloading = true
      var s = this.searchForm
      var input = {
        materialID: this.id,
        deviceID: pipeToUndefined(s.deviceID),
        beginTime: pipeToUndefined(s.beginTime),
        endTime: pipeToUndefined(s.endTime),
        extra: {
          lineID: pipeToUndefined(s.lineID),
          jigID: pipeToUndefined(s.jigID),
          mouldID: pipeToUndefined(s.mouldID),
          shiftNumber: pipeToUndefined(s.shiftNumber)
        }
      }
      this.$apollo
        .query({
          query: gql`
            query($input: Search!) {
              response: exportProducts(searchInput: $input) {
                fileContent
                fileExtension
              }
            }
          `,
          variables: { input }
        })
        .then(({ data: { response } }) => {
          ;(function() {
            var a = document.createElement('a')
            a.download = 'export-data.' + response.fileExtension
            a.href = 'data:text/plain,' + atob(response.fileContent)
            a.click()
          })()
          this.downloading = false
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.message.replace('GraphQL error:', '')
          })
          this.downloading = false
        })
    }
  }
}
</script>
<style lang="scss">
.theme_1-app .material-view .product-data {
  height: 100%;
  overflow: hidden;
  margin-bottom: 48px;

  .vxe-body--row.row--stripe {
    background: rgba(94, 131, 242, 0.04);
  }

  .view-points-btn {
    border: none;
    box-shadow: 0px 3px 6px rgba(94, 131, 242, 0.5);
  }

  th.vxe-header--column {
    border-left: 1px solid rgba(236, 236, 239, 0.16);
    background: #5e83f2;
    color: #fff;
    font-size: 12px;
    font-weight: normal;
  }

  .export-product-data-btn {
    color: #5e83f2;

    img {
      width: 10px;
      padding-right: 4px;
      display: inline-block;
    }
  }

  .loading {
    height: 100px;

    .el-loading-mask {
      background: transparent;
    }
  }
}
</style>
