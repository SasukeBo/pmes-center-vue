<template>
  <div class="material-page">
    <div class="material-page__header">
      <div class="material-page__header-inner">
        <div class="recent-versions" v-if="versions.length > 0">
          <div class="recent-versions__inner">
            <VersionCard
              v-for="v in versions"
              :key="'versions_' + v.id"
              :version="v"
            ></VersionCard>
          </div>
        </div>

        <div class="search-versions">
          <div class="search-versions__inner">
            <div class="search-versions__inner-compose">
              <el-select
                remote
                filterable
                :loading="searchVersionLoading"
                @change="changeVersion"
                v-model="versionID"
                placeholder="输入版本关键字"
                :remote-method="remoteMethod"
                popper-class="search-version-popper"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.version"
                  :value="item.id"
                >
                  <div class="search-version-option">
                    <div class="search-version-option__label">
                      {{ item.version }}
                    </div>
                    <div class="search-version-option__description">
                      {{ item.description }}
                    </div>
                  </div>
                </el-option>
              </el-select>

              <div class="search-versions__inner-append">
                <div class="append-circle">
                  <div class="append-circle__content"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-panels-header">
          <el-tabs v-model="activePanel" @tab-click="handlePanelChange" stretch>
            <el-tab-pane
              label="料号总览"
              name="material-overview"
            ></el-tab-pane>
            <el-tab-pane label="设备" name="material-device"></el-tab-pane>
            <el-tab-pane label="检测尺寸" name="material-size"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <div class="material-page__body">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import VersionCard from './VersionCard'
import gql from 'graphql-tag'

export default {
  name: 'MaterialPage',
  props: {
    id: [Number, String]
  },
  components: { VersionCard },
  data() {
    return {
      activePanel: 'material-overview',
      versions: [],
      searchVersionLoading: false,
      versionID: undefined,
      options: []
    }
  },
  apollo: {
    versions: {
      query: gql`
        query($id: Int!, $search: String, $limit: Int, $isActive: Boolean) {
          versions: materialVersions(
            id: $id
            search: $search
            limit: $limit
            isActive: $isActive
          ) {
            id
            version
            amount
            yield
            description
          }
        }
      `,
      variables() {
        return {
          id: this.id,
          limit: 3,
          isActive: false
        }
      }
    }
  },
  watch: {
    versions(val) {
      if (val) {
        this.options = val
      }
    }
  },
  methods: {
    remoteMethod(search) {
      this.$apollo
        .query({
          query: gql`
            query($id: Int!, $search: String, $limit: Int, $isActive: Boolean) {
              options: materialVersions(
                id: $id
                search: $search
                limit: $limit
                isActive: $isActive
              ) {
                id
                version
                description
              }
            }
          `,
          variables: {
            id: this.id,
            search
          }
        })
        .then(({ data: { options } }) => {
          this.options = options
        })
        .catch((e) => console.log(e))
    },
    handlePanelChange(val) {
      this.$router.push({ name: val.name, params: { id: this.id } })
    },
    changeVersion(val) {
      this.$router.push({
        name: this.$route.name,
        params: this.$route.params,
        query: { version_id: val }
      })
    }
  },
  created() {
    document.title = '数据中心 - 料号'
    this.activePanel = this.$route.name
  }
}
</script>
<style lang="scss">
.el-select-dropdown.el-popper.search-version-popper {
  border-radius: 8px;

  .el-select-dropdown__item {
    height: fit-content;
    width: 720px;
  }

  .search-version-option {
    .search-version-option__label {
      color: #666;
      font-weight: bold;
      font-size: 20px;
      padding-bottom: 16px;
    }

    .search-version-option__description {
      color: #999;
      font-size: 14px;
      font-weight: 400;
      white-space: break-spaces;
      line-height: 20px;
      padding-bottom: 16px;
    }
  }
}

.material-page {
  margin-bottom: 32px;

  .material-page__header {
    background: #fff;

    .material-page__header-inner {
      .recent-versions {
        height: 500px;
        max-width: 1200px;
        margin: auto;

        .recent-versions__inner {
          display: flex;
        }
      }

      .search-versions {
        height: 240px;
        background: #101846;
        display: flex;
        align-items: center;

        .search-versions__inner {
          flex: 1;
          text-align: center;
        }

        .search-versions__inner-compose {
          position: relative;
          width: fit-content;
          margin: auto;
        }

        .search-versions__inner-append {
          width: 28px;
          height: 28px;
          border: 2px solid #54c55c;
          box-sizing: border-box;
          border-radius: 50%;
          position: absolute;
          top: 14px;
          right: 10px;
          display: flex;
          align-items: center;

          .append-circle {
            flex: 1;

            .append-circle__content {
              width: 16px;
              height: 16px;
              margin: auto;
              background: #54c55c;
              border-radius: 50%;
            }
          }
        }

        .el-input {
          width: 720px;
          flex: 1;
        }

        .el-input__inner,
        .el-select__input {
          height: 56px;
          padding: 0 32px;
          font-size: 24px;
          border-radius: 900px;
          margin: 0;
        }
      }

      .tab-panels-header {
        max-width: 1200px;
        margin: auto;

        .el-tabs__header {
          margin: 0;
          height: 64px;
        }

        .el-tabs {
          width: 250px;
          margin: auto;

          .el-tabs__nav {
            background: #fff;
            border-radius: 4px;

            .el-tabs__active-bar {
              height: 4px;
              width: 56px;
              background-color: #5e83f2;
            }

            .el-tabs__item {
              color: #666;
              height: 64px;
              line-height: 64px;
              font-size: 14px;

              &.is-active {
                font-weight: bold;
                color: #5e83f2;
              }
            }
          }
        }
      }
    }
  }

  .material-page__body {
    max-width: 1200px;
    margin: auto;
    margin-top: 16px;
  }
}
</style>
