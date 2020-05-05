<template>
  <div class="size-analyze">
    <el-row :gutter="20">
      <el-col :span="12" v-for="(pResult, i) in pointResultsWrap.pointResults" :key="'pr_' + i">
        <PointCard :pointResult="pResult"></PointCard>
      </el-col>
    </el-row>
    <el-row>
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
    </el-row>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import PointCard from '@/components/PointCard.vue'
export default {
  name: 'SizeAnalyze',
  components: { PointCard },
  props: {
    materialID: [String, Number],
    deviceID: [String, Number],
    canFetch: Boolean,
    beginTime: {
      type: Date,
      default: undefined
    },
    endTime: {
      type: Date,
      default: undefined
    }
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
        return {
          search: {
            materialID: this.materialID,
            beginTime: this.beginTime,
            endTime: this.endTime
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
        .replace({ path: this.$route.path, query: { page: val } })
        .catch(() => undefined)
    }
  }
}
</script>
<style lang="scss">
.material-view .size-analyze {
  margin-bottom: 32px;
  .el-pagination {
    margin-top: 16px;
    text-align: center;
  }
}
</style>
