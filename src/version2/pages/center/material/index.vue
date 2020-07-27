<template>
  <div class="material-page">
    <div class="material-page__header">
      <div class="material-page__header-inner">
        <div class="recent-versions">
          <div class="recent-versions__inner">
            <VersionCard
              v-for="i in 3"
              :key="'versions_' + i"
              :version="version"
            ></VersionCard>
          </div>
        </div>

        <div class="search-versions">
          <div class="search-versions__inner">
            <div class="search-versions__inner-compose">
              <el-select
                remote
                filterable
                :loading="loading"
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

export default {
  name: 'MaterialPage',
  props: {
    id: [Number, String]
  },
  components: { VersionCard },
  data() {
    return {
      activePanel: 'material-overview',
      // TODO: remove fate data
      version: {
        version: 'v1.0.0',
        yield: 0.75,
        amount: 65536,
        description:
          '版本，最初指一种书籍经过多次传抄、刻印或以其他方式而形成的各种不同本子。随着时代的发展，版本也开始应用于影视、软件等事物上，形容对象相同但介绍方法等不同的两个事物。'
      },
      loading: false,
      versionID: undefined,
      options: [
        {
          id: 1,
          version: 'V1.0.0',
          description:
            '关于版本：版本，最初指一种书籍经过多次传抄、刻印或以其他方式而形成的各种不同本子。随着时代的发展，版本也开始应用于影视、软件等事物上，形容对象相同但介绍方法等不同的两个事物。'
        },
        {
          id: 2,
          version: 'V1.0.1',
          description:
            '关于版本：版本，最初指一种书籍经过多次传抄、刻印或以其他方式而形成的各种不同本子。随着时代的发展，版本也开始应用于影视、软件等事物上，形容对象相同但介绍方法等不同的两个事物。'
        }
      ]
    }
  },
  methods: {
    remoteMethod() {
      console.log(arguments)
    },
    handlePanelChange(val) {
      this.$router.push({ name: val.name, params: { id: this.id } })
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
