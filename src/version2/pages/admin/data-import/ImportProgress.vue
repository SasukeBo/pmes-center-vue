<template>
  <div class="inline-item">
    <div class="import-progress">
      <el-progress
        :show-text="false"
        :percentage="percent"
        :stroke-width="10"
      ></el-progress>

      <div class="status-icon">
        <img
          src="~@/version2/assets/images/pi-quxiao.png"
          v-if="record.status === 'Loading'"
          @click="cancel"
        />
        <img
          src="~@/version2/assets/images/pi-error.png"
          v-if="record.status === 'Failed'"
        />
        <img
          src="~@/version2/assets/images/pi-success.png"
          v-if="record.status === 'Finished'"
        />
      </div>

      <el-button
        size="small"
        type="text"
        class="cancel-btn inline-item"
        v-if="record.status === 'Finished'"
        @click="revert"
        >撤销</el-button
      >
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'ImportProgress',
  props: {
    record: Object,
    rowFinishedCount: Number
  },
  data() {
    return {
      percentageInterval: undefined
    }
  },
  computed: {
    percent() {
      if (this.record && this.record.rowCount && this.rowFinishedCount) {
        var v = ((this.rowFinishedCount * 100) / this.record.rowCount).toFixed(
          2
        )

        return parseFloat(v)
      }

      if (this.record && this.record.rowCount === 0) {
        return 100
      }

      return 0
    }
  },
  methods: {
    cancel() {},
    revert() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: Int!) {
              response: revertImport(id: $id)
            }
          `,
          client: 'adminClient',
          variables: {
            id: this.record.id
          }
        })
        .then(() => {
          this.$message({ type: 'success', message: '撤销导入成功' })
          this.$emit('update-list')
        })
        .catch((e) => this.$GraphQLError(e))
    }
  },
  watch: {
    'record.status': {
      immediate: true,
      handler: function(val) {
        if (val === 'Loading') {
          var _this = this
          this.percentageInterval = setInterval(() => {
            _this.$apollo
              .query({
                query: gql`
                  query($id: Int!) {
                    response: importPercent(id: $id) {
                      status
                      count
                    }
                  }
                `,
                client: 'adminClient',
                fetchPolicy: 'network-only',
                variables: {
                  id: _this.record.id
                }
              })
              .then(({ data: { response } }) => {
                this.$emit('update:rowFinishedCount', response.count)
                if (response.status !== 'Loading') {
                  clearInterval(this.percentageInterval)
                }
              })
          }, 300)
        } else {
          clearInterval(this.percentageInterval)
        }
      }
    }
  }
}
</script>
<style lang="scss">
.console-import-data .import-operation-panel .import-progress {
  display: flex;
  align-items: center;

  .status-icon {
    width: 32px;
    text-align: left;
    margin-right: 8px;
  }

  .el-progress {
    width: 152px;
    padding: 0 16px;

    .el-progress-bar__inner {
      background: linear-gradient(
        270deg,
        rgba(63, 227, 211, 1) 0%,
        rgba(94, 131, 242, 1) 100%
      );
    }
  }
}
</style>
