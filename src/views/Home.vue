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

    <el-row :gutter="20" class="overflow-y-scroll">
      <el-col
        :span="6"
        class="display-card"
        v-for="(material, index) in (materialWrap.materials || []).filter((m) =>
          m.name.includes(search)
        )"
        :key="'material_' + index"
      >
        <MaterialCard
          :materialID="material.id"
          :pending.sync="material.pending"
          :fileIDs.sync="material.fileIDs"
        ></MaterialCard>
      </el-col>
      <el-col
        :span="24"
        v-if="!materialWrap.materials || materialWrap.materials.length === 0"
      >
        <div class="empty-materials">暂无数据</div>
      </el-col>
    </el-row>

    <el-dialog title="添加料号" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form" label-position="left" :rules="rules" ref="form">
        <el-form-item
          label="厂内料号"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            @keydown.native.enter.prevent="addMaterial"
            v-model="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户料号" :label-width="formLabelWidth">
          <el-input
            @keydown.native.enter.prevent="addMaterial"
            v-model="form.customerCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="专案描述" :label-width="formLabelWidth">
          <el-input
            @keydown.native.enter.prevent="addMaterial"
            v-model="form.projectRemark"
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
      ></el-pagination>

      <el-button
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="dialogFormVisible = true"
        >新增料号</el-button
      >
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
              customerCode
              projectRemark
            }
          }
        }
      `,
      variables() {
        return {
          page: this.page,
          limit: this.limit
        }
      },
      fetchPolicy: 'network-only'
    }
  },
  data() {
    return {
      search: '',
      dialogFormVisible: false,
      formLabelWidth: '100px',
      rules: {
        name: [{ required: true, message: '厂内料号必须填写', trigger: 'blur' }]
      },
      form: {
        name: '',
        customerCode: '',
        projectRemark: ''
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

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$apollo
            .mutate({
              mutation: gql`
                mutation($input: MaterialCreateInput!) {
                  response: addMaterial(input: $input) {
                    material {
                      id
                      name
                      customerCode
                      projectRemark
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
                input: this.form
              }
            })
            .then(({ data: { response } }) => {
              this.$message.success(response.status.message)
              if (response.status) {
                var material = response.material
                material.pending = response.status.pending
                material.fileIDs = response.status.fileIDs
                if (!this.materialWrap.materials) {
                  this.materialWrap.materials = []
                }
                this.materialWrap.materials.unshift(material)
              }
              this.closeDialog()
            })
            .catch((e) => {
              console.log(e)
              this.$message.error(e.message.replace('GraphQL error: ', ''))
              this.closeDialog()
            })
        } else {
          this.loading = false
        }
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
.home {
  .display-card {
    min-width: 33%;
  }

  .material-pagination {
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    box-sizing: border-box;
    background: #fff;
    padding: 8px 32px;
    display: flex;

    .el-pagination {
      flex: 1;
    }
  }

  .overflow-y-scroll {
    height: calc(100% - 137px);
    overflow-y: scroll;
    box-sizing: border-box;
  }

  .empty-materials {
    text-align: center;
    font-size: 20px;
    color: #999;
    padding: 16px 0;
  }
}
</style>
