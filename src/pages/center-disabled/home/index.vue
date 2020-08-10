<template>
  <div class="data-center-home">
    <div class="data-center-home__left">
      <div class="page-title">
        <img src="@//pages/center/assets/images/home/title@2x.png" />
      </div>

      <MaterialCarousel></MaterialCarousel>

      <div class="material-carousel-detail-btn">
        <el-button>详情</el-button>
      </div>
    </div>

    <div class="data-center-home__right">
      <HomeBody></HomeBody>
    </div>
  </div>
</template>
<script>
import MaterialCarousel from './components/MaterialCarousel'
import HomeBody from './HomeBody'

export default {
  name: 'DataCenterHome',
  components: {
    HomeBody,
    MaterialCarousel
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss">
@import '~@//pages/center/assets/scss/variables.scss';

.data-center-home {
  width: 100%;
  height: 100%;
  min-width: 1600px;
  min-height: 900px;
  display: flex;
  background: center / cover no-repeat
    url('~@//pages/center/assets/images/home/beijing@2x.png');

  .data-center-home__left {
    flex: 1;

    .page-title img {
      width: 100%;
      max-height: 100px;
      display: block;
      object-fit: contain;
    }

    .material-carousel-detail-btn {
      margin: auto;
      text-align: center;
      margin-top: 90px;

      .el-button {
        width: 200px;
        height: 60px;
        border-radius: 30px;
        background: $--color-main_1;
        font-size: 24px;
        color: #fff;
        border: none;

        &:hover {
          background: $--color-main_2;
        }

        &:focus {
          background: $--color-main_3;
        }
      }
    }
  }

  .data-center-home__right {
    flex: 2;
    background: rgba(4, 23, 55, 0.8);
  }
}
</style>
