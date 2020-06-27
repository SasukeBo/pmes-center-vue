<template>
  <div class="material-devices">
    <TopYieldDevice :id="id"></TopYieldDevice>

    <div class="devices-list">
      <el-table :data="deviceResults" style="width: 100%">
        <el-table-column label="设备">
          <template slot-scope="scope">
            {{ scope.row.device.name }}
          </template>
        </el-table-column>
        <el-table-column label="良率">
          <template slot-scope="scope">
            {{
              scope.row.ok + scope.row.ng
                ? (
                    (scope.row.ok * 100) /
                    (scope.row.ok + scope.row.ng)
                  ).toFixed(2)
                : 0
            }}%
          </template>
        </el-table-column>

        <el-table-column label="总产量">
          <template slot-scope="scope">
            {{ scope.row.ok + scope.row.ng }}
          </template>
        </el-table-column>

        <el-table-column>
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="view(scope.row.device.id)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import TopYieldDevice from '../overview/TopYieldDevice'

export default {
  name: 'MaterialDevice',
  components: { TopYieldDevice },
  props: {
    id: [Number, String]
  },
  data() {
    return {
      deviceResults: []
    }
  },
  apollo: {
    deviceResults: {
      query: gql`
        query($materialID: Int!) {
          deviceResults: analyzeDevices(materialID: $materialID) {
            device {
              id
              name
            }
            ok
            ng
          }
        }
      `,
      variables() {
        return {
          materialID: this.id
        }
      }
    }
  },
  methods: {
    view(id) {
      this.$router.push({ name: 'device-view', params: { id } })
    }
  }
}
</script>
<style lang="scss">
.material-devices {
  .devices-list {
    background: #fff;
    padding: 16px;
    border-radius: 4px;
  }
}
</style>
