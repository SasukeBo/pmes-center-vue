<template>
  <div class="data-center-home__body">
    <MaterialTopUnYieldGraph></MaterialTopUnYieldGraph>
  </div>
</template>
<script>
import MaterialTopUnYieldGraph from './MaterialTopUnYieldGraph'

export default {
  name: 'HomeBody',
  components: { MaterialTopUnYieldGraph }
}
</script>
<style lang="scss">
.data-center-home__body {
  padding: 32px 40px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
</style>
