<template>
  <div class="data-center-home__material-carousel-item">
    <div class="material-title">料号：{{ material.name }}</div>
    <div class="quantity">
      <div>近一月生产数据</div>
      <div>总产量：{{ material.total }}</div>
    </div>
    <div class="yield-rate">
      <img src="@/version2/pages/center/assets/images/home/lunbotu@2x.png" />
      <div
        class="ok absolute-block"
        :style="{ bottom: 190 * material.yield - 32 + 'px' }"
      >
        <div>{{ (material.yield * 100).toFixed(1) }}%</div>
        <img src="@/version2/pages/center/assets/images/home/OK@2x.png" />
      </div>
      <div
        class="ng absolute-block"
        :style="{ bottom: 190 * (1 - material.yield) - 32 + 'px' }"
      >
        <div>{{ ((1 - material.yield) * 100).toFixed(1) }}%</div>
        <img src="@/version2/pages/center/assets/images/home/NG@2x.png" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MaterialCarouselItem',
  props: {
    material: Object
  }
}
</script>
<style lang="scss">
@import '~@/version2/pages/center/assets/scss/variables.scss';

.data-center-home__material-carousel-item {
  height: 100%;
  width: 100%;
  padding-top: 32px;
  padding-left: 65px;
  padding-right: 65px;
  box-sizing: border-box;

  .material-title {
    width: 290px;
    height: 90px;
    padding-top: 38px;
    padding-bottom: 29px;
    line-height: 24px;
    box-sizing: border-box;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: $--color-font_1;
    margin: auto;
    background: center / cover no-repeat
      url('~@/version2/pages/center/assets/images/home/liaohao@2x.png');
  }

  .quantity {
    color: $--color-font_1;
    text-align: center;
    font-size: 18px;
    margin: auto;
    margin-top: 5px;
  }

  .yield-rate {
    margin-bottom: 42px;
    box-sizing: border-box;
    height: 358px;
    position: relative;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .absolute-block {
      position: absolute;
      width: 16.2%;
      bottom: -28px;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      transition: all 0.5s ease;

      img {
        width: 100%;
      }

      &.ok {
        right: 25%;
        color: $--color-main_1;
      }

      &.ng {
        left: 25%;
        color: $--color-red;
      }
    }
  }
}
</style>
