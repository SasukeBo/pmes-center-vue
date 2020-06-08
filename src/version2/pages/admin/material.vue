<template>
  <div class="material-manage">
    <div class="material-no-content" v-if="materials.total === 0">
      <img src="~@/version2/assets/images/material-no-content.png" />
      <span class="material-no-content__tip">暂无料号</span>
      <div>
        <el-button size="small" class="add-material-btn">添加料号</el-button>
      </div>
    </div>

    <router-view v-else></router-view>
  </div>
</template>
<script>
import gql from 'graphql-tag'

export default {
  data() {
    return {
      materials: {
        total: 0
      }
    }
  },
  apollo: {
    materials: {
      query: gql`
        query($pattern: String, $page: Int!, $limit: Int!) {
          materials(pattern: $pattern, page: $page, limit: $limit) {
            total
          }
        }
      `,
      client: 'adminClient',
      variables() {
        return {
          page: 1,
          limit: 1
        }
      }
    }
  }
}
</script>
<style lang="scss">
.material-manage {
  height: 100%;

  .material-no-content {
    text-align: center;

    img {
      margin: auto;
      display: block;
      padding-top: 160px;
    }

    .material-no-content__tip {
      font-size: 12px;
      color: #333;
      font-weight: bold;
    }

    .add-material-btn.el-button {
      margin: 26px 0;
      color: #fff;
      border-radius: 900px;
      border: none;
      background: linear-gradient(-52deg, #3fe3d3 0%, #5e83f2 100%);
      box-shadow: 0 3px 20px rgba(94, 131, 242, 0.3);
    }
  }
}
</style>
