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
        v-if="index1"
        class="range-index-input"
        v-model="index2"
        placeholder="止"
        size="small"
      ></el-input>

      <el-input
        v-if="withReject && index1"
        class="range-index-input wide-input"
        v-model="rejectStr"
        placeholder="请输入剔除字段,例:1,2,3,A,B,C"
        size="small"
      ></el-input>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RuleItemRangeForm',
  props: {
    range: Array,
    reject: Array,
    withReject: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      index1: undefined,
      index2: undefined,
      rejectStr: ''
    }
  },
  watch: {
    range(val) {
      this.initForm(val)
    },
    index1() {
      this.updateRange()
    },
    index2() {
      this.updateRange()
    },
    rejectStr(val) {
      if (!val) this.$emit('update:reject', [])
      var rejects = val.split(',')
      this.$emit('update:reject', rejects)
    }
  },
  methods: {
    updateRange() {
      var range = [this.index1, this.index2]
      if (!range[0]) {
        this.$emit('update:range', [])
        return
      }
      if (!range[1]) {
        this.$emit('update:range', range.slice(0, 1))
        return
      }
      this.$emit('update:range', range)
    },
    initForm(val) {
      if (!val) return
      if (val.length > 0 && val[0]) {
        this.index1 = val[0]
      } else {
        this.index1 = undefined
        this.index2 = undefined
      }

      if (val.length > 1 && val[1]) {
        this.index2 = val[1]
      } else {
        this.index2 = undefined
      }

      if (this.withReject) {
        this.rejectStr = this.reject.join()
      }
    }
  },
  created() {
    this.initForm(this.range)
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

    &.wide-input {
      width: 286px;
      margin-left: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
