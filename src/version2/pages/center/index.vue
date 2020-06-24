<template>
  <div>
    <div>登录</div>
    <el-form>
      <el-form-item label="账号">
        <el-input v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          show-password
          @keyup.native.enter.prevent="login"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="login">登录</el-button>
      </el-form-item>
    </el-form>

    <el-button @click="$router.push({ name: 'console' })">后台管理</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      var req = new XMLHttpRequest()
      var _this = this
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          if (req.status >= 200 && req.status < 400) {
            var res = JSON.parse(req.responseText || '')
            if (res.errors) {
              _this.$GraphQLError(res.errors[0])
            } else {
              _this.$router.push({ name: 'console' })
            }
          } else {
            _this.$message({ type: 'error', message: req.statusText })
          }
        }
      }
      req.open('post', '/auth/login', true)
      var formData = new FormData()
      formData.append('account', this.form.account)
      formData.append('password', this.form.password)
      formData.append('remember', true)
      req.send(formData)
    }
  }
}
</script>
