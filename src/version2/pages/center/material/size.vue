<template>
  <div class="material-size">
    <TopYieldPoint :id="id" :versionID="selectedVersionID"></TopYieldPoint>

    <div class="size-tables" v-loading="$apollo.queries.pointListWrap.loading">
      <el-table
        :data="pointListWrap.list"
        style="width: 100%"
        v-if="pointListWrap"
      >
        <el-table-column label="名称">
          <template slot-scope="scope">
            {{ scope.row.point.name }}
          </template>
        </el-table-column>
        <el-table-column label="USL">
          <template slot-scope="scope">
            {{ scope.row.point.upperLimit.toFixed(3) }}
          </template>
        </el-table-column>
        <el-table-column label="Nominal">
          <template slot-scope="scope">
            {{ scope.row.point.nominal.toFixed(3) }}
          </template>
        </el-table-column>
        <el-table-column label="LSL">
          <template slot-scope="scope">
            {{ scope.row.point.lowerLimit.toFixed(3) }}
          </template>
        </el-table-column>
        <el-table-column label="良率">
          <template slot-scope="scope">
            {{ ((scope.row.ok * 100) / scope.row.total).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button size="small" @click="view(scope.row.point.id)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div style="height: 300px" v-else></div>

      <el-pagination
        v-if="pointListWrap"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[50, 100, 200, 300]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pointListWrap.total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import TopYieldPoint from './overview/TopYieldPoint'
import gql from 'graphql-tag'

export default {
  name: 'MaterialSize',
  components: { TopYieldPoint },
  props: {
    id: [Number, String]
  },
  data() {
    return {
      limit: 50,
      page: 1,
      pointListWrap: undefined
    }
  },
  computed: {
    selectedVersionID() {
      var versionID = this.$route.query.version_id
      if (versionID && !isNaN(parseInt(versionID))) {
        return versionID
      }

      return undefined
    }
  },
  apollo: {
    pointListWrap: {
      query: gql`
        query($materialID: Int!, $versionID: Int, $limit: Int!, $page: Int!) {
          pointListWrap: pointListWithYield(
            materialID: $materialID
            versionID: $versionID
            limit: $limit
            page: $page
          ) {
            total
            list {
              point {
                id
                name
                upperLimit
                lowerLimit
                nominal
              }
              ok
              total
            }
          }
        }
      `,
      variables() {
        return {
          materialID: this.id,
          versionID: this.selectedVersionID,
          limit: this.limit,
          page: this.page
        }
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val
    },
    handleCurrentChange(val) {
      this.page = val
    },
    view(id) {
      this.$router.push({ name: 'size-view', params: { id } })
    }
  }
}
</script>
<style lang="scss">
.material-size {
  .size-tables {
    background: #fff;
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 4px;

    .el-pagination {
      text-align: center;
      padding-top: 16px;
    }
  }
}
</style>
