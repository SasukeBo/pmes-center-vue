<template>
  <div class="size-analyze">
    <div class="search-point">
      <el-input
        prefix-icon="el-icon-search"
        v-model="searchPointName"
        placeholder="搜索点位"
        size="mini"
        @keydown.native.enter.prevent="pattern = searchPointName"
      ></el-input>
    </div>

    <div
      class="yield-panels"
      v-loading="$apollo.queries.yields.loading && !isFetchMore"
      element-loading-text="正在获取数据"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.4)"
    >
      <div class="title">点位良率总览</div>
      <div class="panel">
        <table>
          <tr v-for="i in Math.floor(yields.length / 18) + 1" :key="'row_' + i">
            <td
              v-for="j in 18"
              :key="'row_' + i + 'cell_' + j"
              :class="['yield-cell', j % 2 === 0 ? 'yield-cell__bg' : '']"
            >
              <div v-if="yields.length > (i - 1) * 18 + j - 1">
                <span class="label">{{
                  yields[(i - 1) * 18 + j - 1].name
                }}</span>
                <span class="value"
                  >{{
                    (yields[(i - 1) * 18 + j - 1].value * 100).toFixed(2)
                  }}%</span
                >
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="24" v-for="(pResult, i) in results" :key="'pr_' + i">
        <PointCard :pointResult="pResult"></PointCard>
      </el-col>
    </el-row>

    <div
      class="loading"
      v-show="$apollo.queries.pointResultsWrap.loading"
      v-loading="$apollo.queries.pointResultsWrap.loading"
    ></div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import PointCard from '@/theme1/components/PointCard.vue'
import { pipeToUndefined } from '@/helpers'
export default {
  name: 'SizeAnalyze',
  components: { PointCard },
  props: {
    id: [String, Number],
    canFetch: Boolean,
    searchForm: Object
  },
  data() {
    return {
      offset: 0,
      limit: 10,
      isFetchMore: false,
      pointResultsWrap: {
        pointResults: [],
        total: 0
      },
      results: [],
      searchPointName: '',
      pattern: '',
      yields: []
    }
  },
  apollo: {
    yields: {
      query: gql`
        query($search: Search!, $pattern: String) {
          yields: totalPointYield(searchInput: $search, pattern: $pattern) {
            name
            value
          }
        }
      `,
      variables() {
        var s = this.searchForm
        return {
          search: {
            materialID: this.id,
            beginTime: pipeToUndefined(s.beginTime),
            endTime: pipeToUndefined(s.endTime),
            deviceID: pipeToUndefined(s.deviceID),
            extra: {
              lineID: pipeToUndefined(s.lineID),
              jigID: pipeToUndefined(s.jigID),
              mouldID: pipeToUndefined(s.mouldID),
              shiftNumber: pipeToUndefined(s.shiftNumber)
            }
          },
          pattern: this.pattern
        }
      }
    },
    pointResultsWrap: {
      query: gql`
        query($search: Search!, $limit: Int!, $offset: Int!, $pattern: String) {
          pointResultsWrap: analyzePoint(
            searchInput: $search
            limit: $limit
            offset: $offset
            pattern: $pattern
          ) {
            total
            pointResults {
              point {
                id
                name
                upperLimit
                lowerLimit
                norminal
              }
              total
              s
              ok
              ng
              cp
              cpk
              avg
              max
              min
              dataset
            }
          }
        }
      `,
      variables() {
        var s = this.searchForm
        return {
          search: {
            materialID: this.id,
            beginTime: pipeToUndefined(s.beginTime),
            endTime: pipeToUndefined(s.endTime),
            deviceID: pipeToUndefined(s.deviceID),
            extra: {
              lineID: pipeToUndefined(s.lineID),
              jigID: pipeToUndefined(s.jigID),
              mouldID: pipeToUndefined(s.mouldID),
              shiftNumber: pipeToUndefined(s.shiftNumber)
            }
          },
          offset: this.offset,
          limit: this.limit,
          pattern: this.pattern
        }
      }
    }
  },
  watch: {
    pointResultsWrap(nv) {
      if (nv) {
        if (this.isFetchMore) {
          this.results = this.results.concat(nv.pointResults)
          this.isFetchMore = false
        } else {
          this.results = nv.pointResults
        }
      }
    }
  },
  created() {
    if (this.$route.query.page) {
      this.page = parseInt(this.$route.query.page)
    }

    var _this = this
    window.onscroll = function() {
      var scrollTop = document.documentElement.scrollTop
      var clientHeight = document.body.clientHeight
      var scrollHeight = document.body.scrollHeight

      if (scrollTop + clientHeight >= scrollHeight - 1200) {
        if (_this.results.length < _this.pointResultsWrap.total) {
          _this.offset = _this.results.length - 1
          _this.isFetchMore = true
        }
      }
    }
  },
  methods: {
    handlePageChange(val) {
      this.$router
        .replace({
          path: this.$route.path,
          query: { ...this.$route.query, page: val }
        })
        .catch(() => undefined)
    }
  }
}
</script>
<style lang="scss">
.material-view .size-analyze {
  height: calc(100% - 44px);
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 44px;

  .loading {
    height: 100px;

    .el-loading-mask {
      background: transparent;
    }
  }

  .el-pagination {
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    box-sizing: border-box;
    background: #fff;
    padding-top: 8px;
    padding-bottom: 8px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
  }

  .search-point {
    background: rgba(255, 255, 255, 0.7);
    height: 64px;
    text-align: center;
    margin-bottom: 10px;

    .el-input {
      width: 230px;
      margin: 18px 0;

      .el-input__inner {
        border-radius: 900px;
        padding-left: 56px;
      }

      .el-input__prefix {
        left: 35px;
      }
    }
  }

  .yield-panels {
    margin-bottom: 8px;
    background: #fff;

    .title {
      color: #666;
      font-size: 16px;
      padding: 8px 0 8px 15px;
    }

    .panel {
      background: #fff;
      padding: 0 15px;
      padding-bottom: 20px;
      box-sizing: border-box;
      overflow-x: auto;
      overflow-y: hidden;

      table {
        border-collapse: collapse;
      }

      tr:first-child td {
        border-top: 1px solid rgba(236, 236, 239, 1);
      }

      tr td:first-child {
        border-left: 1px solid rgba(236, 236, 239, 1);
      }

      .yield-cell {
        width: 66px;
        height: 56px;
        text-align: center;
        padding: 0;
        border-right: 1px solid rgba(236, 236, 239, 1);
        border-bottom: 1px solid rgba(236, 236, 239, 1);

        &.yield-cell__bg {
          background: rgba(236, 236, 239, 0.2);
        }
      }

      .yield-cell span {
        display: block;
        font-size: 12px;

        &.label {
          color: #999999;
        }

        &.value {
          color: #333;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
