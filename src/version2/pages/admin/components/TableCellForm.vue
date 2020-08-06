<template>
  <div class="table-cell-form">
    <div v-if="!useSlot">
      <div v-if="!isEdit" class="table-cell-form__show" @click="isEdit = true">
        <span class="nil-value-btn" v-if="!formValue && formValue !== 0"
          >+</span
        >
        <span v-else>
          {{ formatValue(formValue) }}
        </span>
      </div>

      <div class="table-cell-form__inline-form" v-else>
        <el-input
          v-if="type === 'input'"
          ref="input"
          size="small"
          v-model="formValue"
          @keyup.enter.native.prevent="save"
          @keyup.esc.native.prevent.stop="cancel"
        ></el-input>

        <el-select v-model="formValue" v-if="type === 'select'">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-button
          size="small"
          icon="el-icon-check"
          type="text"
          @click="save"
        ></el-button>
        <el-button
          size="small"
          icon="el-icon-close"
          type="text"
          @click="cancel"
        ></el-button>
      </div>
    </div>
    <slot v-else></slot>
  </div>
</template>
<script>
export default {
  props: {
    row: Object,
    prop: String,
    options: Array,
    useSlot: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'input'
    },
    index: Number
  },
  data() {
    return {
      isEdit: false,
      formValue: ''
    }
  },
  watch: {
    row: {
      immediate: true,
      handler: function(val) {
        if (this.useSlot) return
        this.formValue = this.row[this.prop]
      }
    }
  },
  methods: {
    formatValue(value) {
      if (this.type === 'select') {
        var index = this.options.findIndex((i) => i.value === value)
        return this.options[index].label
      } else {
        return value
      }
    },
    openEdit() {
      this.isEdit = true
    },
    save() {
      var origin = this.row
      origin[this.prop] = this.formValue

      this.$emit('update', {
        index: this.index,
        prop: this.prop,
        data: origin
      })
      this.isEdit = false
    },
    cancel() {
      this.formValue = this.row[this.prop]
      this.isEdit = false
    }
  }
}
</script>
<style lang="scss">
.table-cell-form {
  .nil-value-btn {
    color: #5e83f2;
    font-size: 14px;
    cursor: pointer;
    font-weight: bold;
  }

  .table-cell-form__show {
    cursor: pointer;
    color: #666;
    font-size: 14px;
  }

  .table-cell-form__inline-form {
    display: flex;

    .el-input__inner {
      border: none;
    }

    .el-button {
      margin: 0 8px;
    }
  }
}
</style>
