<template>
  <div class="rule-item-range-form">
    <div style="line-hgiht: 32px">
      <el-input
        class="range-index-input"
        v-model="index1"
        placeholder="起"
        size="small"
      ></el-input>
      <span style="padding: 0 8px">-</span>
      <el-input
        class="range-index-input"
        :disabled="!index1"
        v-model="index2"
        placeholder="止"
        size="small"
      ></el-input>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RuleItemRangeForm',
  props: {
    range: Array
  },
  data() {
    return {
      index1: undefined,
      index2: undefined
    }
  },
  watch: {
    range(val) {
      if (val) {
        this.initRange(val)
      }
    },
    index1(val) {
      var range = this.range || []
      if (range.length > 0) {
        range[0] = val
      } else {
        range.push(val)
      }

      this.$emit('update:range', range)
    },
    index2(val) {
      var range = this.range || []
      if (range.length > 1) {
        range[1] = val
      } else if (range.length > 0) {
        range.push(val)
      }

      if (range.length > 0) {
        this.$emit('update:range', range)
      }
    }
  },
  methods: {
    initRange(val) {
      if (!val) return
      if (val.length > 0 && val[0]) {
        this.index1 = val[0]
      }
      if (val.length > 1 && val[1]) {
        this.index2 = val[1]
      }
    }
  },
  created() {
    this.initRange(this.range)
  }
}
</script>
<style lang="scss">
.rule-item-range-form {
  display: flex;
  width: fit-content;
  margin: auto;

  .range-index-input {
    width: 72px;

    .el-input__inner {
      text-align: center;
      background: rgba(243, 244, 244, 1);
      opacity: 1;
      border: none;
      box-sizing: border-box;
      border-radius: 8px;

      &:active,
      &:focus,
      &:hover {
        background: rgba(94, 131, 242, 0.1);
        box-shadow: 0px 3px 6px rgba(94, 131, 242, 0.4);
        opacity: 1;
        border-radius: 8px;
      }
    }
  }
}
</style>
