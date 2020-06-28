<template>
  <div class="size-view"></div>
</template>
<script>
import gql from 'graphql-tag'
export default {
  name: 'SizeView',
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
<style lang="scss"></style>
