<template>
  <div
    class="size-analyze"
    v-loading="$apollo.queries.pointResultsWrap.loading"
  >
    <el-row :gutter="20">
      <el-col
        :span="12"
        v-for="(pResult, i) in pointResultsWrap.pointResults"
        :key="'pr_' + i"
      >
        <PointCard :pointResult="pResult"></PointCard>
      </el-col>
    </el-row>
    <el-pagination
      background
      :page-sizes="[10, 20, 30]"
      layout="sizes, prev, pager, next"
      :total="pointResultsWrap.total"
      :page-size.sync="limit"
      :current-page.sync="page"
      @current-change="handlePageChange"
    >
    </el-pagination>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import PointCard from '@/components/PointCard.vue'
import { pipeToUndefined } from '@/helpers'
export default {
  name: 'SizeAnalyze',
  components: { PointCard },
  props: {
    materialID: [String, Number],
    canFetch: Boolean,
    searchForm: Object
  },
  data() {
    return {
      page: 1,
      limit: 10,
      pointResultsWrap: {
        pointResults: [],
        total: 0
      }
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
            materialID: this.materialID,
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
          offset: (this.page - 1) * this.limit,
          limit: this.limit
        }
      }
    }
  },
  created() {
    if (this.$route.query.page) {
      this.page = parseInt(this.$route.query.page)
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
