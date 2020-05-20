<template>
  <div class="size-analyze">
    <PointCard v-for="i in 10" :key="'test_' + i"></PointCard>
  </div>
</template>
<script>
import PointCard from '@/theme1/components/PointCard.vue'
export default {
  name: 'SizeAnalyze',
  components: { PointCard },
  props: ['id'],
  data() {
    return {
      offset: 0, // 起点
      limit: 10 // 单次拉取数量
    }
  }
}
</script>
