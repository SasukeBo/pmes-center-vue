<template>
  <div class="size-analyze">
    <div class="search-point" v-if="false">
      <el-input v-model="searchPointName" placeholder="搜索点位"></el-input>
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
      searchPointName: ''
    }
  },
  apollo: {
    pointResultsWrap: {
      query: gql`
        query($search: Search!, $limit: Int!, $offset: Int!) {
          pointResultsWrap: analyzePoint(
            searchInput: $search
            limit: $limit
            offset: $offset
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
          limit: this.limit
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

      if (scrollTop + clientHeight >= scrollHeight - 300) {
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
}
</style>
