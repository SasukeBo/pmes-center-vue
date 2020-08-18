<template>
  <div class="material-points">
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
        :show-file-list="false"
      >
        <el-button size="small" type="primary"
          ><img src="~@//assets/images/upload-btn-icon.png" />导入</el-button
        >
      </el-upload>
    </div>

    <div class="points-table">
      <div class="points-table-tip">
        <i class="el-icon-info"></i> 点击单元格可以修改数据
      </div>
      <el-table
        :data="tablePoints"
        height="100%"
        border
        header-row-class-name="import-record-table__header"
        row-class-name="import-record-table__row"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80px"
        ></el-table-column>

        <el-table-column label="名称" prop="name">
          <template slot-scope="scope">
            <TableCellForm
              :row="scope.row"
              :index="scope.$index"
              prop="name"
              @update="editCell"
            ></TableCellForm>
          </template>
        </el-table-column>
        <el-table-column label="USL" prop="upperLimit">
          <template slot-scope="scope">
            <TableCellForm
              :row="scope.row"
              :index="scope.$index"
              prop="upperLimit"
              @update="editCell"
            ></TableCellForm>
          </template>
        </el-table-column>
        <el-table-column label="Nominal" prop="nominal">
          <template slot-scope="scope">
            <TableCellForm
              :row="scope.row"
              :index="scope.$index"
              prop="nominal"
              @update="editCell"
            ></TableCellForm>
          </template>
        </el-table-column>
        <el-table-column label="LSL" prop="lowerLimit">
          <template slot-scope="scope">
            <TableCellForm
              :row="scope.row"
              :index="scope.$index"
              prop="lowerLimit"
              @update="editCell"
            ></TableCellForm>
          </template>
        </el-table-column>
        <el-table-column label="所在列" prop="index">
          <template slot-scope="scope">
            <TableCellForm
              :row="scope.row"
              :index="scope.$index"
              prop="index"
              @update="editCell"
            ></TableCellForm>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot="header">
            <el-button @click="addPoint()" size="small" type="primary">
              + 手动添加
            </el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="remove(scope.row, scope.$index)"
              style="color: #FB5D62"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="footer-btns">
      <FButton type="plain" size="small" @click="$router.go(-1)">返回</FButton>
      <FButton type="normal" size="small" @click="save()" :loading="saving"
        >保存</FButton
      >
    </div>
  </div>
</template>
<script>
import FButton from '@//pages/admin/components/FButton.vue'
import TableCellForm from '@//pages/admin/components/TableCellForm.vue'
import gql from 'graphql-tag'

export default {
  name: 'Points',
  components: {
    FButton,
    TableCellForm
  },
  props: {
    id: [String, Number],
    versionID: [String, Number]
  },
  apollo: {
    points: {
      query: gql`
        query($id: Int!) {
          points: listMaterialPoints(materialVersionID: $id) {
            id
            name
            index
            upperLimit
            nominal
            lowerLimit
          }
        }
      `,
      client: 'adminClient',
      variables() {
        return {
          id: this.versionID
        }
      }
    }
  },
  data() {
    return {
      saving: false,
      points: [],
      tablePoints: [],
      deleteItems: []
    }
  },
  watch: {
    points(val) {
      if (val) {
        this.tablePoints = val.map((v) => {
          delete v.__typename
          return v
        })
      }
    }
  },
  methods: {
    addPoint() {
      this.tablePoints.push({
        id: 0,
        name: '',
        upperLimit: undefined,
        nominal: undefined,
        lowerLimit: undefined
      })
    },
    editCell({ index, prop, data }) {
      this.tablePoints[index][prop] = data[prop]
    },
    remove(point, index) {
      this.deleteItems.push(point.id)
      this.tablePoints.splice(index, 1)
    },
    validate() {
      for (var i = 0; i < this.tablePoints.length; i++) {
        var point = this.tablePoints[i]
        for (const k in point) {
          if (point[k] === undefined) {
            return false
          }
        }
      }

      return true
    },
    save() {
      if (this.validate()) {
        this.saving = true
        this.$apollo
          .mutate({
            mutation: gql`
              mutation(
                $materialID: Int!
                $versionID: Int!
                $saveItems: [PointCreateInput]!
                $deleteItems: [Int!]!
              ) {
                response: savePoints(
                  materialID: $materialID
                  versionID: $versionID
                  saveItems: $saveItems
                  deleteItems: $deleteItems
                )
              }
            `,
            client: 'adminClient',
            variables: {
              materialID: this.id,
              vesionID: this.versionID,
              saveItems: this.tablePoints,
              deleteItems: this.deleteItems
            }
          })
          .then(() => {
            this.saving = false
            this.$message({ type: 'success', message: '保存成功' })
            this.deleteItems = []
            this.$apollo.queries.points
              .refetch()
              .then(({ data: { points } }) => {
                this.tablePoints = points.map((v) => {
                  delete v.__typename
                  return v
                })
              })
          })
          .catch((e) => {
            this.saving = false
            this.$message({
              type: 'error',
              message: e.message.replace('GraphQL error:', '')
            })
          })
      } else {
        this.$message({
          type: 'error',
          message: '抱歉，检测项信息必须填写完整。'
        })
      }
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
            return p
          })
          if (!this.tablePoints) {
            this.tablePoints = []
          }
          this.tablePoints = this.tablePoints.concat(points)
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: e.message.replace('GraphQL error:', '')
          })
        })
    }
  },
  created() {
    if (this.material) {
      this.$store.commit('SET_PAGE_TITLE', `${this.material.name}检测项`)
    } else {
      this.$apollo
        .query({
          query: gql`
            query($id: Int!) {
              response: material(id: $id) {
                name
              }
            }
          `,
          client: 'adminClient',
          variables: {
            id: this.id
          }
        })
        .then(({ data: { response } }) => {
          this.$store.commit('SET_PAGE_TITLE', `${response.name}检测项`)
        })
        .catch(() => {
          this.$store.commit('SET_PAGE_TITLE', '料号检测项')
        })
    }
  }
}
</script>
<style lang="scss">
@import '@//assets/scss/variables.scss';

.material-points {
  padding: 32px 32px 0 32px;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 64px;

  .points-table {
    width: 80%;
    margin: auto;
    height: calc(100% - 106px);
    padding: 24px 0;
    position: relative;
    box-sizing: border-box;

    .points-table-tip {
      font-size: 12px;
      color: #999;
      position: absolute;
      top: 0px;
    }

    .import-record-table__row td {
      text-align: center;
    }

    .import-record-table__header th {
      text-align: center;
      height: 64px;
      font-size: 14px;
      color: #666;
      font-weight: bold;
      background: #f3f4f4;

      &:first-child {
        border-left: 1px solid $--points-form-table-border;
      }
    }
  }

  .tip {
    padding-top: 32px;
    text-align: center;
    font-size: 12px;
    color: #666;

    a {
      color: $--font-color__main;
      text-decoration: none;
    }
  }

  .import-points {
    text-align: center;
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

  .footer-btns {
    text-align: center;
    position: absolute;
    width: 100%;
    left: 0;
    height: 64px;
    bottom: 0;
    line-height: 64px;
    border-top: 1px solid rgba(202, 202, 202, 1);
  }
}
</style>
