<template>
  <div class="points-form">
    <div class="tip">
      检测项录入支持导入，点击
      <a
        href="/downloads/xlsx?file_token=points_import_template"
        target="_blank"
        >下载模板</a
      >
    </div>

    <div class="import-points">
      <el-upload
        action="/"
        accept=".xlsx"
        :http-request="handleUpload"
        :limit="1"
        ref="pointUpload"
        :show-file-list="false"
      >
        <el-button size="small" type="primary"
          ><img
            src="~@/version2/assets/images/upload-btn-icon.png"
          />导入</el-button
        >
      </el-upload>
    </div>

    <div class="table-form">
      <div class="table-header table-row">
        <div class="table-cell">检测点位</div>
        <div class="table-cell">USL</div>
        <div class="table-cell">Nominal</div>
        <div class="table-cell">LSL</div>
        <div class="table-cell">所在列</div>
      </div>

      <div class="table-body" ref="table-body">
        <div
          class="table-body__row table-row"
          v-for="(p, i) in points"
          :key="'point_' + i"
        >
          <div class="table-cell">
            <TableCellForm
              :row="p"
              prop="name"
              @update="editCell"
            ></TableCellForm>
          </div>
          <div class="table-cell">
            <TableCellForm
              :row="p"
              prop="upperLimit"
              @update="editCell"
            ></TableCellForm>
          </div>
          <div class="table-cell">
            <TableCellForm
              :row="p"
              prop="nominal"
              @update="editCell"
            ></TableCellForm>
          </div>
          <div class="table-cell">
            <TableCellForm
              :row="p"
              prop="lowerLimit"
              @update="editCell"
            ></TableCellForm>
          </div>
          <div class="table-cell">
            <TableCellForm
              :row="p"
              prop="index"
              @update="editCell"
            ></TableCellForm>
          </div>
          <div class="delete-row-btn">
            <img
              src="~@/version2/assets/images/pi-quxiao.png"
              @click="removeRow(p)"
            />
          </div>
        </div>
      </div>

      <div class="table-footer" @click="addPoint()">
        + 手动添加
      </div>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import TableCellForm from '@/version2/pages/admin/components/TableCellForm.vue'

export default {
  name: 'PointsForm',
  components: { TableCellForm },
  props: {
    dataset: Array
  },
  data() {
    return {
      points: []
    }
  },
  methods: {
    editCell(val) {
      var data = val.data
      var prop = val.prop
      var index = this.points.findIndex((p) => p.name === data.name)
      this.points[index][prop] = data[prop]
      this.updateList()
    },
    removeRow(row) {
      var index = this.points.findIndex((p) => p.name === row.name)
      this.points.splice(index, 1)
      this.updateList()
    },
    handleUpload({ file }) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($file: Upload!) {
              response: parseImportPoints(file: $file) {
                id
                name
                index
                nominal
                upperLimit
                lowerLimit
              }
            }
          `,
          client: 'adminClient',
          variables: {
            file
          }
        })
        .then(({ data: { response } }) => {
          var points = response.map((p) => {
            delete p.__typename
            delete p.id
            return p
          })
          this.points = this.points.concat(points)
          this.$refs.pointUpload.clearFiles()
          this.updateList()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.message.replace('GraphQL error:', '')
          })
          this.$refs.pointUpload.clearFiles()
        })
    },
    addPoint() {
      this.points.push({
        name: '',
        upperLimit: undefined,
        nominal: undefined,
        lowerLimit: undefined
      })
      this.updateList()

      var el = this.$refs['table-body']
      setTimeout(() => {
        el.scrollTo(0, el.scrollHeight)
      }, 100)
    },
    updateList() {
      this.$emit('update:dataset', this.points)
    }
  },
  created() {
    this.points = this.dataset.splice(0, this.dataset.length)
  }
}
</script>
<style lang="scss">
@import '@/version2/assets/scss/variables.scss';

.points-form {
  height: 100%;
  max-width: 960px;
  margin: auto;
  text-align: center;

  .tip {
    font-size: 12px;
    color: #666;

    a {
      color: $--font-color__main;
      text-decoration: none;
    }
  }

  .import-points {
    padding-top: 24px;

    .el-button {
      width: 88px;
      height: 32px;
      font-size: 12px;
      font-weight: 400;
      background: linear-gradient(
        218deg,
        rgba(63, 227, 211, 1) 0%,
        rgba(94, 131, 242, 1) 100%
      );
      border-radius: 900px;
      border: none;
      box-shadow: 0px 3px 20px rgba(94, 131, 242, 0.3);

      img {
        margin-right: 4px;
      }
    }
  }

  .table-form {
    box-sizing: border-box;
    padding: 32px 0;
    padding-right: 48px;

    .table-row {
      display: flex;
      text-align: center;

      .table-cell {
        flex: 1;
        height: 64px;
        box-sizing: border-box;
        text-align: center;
        line-height: 64px;
        border: $--points-form-table-border;
        border-left: none;
        border-bottom: none;
        padding: 0 16px;

        &:first-child {
          border-left: $--points-form-table-border;
        }
      }
    }

    .table-header .table-cell {
      background: rgba(243, 244, 244, 1);
      font-weight: bold;
      font-size: 14px;
      color: $--font-color__normal;
    }

    .table-body__row {
      position: relative;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(243, 244, 244, 0.8);
      }

      .delete-row-btn {
        cursor: pointer;
        height: 64px;
        position: absolute;
        line-height: 64px;
        right: -31px;
      }
    }

    .table-footer {
      cursor: pointer;
      color: $--font-color__main;
      font-size: 14px;
      font-weight: bold;
      height: 64px;
      box-sizing: border-box;
      line-height: 64px;
      text-align: center;
      border: $--points-form-table-border;
    }
  }
}
</style>
