<template>
  <div class="home">
    <el-row>
      <el-input
        v-model="search"
        style="width: 300px;"
        placeholder="搜索料号"
      ></el-input>
    </el-row>

    <el-divider></el-divider>

    <el-row :gutter="20">
      <el-col
        :span="6"
        class="display-card"
        v-for="(material, index) in (materialWrap.materials || []).filter(m =>
          m.name.includes(search)
        )"
        :key="'material_' + index"
        ><MaterialCard
          :materialID="material.id"
          :pending.sync="material.pending"
          :fileIDs.sync="material.fileIDs"
        ></MaterialCard
      ></el-col>

      <el-col :span="6" class="display-card">
        <div class="add-material-btn">
          <el-tooltip
            effect="dark"
            content="点击添加料号"
            placement="top-start"
          >
            <i class="el-icon-plus" @click="dialogFormVisible = true"></i>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="添加料号" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form" label-position="left">
        <el-form-item label="料号名称" :label-width="formLabelWidth">
          <el-input
            @keydown.native.enter.prevent="addMaterial"
            v-model="form.materialName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="addMaterial"
          :loading="loading"
          :disable="loading"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <div class="material-pagination">
      <el-pagination
        :current-page.sync="page"
        :page-size.sync="limit"
        :page-sizes="[9, 21, 36, 60]"
        background
        layout="sizes, prev, pager, next"
        :total="materialWrap.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import MaterialCard from '@/components/MaterialCard.vue'
import gql from 'graphql-tag'

export default {
  name: 'Home',
  components: {
    MaterialCard
  },
  apollo: {
    materialWrap: {
      query: gql`
        query($page: Int!, $limit: Int!) {
          materialWrap: materials(page: $page, limit: $limit) {
            total
            materials {
              id
              name
            }
          }
        }
      `,
      variables() {
        return {
          page: this.page,
          limit: this.limit
        }
      }
    }
  },
  data() {
    return {
      search: '',
      dialogFormVisible: false,
      formLabelWidth: '100px',
      form: {
        materialName: ''
      },
      limit: 21,
      page: 1,
      materialWrap: {
        materials: [],
        total: 0
      },
      loading: false
    }
  },
  methods: {
    addMaterial() {
      this.loading = true
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($materialName: String!) {
              response: addMaterial(materialName: $materialName) {
                material {
                  id
                  name
                }
                status {
                  message
                  pending
                  fileIDs
                }
              }
            }
          `,
          variables: {
            materialName: this.form.materialName
          }
        })
        .then(({ data: { response } }) => {
          this.$message.success(response.status.message)
          if (response.status && response.status.pending) {
            var material = response.material
            material.pending = true
            material.fileIDs = response.status.fileIDs
            if (!this.materialWrap.materials) {
              this.materialWrap.materials = []
            }
            this.materialWrap.materials.push(material)
          }
          this.closeDialog()
        })
        .catch(e => {
          console.log(e)
          this.$message.error(e.message.replace('GraphQL error: ', ''))
          this.closeDialog()
        })
    },
    closeDialog() {
      this.loading = false
      this.dialogFormVisible = false
      this.form.materialName = ''
    }
  }
}
</script>
<style lang="scss">
.display-card {
  min-width: 33%;
}

.add-material-btn i.el-icon-plus {
  display: block;
  text-align: center;
  font-size: 30px;
  color: #999;
  border: 1px dashed #999;
  border-radius: 4px;
  height: 300px;
  line-height: 300px;
  cursor: pointer;
  margin: 0 16px;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:hover {
    color: #333;
    border-color: #333;
  }
}

.material-pagination {
  text-align: center;
  padding: 64px 0;
}
</style>
