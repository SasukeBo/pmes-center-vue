<template>
  <div class="size-analyze">
    <el-row :gutter="20">
      <el-col :span="8" v-for="(size, i) in sizeWrap.sizes" :key="'size_' + i">
        <SizeCard
          :size="size"
          :beginTime="beginTime"
          :endTime="endTime"
        ></SizeCard>
      </el-col>
    </el-row>
    <el-row>
      <el-pagination
        background
        :page-sizes="[9, 21, 30]"
        layout="sizes, prev, pager, next"
        :total="sizeWrap.total"
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
import SizeCard from '@/components/SizeCard.vue'
export default {
  name: 'SizeAnalyze',
  components: { SizeCard },
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
  data() {
    return {
      page: 1,
      limit: 9,
      sizeWrap: {
        total: 0,
        sizes: []
      }
    }
  },
  apollo: {
    sizeWrap: {
      query: gql`
        query($page: Int!, $limit: Int!, $materialID: Int!) {
          sizeWrap: sizes(page: $page, limit: $limit, materialID: $materialID) {
            total
            sizes {
              id
              name
              upperLimit
              norminal
              lowerLimit
            }
          }
        }
      `,
      variables() {
        return {
          page: this.page,
          limit: this.limit,
          materialID: this.materialID
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
      console.log(val)
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
