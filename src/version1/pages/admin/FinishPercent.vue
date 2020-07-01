<template>
  <div class="import-finish-percent">
    <el-progress
      :text-inside="true"
      :stroke-width="15"
      :percentage="percent"
    ></el-progress>
  </div>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'AdminImportFinishPercent',
  props: {
    record: Object,
    finished: Boolean
  },
  data() {
    return {
      data: {},
      interval: undefined
    }
  },
  computed: {
    percent() {
      if (this.data.totalRows === 0) return 0

      return parseInt(
        ((this.data.finishedRows * 100) / this.data.totalRows).toFixed(0)
      )
    }
  },
  watch: {
    'data.finished': function(val) {
      if (val) {
        this.$emit('update:finished', true)
        clearInterval(this.interval)
      }
    }
  },
  created() {
    this.data = {
      ...this.record
    }
    if (!this.data.finished) {
      this.interval = setInterval(() => {
        this.$apollo
          .query({
            query: gql`
              query($id: Int!) {
                res: checkImport(id: $id) {
                  finished
                  finishedRows
                }
              }
            `,
            fetchPolicy: 'network-only',
            variables: {
              id: this.data.id
            }
          })
          .then(({ data: { res } }) => {
            this.data.finished = res.finished
            this.data.finishedRows = res.finishedRows
          })
          .catch((e) => {
            console.log(e)
          })
      }, 300)
    }
  }
}
</script>
