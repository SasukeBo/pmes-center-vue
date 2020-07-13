<template>
  <div class="size-view" v-if="point">
    <PointCard :id="id" :materialID="point.material.id"></PointCard>
    <SizeDateYieldGraph
      :id="id"
      :materialID="point.material.id"
    ></SizeDateYieldGraph>
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
      point: undefined
    }
  },
  apollo: {
    point: {
      query: gql`
        query($id: Int!) {
          point(id: $id) {
            material {
              id
            }
          }
        }
      `,
      variables() {
        return {
          id: this.id
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
