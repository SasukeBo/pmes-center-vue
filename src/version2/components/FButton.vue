<template>
  <el-button
    :size="size"
    :class="['app-theme-button', 'theme-button__' + type]"
    @click="$emit('click')"
    ><slot></slot
  ></el-button>
</template>
<script>
export default {
  props: {
    type: {
      default: 'normal',
      type: String
    },
    size: {
      default: 'small',
      type: String
    }
  }
}
</script>
<style lang="scss">
@import '~@/version2/assets/scss/variables.scss';

.app-theme-button.el-button {
  width: 88px;
  border: none;
  margin: 0 16px;
  font-size: 12px;
  font-weight: 400;
  transition: all 0.3s ease;

  &.theme-button__plain {
    color: $--font-color__main;
    background: #fff;
    box-shadow: 0 1px 10px rgba(94, 131, 242, 0.7);

    &:hover,
    &:focus {
      color: $--font-color__main;
      background-color: #fff;
      box-shadow: 0 1px 10px rgba(94, 131, 242, 1);
    }
  }

  &.theme-button__normal {
    color: #fff;
    background: $--bg-color__main;
    box-shadow: 0 3px 10px $--font-color__main;

    &:hover,
    &:focus {
      color: #fff;
      background-color: rgba(94, 131, 242, 0.8);
    }
  }
}
</style>
