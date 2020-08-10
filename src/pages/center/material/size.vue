<template>
  <div class="material-size">
    <TopYieldPoint :id="id" :versionID="selectedVersionID"></TopYieldPoint>

    <div class="size-tables" v-loading="$apollo.queries.pointListWrap.loading">
      <el-input
        style="width: 300px"
        placeholder="请输入内容"
        v-model="searchInput"
        class="input-with-select"
        @keyup.enter.native.prevent="search = searchInput"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search = searchInput"
        ></el-button>
      </el-input>

      <el-table
        :data="pointListWrap.list"
        style="width: 100%"
        v-if="pointListWrap"
      >
        <el-table-column label="名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="USL">
          <template slot-scope="scope">
            {{ scope.row.upperLimit.toFixed(3) }}
          </template>
        </el-table-column>
        <el-table-column label="Nominal">
          <template slot-scope="scope">
            {{ scope.row.nominal.toFixed(3) }}
          </template>
        </el-table-column>
        <el-table-column label="LSL">
          <template slot-scope="scope">
            {{ scope.row.lowerLimit.toFixed(3) }}
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button size="small" @click="view(scope.row.id)">查看</el-button>
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
      search: '',
      searchInput: '',
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
  watch: {
    searchInput(val) {
      if (!val) {
        this.search = ''
      }
    }
  },
  apollo: {
    pointListWrap: {
      query: gql`
        query(
          $materialID: Int!
          $versionID: Int
          $search: String
          $limit: Int!
          $page: Int!
        ) {
          pointListWrap: pointList(
            materialID: $materialID
            versionID: $versionID
            search: $search
            limit: $limit
            page: $page
          ) {
            total
            list {
              id
              name
              upperLimit
              lowerLimit
              nominal
            }
          }
        }
      `,
      variables() {
        return {
          materialID: this.id,
          versionID: this.selectedVersionID,
          search: this.search,
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
