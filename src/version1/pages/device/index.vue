<template>
  <div class="device-view">
    <DeviceRecentYieldPie :id="id"></DeviceRecentYieldPie>
    <DeviceRecentDateYieldBar :id="id"></DeviceRecentDateYieldBar>
    <DeviceCustomYieldBar :id="id"></DeviceCustomYieldBar>
  </div>
</template>
<script>
import DeviceRecentYieldPie from './DeviceRecentYieldPie'
import DeviceRecentDateYieldBar from './DeviceRecentDateYieldBar'
import DeviceCustomYieldBar from './DeviceCustomYieldBar'

export default {
  name: 'DeviceView',
  props: {
    id: [Number, String]
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
