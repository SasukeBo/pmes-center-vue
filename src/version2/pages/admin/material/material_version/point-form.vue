<template>
  <div class="decode-tempalate-form__point-form">
    <span class="point-label">{{ value.name }}:</span>
    <el-input
      size="small"
      class="decode-template-form-cell"
      v-model="columnValue"
      @input="handleValueChange"
    ></el-input>
  </div>
</template>
<script>
export default {
  props: {
    value: Object
  },
  data() {
    return {
      columnValue: ''
    }
  },
  methods: {
    handleValueChange(value) {
      this.$emit('change', { id: this.value.id, value })
    }
  },
  created() {
    this.columnValue = this.value.index
  }
}
</script>
<style lang="scss">
.decode-tempalate-form__point-form {
  display: flex;
  margin-right: 24px;
  margin-bottom: 16px;

  .point-label {
    color: #666;
    font-size: 12px;
    width: 64px;
    padding-right: 8px;
    line-height: 32px;
  }

  .el-input {
    width: 72px;
    text-align: center;
  }
}
</style>
