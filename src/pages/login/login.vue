<template>
  <div class="login-page">
    <img class="bg-image" src="~@/pages/login/assets/background.png" />
    <div class="login-form">
      <div class="header">
        <img src="~@/assets/images/fortunta-logo.png" />
      </div>

      <el-form :rules="rules" ref="login" :model="form">
        <el-form-item
          :class="[isActive === 'account' ? 'is-active' : '']"
          prop="account"
        >
          <el-input
            @focus="active('account')"
            placeholder="请输入账号"
            v-model="form.account"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="password"
          :class="[isActive === 'password' ? 'is-active' : '']"
        >
          <el-input
            @focus="active('password')"
            placeholder="请输入密码"
            v-model="form.password"
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      form: {
        account: '',
        password: ''
      },
      isActive: ''
    }
  },
  methods: {
    active(val) {
      this.isActive = val
    }
  }
}
</script>
<style lang="scss">
.login-page {
  height: 100%;
  display: flex;
  align-items: center;

  .bg-image {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .login-form {
    flex: 1;
    margin-left: auto;
    max-width: 438px;
    margin-right: 240px;
    height: 511px;
    background: #fff;
    border-radius: 4px;

    .header {
      height: 109px;
      text-align: center;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 4px 4px 0px 0px;
      display: flex;
      align-items: center;

      img {
        height: 89px;
        margin: auto;
      }
    }

    .el-form {
      margin-top: 44px;

      .el-form-item {
        height: 94px;
        display: flex;
        align-items: center;
        margin: 0;
        border-left: 13px solid #fff;

        &.is-active {
          background: rgba(236, 236, 239, 1);
          border-left: 13px solid #5e83f2;
        }

        .el-form-item__content {
          width: 350px;
          margin-left: 31px;

          .el-input__inner {
            height: 50px;
            border: 1px solid rgba(236, 236, 239, 1);
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          }
        }
      }
    }
  }
}
</style>
