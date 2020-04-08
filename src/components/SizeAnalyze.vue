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
  </div>
</template>
<script>
import gql from 'graphql-tag'
import SizeCard from '@/components/SizeCard.vue'
export default {
  name: 'SizeAnalyze',
  components: { SizeCard },
  props: {
    materialID: Number,
    deviceID: Number,
    beginTime: {
      type: String,
      default: undefined
    },
    endTime: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      page: 1,
      limit: 21,
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
  }
}
</script>
