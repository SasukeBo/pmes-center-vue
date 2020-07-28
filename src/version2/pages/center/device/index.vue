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
  components: {
    DeviceRecentYieldPie,
    DeviceRecentDateYieldBar,
    DeviceCustomYieldBar
  },
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
  created() {
    document.title = '数据中心 - 设备'
  }
}
</script>
<style lang="scss">
.device-view {
  max-width: 1200px;
  margin: auto;
  padding-top: 16px;
  padding-bottom: 32px;
}
</style>
