<template>
  <div class="rule-item-category-set-form">
    <el-input
      class="category-set-input"
      v-model="categorySet"
      placeholder="请输入类别取值集合,例:1,2,3,A,B,C"
    ></el-input>
  </div>
</template>
<script>
export default {
  name: 'RuleItemCategorySetForm',
  props: {
    set: Array
  },
  data() {
    return {
      categorySet: ''
    }
  },
  watch: {
    categorySet(val) {
      if (val) {
        this.$emit('update:set', val.split(','))
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.categorySet = this.set.join()
    }
  }
}
</script>

<style lang="scss">
.rule-item-category-set-form {
  width: 466px;

  .category-set-input {
    width: 100%;
    box-sizing: border-box;

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
