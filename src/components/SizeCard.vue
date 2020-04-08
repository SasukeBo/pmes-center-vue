<template>
  <div class="size-card">
    <div>{{ size }}</div>
    <div>{{ beginTime }}</div>
    <div>{{ endTime }}</div>
  </div>
</template>
<script>
export default {
  props: {
    size: Object,
    beginTime: {
      type: String,
      default: undefined
    },
    endTime: {
      type: String,
      default: undefined
    }
  }
}
</script>
