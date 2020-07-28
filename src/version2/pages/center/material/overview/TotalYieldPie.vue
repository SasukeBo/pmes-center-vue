<template>
  <div class="material-overview-yield-pie">
    <div class="yield-chart-block">
      <div class="chart-mount" ref="chart"></div>
      <div class="chart-content">
        <div class="yield-ratio">Yield:{{ yieldRatio }}%</div>

        <div class="item" v-if="materialResult.material">
          <span v-if="materialResult.material.customerCode"
            >{{ materialResult.material.customerCode }}({{
              materialResult.material.name
            }})</span
          >
          <span v-else>{{ materialResult.material.name }}</span>
        </div>
        <div
          class="item"
          v-if="
            materialResult.material && materialResult.material.projectRemark
          "
        >
          {{ materialResult.material.projectRemark }}
        </div>

        <div class="item" v-if="materialResult">
          总产量:{{ materialResult.ok + materialResult.ng }}
        </div>
      </div>
    </div>

    <div class="yield-content-block">
      <div class="filter-form">
        <el-form size="mini" inline>
          <el-form-item label="检测设备">
            <el-select v-model="form.deviceID">
              <el-option
                v-for="d in devices"
                :key="'device_' + d.id"
                :label="d.name"
                :value="d.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="时间范围">
            <el-date-picker
              v-model="form.duration"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>

      <div class="current-version">
        <div class="name">当前版本 : {{ version.version }}</div>
        <p class="description">{{ version.description }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import echarts from 'echarts'

export default {
  props: {
    id: [Number, String]
  },
  data() {
    return {
      form: {
        deviceID: undefined,
        duration: [],
        beginTime: undefined,
        endTime: undefined
      },
      chart: undefined,
      devices: [],
      materialResult: {},
      version: {
        version: 'V1.0.0',
        description:
          '关于版本：版本，最初指一种书籍经过多次传抄、刻印或以其他方式而形成的各种不同本子。随着时代的发展，版本也开始应用于影视、软件等事物上，形容对象相同但介绍方法等不同的两个事物。'
      }
    }
  },
  apollo: {
    devices: {
      query: gql`
        query($materialID: Int!) {
          devices(materialID: $materialID) {
            id
            name
          }
        }
      `,
      variables() {
        return {
          materialID: this.id
        }
      }
    },
    materialResult: {
      query: gql`
        query($input: Search!) {
          materialResult: analyzeMaterial(searchInput: $input) {
            material {
              id
              name
              customerCode
              projectRemark
            }
            ok
            ng
          }
        }
      `,
      variables() {
        return {
          input: {
            materialID: this.id,
            deviceID: this.form.deviceID || undefined,
            beginTime: this.form.beginTime || undefined,
            endTime: this.form.endTime || undefined,
            extra: {}
          }
        }
      }
    }
  },
  computed: {
    yieldRatio() {
      if (!this.materialResult) {
        return 0
      }
      if (this.materialResult.ng + this.materialResult.ok === 0) {
        return 0
      }

      return (
        (this.materialResult.ok * 100) /
        (this.materialResult.ok + this.materialResult.ng)
      ).toFixed(2)
    }
  },
  watch: {
    materialResult(val) {
      if (val) {
        var option = {
          color: ['#FFBA30', 'rgba(255, 186, 48, 0.21)'],
          grid: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          },
          series: [
            {
              name: '产量',
              type: 'pie',
              label: {
                show: false
              },
              itemStyle: {
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowOffsetY: 5
              },
              lableLine: {
                show: false
              },
              radius: [45, 75],
              center: [75, 75],
              data: [val.ok, val.ng],
              hoverAnimation: false
            }
          ]
        }
        // this.chart.clear()
        if (!this.chart) {
          this.chart = echarts.init(this.$refs.chart)
        }
        this.chart.setOption(option)
      }
    }
  }
}
</script>
<style lang="scss">
.material-overview-yield-pie {
  height: 260px;
  margin: 16px 0;
  background: #fff;
  display: flex;

  .yield-chart-block {
    height: 100%;
    width: 486px;
    padding-top: 55px;
    padding-bottom: 35px;
    display: flex;
    box-sizing: border-box;
    background: linear-gradient(
      180deg,
      rgba(83, 88, 255, 1) 0%,
      rgba(10, 174, 209, 1) 100%
    );
    opacity: 0.8;
    border-radius: 4px 80px 4px 4px;

    .chart-mount {
      width: 190px;
      height: 170px;
      margin-left: 15px;
    }

    .chart-content {
      .yield-ratio {
        font-size: 32px;
        font-family: Arial;
        font-weight: 900;
        line-height: 45px;
        color: rgba(255, 255, 255, 1);
        opacity: 1;
        padding-bottom: 18px;
      }

      .item {
        font-size: 16px;
        font-family: Arial;
        font-weight: 400;
        line-height: 20px;
        color: rgba(255, 255, 255, 1);
        opacity: 0.8;
        padding-bottom: 8px;
      }
    }
  }

  .yield-content-block {
    flex: 1;

    .filter-form {
      height: 98px;
      padding-top: 48px;
      padding-bottom: 22px;
      border-bottom: 1px dashed rgba(112, 112, 112, 0.67);
      box-sizing: border-box;
      padding-left: 24px;

      .el-form-item__label {
        color: #666;
        font-size: 12px;
      }
    }

    .current-version {
      padding: 0 25px;
      padding-top: 29px;
      box-sizing: border-box;

      .name {
        color: #666;
        font-size: 20px;
        font-weight: bold;
      }

      .description {
        color: #999;
        font-size: 14px;
      }
    }
  }
}
</style>
