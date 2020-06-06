<template>
  <el-dialog :visible="visible" width="520px" custom-class="export-dialog">
    <div class="status-icon" v-if="isFinished">
      <img src="~@/assets/success-icon@2x.png" />
    </div>
    <div class="status-icon" v-if="isFailed">
      <img src="~@/assets/failed-icon@2x.png" />
    </div>
    <div class="percent-text" v-if="!isFinished && !isFailed">
      <span>已完成</span>
      <span class="big-number">{{
        response.percent ? parsePercent(response.percent) : 0
      }}</span>
      <span>%</span>
    </div>

    <div class="percent-progress">
      <el-progress
        :percentage="response.percent ? parsePercent(response.percent) : 0"
        :show-text="false"
        :stroke-width="10"
      ></el-progress>
    </div>

    <div class="status-message" v-if="response.message">
      {{ response.message }}
    </div>
    <div class="tips">数据量较大时，建议拆分日期范围导出</div>
    <div class="close-btn">
      <el-button
        plain
        size="mini"
        @click="closeDialog"
        v-if="isFinished || isFailed"
        >确定</el-button
      >
      <el-button plain size="mini" @click="cancel" :loading="cancelling" v-else
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import gql from 'graphql-tag'
import { pipeToUndefined } from '@/helpers'
export default {
  props: {
    visible: Boolean,
    search: Object,
    materialID: [Number, String]
  },
  name: 'ExportDialog',
  apollo: {
    opID: {
      query: gql`
        query($input: Search!) {
          opID: exportProducts(searchInput: $input)
        }
      `,
      variables() {
        var s = this.search
        var input = {
          materialID: this.materialID,
          deviceID: pipeToUndefined(s.deviceID),
          beginTime: pipeToUndefined(s.beginTime),
          endTime: pipeToUndefined(s.endTime),
          extra: {
            lineID: pipeToUndefined(s.lineID),
            jigID: pipeToUndefined(s.jigID),
            mouldID: pipeToUndefined(s.mouldID),
            shiftNumber: pipeToUndefined(s.shiftNumber)
          }
        }

        return {
          input
        }
      },
      fetchPolicy: 'network-only',
      skip() {
        return !this.visible
      }
    }
  },
  data() {
    return {
      opID: '',
      checker: undefined,
      cancelling: false,
      isFinished: false,
      isFailed: false,
      response: {
        percent: 0,
        message: '等待中 ...',
        fileName: '',
        finished: false
      }
    }
  },
  watch: {
    opID(val) {
      if (val) {
        var _this = this
        this.checker = setInterval(() => {
          _this.$apollo
            .query({
              query: gql`
                query($opID: String!) {
                  response: exportFinishPercent(opID: $opID) {
                    percent
                    message
                    fileName
                    finished
                  }
                }
              `,
              variables: {
                opID: val
              },
              fetchPolicy: 'network-only'
            })
            .then(({ data: { response } }) => {
              _this.response.percent = response.percent
              _this.response.message = response.message
              _this.response.fileName = response.fileName
              _this.response.finished = response.finished
            })
            .catch((e) => {
              clearInterval(this.checker)
              this.isFailed = true
              _this.response.message = e.message.replace('GraphQL error:', '')
            })
        }, 300)
      }
    },
    'response.finished': function(val) {
      if (val) {
        clearInterval(this.checker)
        var a = document.createElement('a')
        a.href = '/downloads?file_name=' + this.response.fileName
        a.click()
        this.isFinished = true
      }
    }
  },
  methods: {
    cancel() {
      clearInterval(this.checker)
      this.cancelling = true
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($opID: String!) {
              cancelExport(opID: $opID)
            }
          `,
          variables: {
            opID: this.opID
          }
        })
        .then(() => {
          this.cancelling = false
          this.$message({ type: 'info', message: '已取消' })
          this.closeDialog()
        })
        .catch((e) => {
          this.cancelling = false
          this.$message({
            type: 'error',
            message: e.message.replace('GraphQL error:', '')
          })
        })
    },
    closeDialog() {
      this.$emit('update:visible', false)
      this.response = {
        percent: 0,
        message: '等待中 ...',
        fileName: '',
        finished: false
      }
      this.isFinished = false
      this.isFailed = false
    },
    parsePercent(val) {
      var p = (val * 100).toFixed(0)
      return parseInt(p)
    }
  }
}
</script>
<style lang="scss">
.theme_1-app .export-dialog {
  border-radius: 4px;
  border: none;
  text-align: center;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
    border-radius: 4px;
    border: none;

    .status-icon {
      padding-top: 36px;

      img {
        width: 48px;
      }
    }

    .percent-text {
      padding-top: 32px;
      font-size: 12px;
      color: #3fe3d3;

      .big-number {
        width: 110px;
        text-align: center;
        font-size: 50px;
        line-height: 56px;
        display: inline-block;
        height: 56px;
      }
    }

    .percent-progress {
      width: 300px;
      margin: auto;
      margin-top: 16px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 900px;

      .el-progress-bar__inner {
        background: linear-gradient(
          270deg,
          rgba(63, 227, 211, 1) 0%,
          rgba(94, 131, 242, 1) 100%
        );
      }
    }

    .status-message {
      font-size: 16px;
      color: #666;
      font-weight: bold;
      padding-top: 16px;
    }

    .tips {
      font-size: 12px;
      color: #ccc;
      padding-top: 16px;
    }

    .close-btn {
      padding-top: 48px;
      padding-bottom: 32px;

      .el-button {
        width: 64px;
        color: #5e83f2;
      }
    }
  }
}
</style>
