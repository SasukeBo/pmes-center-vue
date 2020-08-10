<template>
  <div class="data-center-home__material-carousel">
    <el-carousel height="100%" :autoplay="false" arrow="never" trigger="click">
      <el-carousel-item
        v-for="(material, i) in materials"
        :key="'material_' + i"
      >
        <MaterialCarouselItem :material="material"></MaterialCarouselItem>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import MaterialCarouselItem from './MaterialCarouselItem'
export default {
  name: 'MaterialCarousel',
  components: { MaterialCarouselItem },
  data() {
    return {
      materials: [
        { name: '1765', total: 1000, yield: 1 },
        { name: '1765', total: 1000, yield: 0.9 },
        { name: '1765', total: 1000, yield: 0.8 },
        { name: '1765', total: 1000, yield: 0.7 },
        { name: '1765', total: 1000, yield: 0.6 }
      ]
    }
  }
}
</script>
<style lang="scss">
@import '~@//pages/center/assets/scss/variables.scss';

.data-center-home__material-carousel {
  height: 100%;
  max-height: 600px;

  .el-carousel {
    height: 100%;

    .el-carousel__indicator .el-carousel__button {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid $--color-main_1;
      box-sizing: border-box;
      background: transparent;
    }

    .el-carousel__indicator.is-active .el-carousel__button {
      background: $--color-main_1;
    }
  }
}
</style>
