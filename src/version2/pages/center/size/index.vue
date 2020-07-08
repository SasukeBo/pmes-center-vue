<template>
  <div class="size-view">
    <PointCard :id="id"></PointCard>
    <SizeDateYieldGraph :id="id"></SizeDateYieldGraph>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import PointCard from './PointCard.vue'
import SizeDateYieldGraph from './SizeDateYieldGraph.vue'

export default {
  name: 'SizeView',
  components: { PointCard, SizeDateYieldGraph },
  props: {
    id: [Number, String]
  },
  data() {
    return {
      sizeUnYieldResult: []
    }
  },
  apollo: {
    sizeUnYieldResult: {
      query: gql`
        query($input: GroupAnalyzeInput!) {
          sizeUnYieldResult: sizeUnYieldTop(groupInput: $input) {
            xAxisData
            seriesData
          }
        }
      `,
      variables() {
        return {
          input: {
            targetID: 7,
            yAxis: 'UnYield',
            xAxis: 'Date',
            groupBy: 'jig_id'
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
.size-view {
  padding-top: 16px;
  padding-bottom: 32px;
}
</style>
