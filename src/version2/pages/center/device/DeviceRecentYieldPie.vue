<template>
  <div class="device-recent-yield">
    <div ref="chart" class="pie-chart"></div>
    <div
      class="yield"
      v-if="deviceResult && deviceResult.ok && deviceResult.ng"
    >
      Yield:
      {{
        ((deviceResult.ok * 100) / (deviceResult.ok + deviceResult.ng)).toFixed(
          2
        )
      }}%
    </div>
    <div class="data-block" v-if="deviceResult">
      <div class="title">
        <div style="padding-bottom: 16px; font-size: 18px;">
          检测设备(Device)
        </div>
        {{ deviceResult.device.name }}
      </div>
      <div class="sub-title">
        近三个月产量：{{ deviceResult.ok + deviceResult.ng }}个
      </div>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import echarts from 'echarts'

export default {
  name: 'DeviceRecentYieldPie',
  props: {
    id: [Number, String]
  },
  data() {
    return {
      deviceResult: undefined,
      mychart: undefined,
      option: {
        color: ['#3FE3D3', '#E04660'],
        series: [
          {
            name: '产量',
            type: 'pie',
            radius: ['30%', '55%'],
            center: ['50%', '50%'],
            label: {
              show: false
            },
            itemStyle: {
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowBlur: 10
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 24,
                fontWeight: 'bold'
              }
            },
            data: []
          }
        ]
      }
    }
  },
  apollo: {
    deviceResult: {
      query: gql`
        query($input: Search!) {
          deviceResult: analyzeDevice(searchInput: $input) {
            device {
              id
              name
            }
            ok
            ng
          }
        }
      `,
      variables() {
        var t = new Date()
        t.setMonth(t.getMonth() - 3)
        t.setHours(0, 0, 0, 0)

        return {
          input: {
            deviceID: this.id,
            beginTime: t
          }
        }
      }
    }
  },
  mounted() {
    this.mychart = echarts.init(this.$refs.chart)
  },
  watch: {
    deviceResult(nv) {
      this.option.series[0].data = [
        { name: 'OK', value: nv.ok },
        { name: 'NG', value: nv.ng }
      ]

      this.mychart.clear()
      this.mychart.setOption(this.option)
    }
  }
}
</script>
<style lang="scss">
.theme_1-app .device-recent-yield {
  height: 200px;
  display: flex;
  position: relative;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 16px;

  .yield {
    position: absolute;
    font-size: 24px;
    color: #3fe3d3;
    top: 32px;
    left: 32px;
  }

  .pie-chart {
    flex: 2;
    height: 200px;
    max-width: 66%;
  }

  .data-block {
    flex: 1;
    padding: 32px 0;

    .title {
      font-size: 24px;
      color: #333;
      font-weight: bold;
      line-height: 24px;
      padding-bottom: 16px;
    }

    .sub-title {
      line-height: 16px;
      font-size: 16px;
      color: #666;
      padding-bottom: 8px;
    }
  }
}
</style>
