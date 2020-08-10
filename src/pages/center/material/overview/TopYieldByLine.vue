<template>
  <div class="top-yield-by-line-chart"></div>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'TopYieldByLine',
  props: {
    id: [String, Number]
  },
  data() {
    return {
      echartsResult: undefined
    }
  },
  apollo: {
    echartsResult: {
      query: gql`
        query($input: GraphInput!) {
          echartsResult: groupAnalyzeMaterial(analyzeInput: $input) {
            xAxisData
            seriesData
            seriesAmountData
          }
        }
      `,
      variables() {
        // var category = ['Device', 'Date', 'Shift']
        // var attributeXAxis, attributeGroup

        // var xAxis = this.form.xAxis || undefined
        // if (!category.includes(xAxis) && xAxis) {
        //   attributeXAxis = xAxis
        //   xAxis = 'Attribute'
        // }
        // var groupBy = this.form.groupBy || undefined
        // if (!category.includes(groupBy) && groupBy) {
        //   attributeGroup = groupBy
        //   groupBy = 'Attribute'
        // }
        // return {
        //   input: {
        //     targetID: this.id,
        //     xAxis: 'Attribute',
        //     attributeXAxis: '',
        //     yAxis: this.form.yAxis,
        //     groupBy,
        //     attributeGroup,
        //     duration: this.form.duration,
        //     limit: this.form.limit,
        //     sort: this.form.sort
        //   }
        // }
        return {}
      },
      skip() {
        // return this.echartsFormVisible
        return true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.theme_1-app .material-view .top-yield-by-line-chart {
  .hello {
    color: #fff;
  }
}
</style>
