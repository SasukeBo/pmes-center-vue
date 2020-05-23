<template>
  <div class="app-body-home">
    <div class="page-banner">
      <img src="~@/assets/banner@2x.png" />
    </div>

    <div class="search-form">
      <el-input
        placeholder="请输入产品料号"
        v-model="inputValue"
        @keydown.native.enter.prevent="materialSearch = inputValue"
      >
        <el-button
          slot="append"
          type="primary"
          @click="materialSearch = inputValue"
          >搜索</el-button
        >
      </el-input>
    </div>

    <div class="header-block" v-if="materials.length">
      <el-row :gutter="24">
        <el-col :span="18" v-if="recent" class="recent-view-col">
          <div>
            <div class="col-title">最近预览</div>
            <div class="col-card">
              <RecentMaterial :materialID="recent"></RecentMaterial>
            </div>
          </div>
        </el-col>
        <el-col :span="recent ? 6 : 24" class="create-material-col">
          <div>
            <div class="col-title">添加料号</div>
            <div class="col-card create-material-panel" @click="handleAdd">
              <img src="~@/assets/icon-plus@2x.png" />
              <span>添加料号</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="materials-block" v-if="materials.length">
      <div class="block-title">最近一年数据</div>

      <div class="block-body">
        <el-row :gutter="24">
          <el-col
            :span="6"
            v-for="m in materials"
            :key="'material_' + m.id"
            class="material-card-col"
          >
            <MaterialCard
              :materialID="m.id"
              :pending.sync="m.pending"
              :fileIDs.sync="m.fileIDs"
              @edit="editMaterial"
              @delete="deleteMaterial"
            ></MaterialCard>
          </el-col>
        </el-row>
      </div>

      <div
        class="loading"
        v-show="$apollo.queries.materialWrap.loading"
        v-loading="$apollo.queries.materialWrap.loading"
      ></div>
    </div>

    <div class="empty-block" v-if="!materials.length">
      <img src="~@/assets/empty-material@2x.png" />
      <div class="information">
        暂无料号
      </div>
      <el-button type="primary" size="small" @click="handleAdd"
        >添加料号</el-button
      >
    </div>

    <div class="footer">
      <el-button
        type="primary"
        icon="el-icon-top"
        @click="scrollTop"
      ></el-button>
    </div>

    <NotifyDialog
      :visible.sync="notifyDialogVisible"
      @confirm="openLoginDialog"
    ></NotifyDialog>

    <MaterialDialog
      :visible.sync="materialDialogVisible"
      :isEdit.sync="isEdit"
      :material="materialForm"
      @after-create="addMaterial"
    ></MaterialDialog>
  </div>
</template>
<script>
import MaterialCard from '@/theme1/components/MaterialCard.vue'
import RecentMaterial from '@/theme1/components/RecentMaterial.vue'
import NotifyDialog from '@/theme1/components/NotifyDialog.vue'
import MaterialDialog from '@/theme1/components/MaterialDialog.vue'
import gql from 'graphql-tag'
export default {
  name: 'Home',
  components: { MaterialCard, RecentMaterial, NotifyDialog, MaterialDialog },
  apollo: {
    materialWrap: {
      query: gql`
        query($offset: Int!, $limit: Int!, $search: String) {
          materialWrap: materialsWithSearch(
            offset: $offset
            limit: $limit
            search: $search
          ) {
            total
            materials {
              id
              name
              customerCode
              projectRemark
            }
          }
        }
      `,
      variables() {
        return {
          search: this.materialSearch,
          offset: this.offset,
          limit: this.limit
        }
      },
      fetchPolicy: 'network-only'
    }
  },
  data() {
    return {
      offset: 0,
      limit: 20,
      isEdit: false,
      materialForm: undefined,
      materialSearch: undefined,
      inputValue: undefined,
      materialWrap: {
        materials: [],
        total: 0
      },
      materials: [],
      materialDialogVisible: false,
      notifyDialogVisible: false
    }
  },
  watch: {
    materialWrap(nv) {
      if (nv) {
        this.materials = nv.materials || []
      }
    },
    inputValue(nv) {
      if (nv === '') {
        this.materialSearch = undefined
      }
    }
  },
  created() {
    this.recent = localStorage.getItem('recent_view_material_id')
    var _this = this
    window.onscroll = function() {
      var scrollTop = document.documentElement.scrollTop
      var clientHeight = document.body.clientHeight
      var scrollHeight = document.body.scrollHeight

      if (scrollTop + clientHeight >= scrollHeight - 500) {
        if (_this.materials.length < _this.materialWrap.total) {
          if (_this.materials.length > 0) {
            _this.offset = _this.materials.length - 1
          }
          _this.offset = 0
        }
      }
    }
  },
  methods: {
    editMaterial(material) {
      if (this.$store.state.currentUser) {
        this.isEdit = true
        this.materialForm = material
        this.materialDialogVisible = true
      } else {
        this.notifyDialogVisible = true
      }
    },
    deleteMaterial(id) {
      if (this.$store.state.currentUser) {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($id: Int!) {
                result: deleteMaterial(id: $id)
              }
            `,
            variables: { id }
          })
          .then(({ data: { result } }) => {
            if (parseInt(this.recent) === parseInt(id)) {
              localStorage.setItem('recent_view_material_id', '')
            }
            var index = this.materials.findIndex((m) => m.id === id)
            this.materials.splice(index, 1)
            this.$message({ type: 'success', message: result })
          })
          .catch((e) => {
            this.$message({
              type: 'error',
              message: e.message.replace('GraphQL error:', '')
            })
          })
      } else {
        this.notifyDialogVisible = true
      }
    },
    addMaterial(material) {
      this.materials.unshift(material)
    },
    openLoginDialog() {
      this.$store.commit('SET_LOGIN_DIALOG_VISIBLE', true)
    },
    handleAdd() {
      if (this.$store.state.currentUser) {
        this.materialDialogVisible = true
      } else {
        this.notifyDialogVisible = true
      }
    },
    scrollTop() {
      var timer = setInterval(function() {
        var osTop =
          document.documentElement.scrollTop || document.body.scrollTop
        var isSpeed = Math.floor(-osTop / 6)

        document.documentElement.scrollTop = document.body.scrollTop =
          osTop + isSpeed
        if (osTop === 0) {
          clearInterval(timer)
        }
      }, 30)
    }
  }
}
</script>
<style lang="scss">
.theme_1-app .app-body .app-body-home {
  padding-top: 32px;
  margin-bottom: 70px;

  .loading {
    height: 100px;

    .el-loading-mask {
      background: transparent;
    }
  }

  .empty-block {
    text-align: center;
    padding: 48px 0;

    img {
      width: 172.5px;
      height: 125.42px;
      padding-top: 90px;
    }

    .information {
      font-size: 12px;
      color: #333;
      font-weight: bold;
    }

    .el-button {
      margin-top: 24px;
      background: linear-gradient(
        218deg,
        rgba(63, 227, 211, 1) 0%,
        rgba(94, 131, 242, 1) 100%
      );
      border: none;
      box-shadow: 0px 3px 20px rgba(94, 131, 242, 0.48);
      border-radius: 900px;
    }
  }

  .footer {
    z-index: 2000;
    height: 70px;
    background: #1c1c1c;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;

    .el-button {
      float: right;
      border: none;
      border-radius: 0;
      height: 100%;
      width: 120px;
      background: #478ded;

      .el-icon-top {
        font-weight: bold;
        font-size: 20px;
      }
    }
  }

  .materials-block {
    padding-top: 12px;
    margin-bottom: 86px;

    .block-title {
      font-size: 16px;
      color: #666;
      font-weight: bold;
      line-height: 1;
      padding: 16px 0;
    }
  }

  .header-block {
    .col-title {
      line-height: 16px;
      padding: 16px 0;
      font-size: 16px;
      font-weight: bold;
      color: #666;
    }

    .col-card {
      height: 284px;
      border-radius: 4px;
      background: #fff;
    }

    .create-material-panel {
      border: 1px dashed rgba(31, 29, 89, 0.15);
      background: rgba(31, 29, 89, 0.05);
      text-align: center;
      cursor: pointer;

      img {
        width: 30px;
        height: 30px;
        display: block;
        margin: auto;
        padding-top: 116px;
        padding-bottom: 8px;
      }

      font-size: 12px;
      color: #5e83f2;
      line-height: 1;
    }
  }

  .page-banner img {
    width: 100%;
    height: 160px;
    display: block;
  }

  .search-form {
    width: 60%;
    margin: auto;
    position: relative;

    .el-input {
      top: -28px;

      .el-input__inner {
        height: 56px;
        border-top-left-radius: 900px;
        border-bottom-left-radius: 900px;
        padding: 0 32px;
        font-size: 24px;
        border: none;
      }

      .el-input-group__append {
        border-top-right-radius: 900px;
        border-bottom-right-radius: 900px;
        border: none;
        background: #5e83f2;
        font-size: 24px;
        color: #fff;
        font-weight: 400;
      }
    }
  }
}

@media only screen and (max-width: 650px) {
  .theme_1-app .app-body .app-body-home {
    .search-form {
      width: 90%;
    }

    .materials-block .block-body .material-card-col {
      width: 100%;
    }
  }
}

@media only screen and (max-width: 1200px) {
  .theme_1-app .app-body-home {
    .header-block {
      .recent-view-col {
        // min-width: 650px;
        width: 100%;
      }

      .create-material-col {
        width: 100%;
      }
    }

    .materials-block .block-body .material-card-col {
      min-width: 306px;
    }
  }
}
</style>
