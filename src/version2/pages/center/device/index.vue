<template>
  <div class="device-view">
    <DeviceRecentYieldPie :id="id"></DeviceRecentYieldPie>
    <DeviceRecentDateYieldBar :id="id"></DeviceRecentDateYieldBar>
    <div v-if="device.material">
      <DeviceCustomYieldBar
        :id="id"
        :materialID="device.material.id"
      ></DeviceCustomYieldBar>
    </div>
  </div>
</template>
<script>
import DeviceRecentYieldPie from './DeviceRecentYieldPie'
import DeviceRecentDateYieldBar from './DeviceRecentDateYieldBar'
import DeviceCustomYieldBar from './DeviceCustomYieldBar'
import gql from 'graphql-tag'

export default {
  name: 'DeviceView',
  props: {
    id: [Number, String]
  },
  data() {
    return {
      device: {}
    }
  },
  apollo: {
    device: {
      query: gql`
        query($id: Int!) {
          device(id: $id) {
            id
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
  },
  components: {
    DeviceRecentYieldPie,
    DeviceRecentDateYieldBar,
    DeviceCustomYieldBar
  }
}
</script>
<style lang="scss">
.device-view {
  padding-top: 16px;
  padding-bottom: 32px;
}
</style>
