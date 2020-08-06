<template>
  <div class="rule-item-type-form">
    <el-popover
      ref="popover"
      placement="bottom"
      trigger="manual"
      popper-class="rule-item-type-form-popover"
      :disabled="!isDatetime && !isCategory"
    >
      <div slot="reference" style="display: flex">
        <el-select
          v-model="form.type"
          @change="selectChange"
          popper-class="rule-item-type-form-select-popper"
        >
          <el-option value="Category" label="类别"></el-option>
          <el-option value="Datetime" label="编码日期"> </el-option>
          <el-option value="Weekday" label="周别日期"></el-option>
        </el-select>

        <el-button
          style="margin-left: 8px"
          v-show="isDatetime || isCategory"
          type="text"
          icon="el-icon-edit"
          @click="setPopperVisible(true)"
        ></el-button>
      </div>

      <div class="date-code-form">
        <div class="body" v-if="isDatetime">
          <div class="date-code-form__title">编码规则</div>
          <div class="date-code-form__item-label">DayCode：</div>
          <div class="date-code-form__item-form" style="margin-bottom: 16px">
            <RuleItemRangeForm
              :range.sync="form.dayCode"
              :reject.sync="form.dayCodeReject"
              with-reject
            ></RuleItemRangeForm>
          </div>
          <div class="date-code-form__item-label">MonthCode：</div>
          <div class="date-code-form__item-form">
            <RuleItemRangeForm
              :range.sync="form.monthCode"
              :reject.sync="form.monthCodeReject"
              with-reject
            ></RuleItemRangeForm>
          </div>
        </div>

        <div class="footer" v-if="isDatetime">
          <div class="footer-inner">
            <el-button @click="submit" size="mini" type="primary"
              >确定</el-button
            >
            <el-button @click="cancel" size="mini">取消</el-button>
          </div>
        </div>

        <div class="body" v-if="isCategory">
          <div class="date-code-form__title">取值区间</div>
          <div class="date-code-form__item-form" style="margin-bottom: 16px">
            <RuleItemCategorySetForm
              :set.sync="form.categorySet"
            ></RuleItemCategorySetForm>
          </div>
        </div>
        <div class="footer" v-if="isCategory">
          <div class="footer-inner">
            <el-button @click="submitCategory" size="mini" type="primary"
              >确定</el-button
            >
            <el-button @click="cancel" size="mini">取消</el-button>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import RuleItemRangeForm from './rule-item-range-form'
import RuleItemCategorySetForm from './rule-item-category-set-form'

export default {
  name: 'RuleItemTypeForm',
  props: {
    row: Object,
    type: String,
    dayCode: Array,
    dayCodeReject: Array,
    monthCode: Array,
    monthCodeReject: Array,
    categorySet: Array
  },
  components: { RuleItemRangeForm, RuleItemCategorySetForm },
  data() {
    return {
      dateCodeFormVisible: false,
      form: {
        type: '',
        dayCode: [],
        dayCodeReject: [],
        monthCode: [],
        monthCodeReject: [],
        categorySet: []
      }
    }
  },
  computed: {
    isDatetime() {
      return this.form.type === 'Datetime'
    },
    isCategory() {
      return this.form.type === 'Category'
    }
  },
  watch: {
    row(val) {
      this.initData(val)
    }
  },
  methods: {
    cancel() {
      this.setPopperVisible(false)
      setTimeout(() => {
        this.initData(this.row)
      }, 300)
    },
    selectChange(val) {
      if (val === 'Datetime') {
        this.setPopperVisible(true)
      }
      this.$emit('update:type', this.form.type)
    },
    submit() {
      this.$emit('update:dayCode', this.form.dayCode)
      this.$emit('update:dayCodeReject', this.form.dayCodeReject)
      this.$emit('update:monthCode', this.form.monthCode)
      this.$emit('update:monthCodeReject', this.form.monthCodeReject)
      this.setPopperVisible(false)
    },
    submitCategory() {
      this.$emit('update:categorySet', this.form.categorySet)
      this.setPopperVisible(false)
    },
    initData(val) {
      this.form.type = val.type
      this.form.dayCode = [].concat(val.dayCode || [])
      this.form.dayCodeReject = [].concat(val.dayCodeReject || [])
      this.form.monthCode = [].concat(val.monthCode || [])
      this.form.monthCodeReject = [].concat(val.monthCodeReject || [])
      this.form.categorySet = [].concat(val.categorySet || [])
    },
    setPopperVisible(val) {
      this.$refs.popover.showPopper = val
    }
  },
  created() {
    this.initData(this.row)
  }
}
</script>
<style lang="scss">
.rule-item-type-form {
  .el-select {
    .el-input__inner {
      text-align: center;
      border: none;
    }
  }
}

.el-select-dropdown.el-popper.rule-item-type-form-select-popper {
  box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.16);
  border: none;
}

.el-popover.el-popper.rule-item-type-form-popover {
  padding: 0;
  width: 516px;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.16);

  .date-code-form {
    .body {
      padding: 24px 24px 16px 24px;
    }

    .date-code-form__title {
      font-size: 16px;
      font-weight: bold;
      color: #666;
      line-height: 16px;
      padding-bottom: 22px;
    }

    .footer {
      padding-top: 16px;
      padding-bottom: 24px;
      border-top: 1px solid rgba(243, 244, 244, 1);

      .el-button {
        margin-right: 16px;
      }

      .footer-inner {
        padding: 0 24px;
      }
    }

    .date-code-form__item-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }

    .date-code-form__item-form {
      width: fit-content;
    }
  }
}
</style>
