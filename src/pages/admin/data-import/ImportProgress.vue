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
          src="~@//assets/images/pi-quxiao.png"
          v-if="status === 'Loading' && false"
          @click="cancel"
        />
        <img src="~@//assets/images/pi-error.png" v-if="status === 'Failed'" />
        <img
          src="~@//assets/images/pi-success.png"
          v-if="status === 'Finished'"
        />
      </div>

      <div class="opration-btn">
        <el-button
          size="small"
          type="text"
          class="cancel-btn inline-item"
          v-if="status === 'Finished'"
          @click="revert"
          >撤销</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'ImportProgress',
  props: {
    record: Object,
    rowCount: Number,
    rowFinishedCount: Number,
    status: String
  },
  data() {
    return {
      percentageInterval: undefined
    }
  },
  computed: {
    percent() {
      if (this.record && this.rowCount && this.rowFinishedCount) {
        var v = ((this.rowFinishedCount * 100) / this.rowCount).toFixed(2)

        return parseFloat(v)
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
            mutation($ids: [Int!]!) {
              response: revertImports(ids: $ids)
            }
          `,
          client: 'adminClient',
          variables: {
            ids: [this.record.id]
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
                    response: importStatus(id: $id) {
                      status
                      yield
                      rowCount
                      fileSize
                      finishedRowCount
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
                _this.$emit(
                  'update:rowFinishedCount',
                  response.finishedRowCount
                )
                _this.$emit('update:status', response.status)
                _this.$emit('update:yield', response.yield)
                _this.$emit('update:rowCount', response.rowCount)
                _this.$emit('update:fileSize', response.fileSize)
                if (['Finished', 'Failed'].includes(val)) {
                  clearInterval(_this.percentageInterval)
                }
              })
              .catch((e) => {
                _this.$$GraphQLError(e)
                clearInterval(_this.percentageInterval)
              })
          }, 1000)
        }

        if (['Finished', 'Failed'].includes(val)) {
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

  .opration-btn {
    width: 40px;
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
