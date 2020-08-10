<template>
  <div class="material-version-card">
    <div class="yield-dashboard">
      <div class="dashboard-progress">
        <svg viewBox="0 0 100 100">
          <path fill="#e5e9f2" :d="basePath" :stroke-width="0.5"></path>
          <path
            fill="url('#myGradient')"
            :d="trackPath"
            :stroke-width="0.5"
          ></path>
          <defs>
            <linearGradient id="myGradient" gradientTransform="rotate(0)">
              <stop offset="0" stop-color="#5358FF" />
              <stop offset="100%" stop-color="#3FE3D3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span class="label">Yield</span>
    </div>
    <div class="yield-ratio">
      {{ (version.yield * 100).toFixed(2) }}
      <div class="yield-ratio__percent">
        %
      </div>
    </div>
    <div class="version-amount">产量：{{ version.amount }}</div>
    <div class="version">{{ version.version }}</div>
    <div class="description">{{ version.description }}</div>
  </div>
</template>
<script>
export default {
  name: 'VersionCard',
  props: {
    version: Object
  },
  data() {
    return {
      stroke: '#20a0ff',
      basePath: `
      M 0 0
      M 2 50
      a 48 48 0 1 1 96 0
      a 5 5 0 1 1 -10 0
      a 38 38 0 1 0 -76 0
      a 5 5 0 0 1 -10 0
      `
    }
  },
  computed: {
    trackPath() {
      var yieldRatio = this.version.yield
      var cosa = Math.cos(Math.PI * yieldRatio)
      var sina = Math.sin(Math.PI * yieldRatio)
      var pbx = 50 - 48 * cosa
      var pby = 50 - sina * 48
      var pax = 50 - 38 * cosa
      var pay = 50 - sina * 38

      return `
      M 0 0
      M 2 50
      A 48 48 0 0 1 ${pbx} ${pby}
      A 5 5 0 1 1 ${pax} ${pay}
      A 38 38 0 0 0 12 50
      a 5 5 0 0 1 -10 0
      `
    }
  }
}
</script>
<style lang="scss">
.material-version-card {
  margin: 0 12px;
  flex: 1;
  height: 500px;
  max-width: 30%;
  background: #fff;
  padding: 86px 0;
  box-sizing: border-box;
  text-align: center;

  .description {
    width: 232px;
    margin: auto;
    font-size: 12px;
    color: #999;
    padding-top: 16px;
  }

  .version {
    font-size: 20px;
    color: #999;
    font-weight: bold;
    line-height: 20px;
    padding-top: 30px;
  }

  .version-amount {
    font-size: 14px;
    color: #666;
    line-height: 14px;
    padding-top: 16px;
  }

  .yield-ratio {
    font-size: 32px;
    color: #666;
    font-weight: bold;
    line-height: 32px;
    position: relative;
    width: fit-content;
    margin: auto;

    .yield-ratio__percent {
      display: inline-block;
      color: #707070;
      font-size: 20px;
      position: absolute;
      right: -22px;
      font-weight: 400;
      line-height: 39px;
    }
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  .yield-dashboard {
    width: 200px;
    height: 110px;
    margin: auto;
    position: relative;

    .label {
      left: 0;
      color: #666666;
      font-size: 24px;
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      padding: 0 32px;
      box-sizing: border-box;
    }
  }
}
</style>
