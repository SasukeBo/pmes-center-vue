<template>
  <el-dialog :visible="visible" width="320px" custom-class="login-dialog">
    <div class="header">
      <div class="bottom">
        <div class="triangle-left"></div>
        <div class="triangle-right"></div>
      </div>
    </div>
    <div class="login-form">
      <el-form size="small" :rules="rules" ref="login" :model="form">
        <el-form-item class="is-active" prop="account">
          <el-input
            placeholder="请输入账号"
            v-model="form.account"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="form.password"
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="submit-btn">
      <el-button size="small" type="primary" @click="login">登录</el-button>
    </div>

    <div class="cancel-btn">
      <img
        class="btn-icon"
        src="~@/assets/pi-quxiao@2x.png"
        @click="closeDialog"
      />
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import gql from 'graphql-tag'
export default {
  data() {
    return {
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      form: {
        account: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapState({
      visible: (state) => state.loginDialogVisible
    })
  },
  methods: {
    login() {
      this.$refs.login.validate((valid) => {
        if (valid) {
          this.$apollo
            .mutate({
              mutation: gql`
                mutation($input: LoginInput!) {
                  login(loginInput: $input) {
                    id
                    account
                    admin
                  }
                }
              `,
              variables: {
                input: {
                  account: this.form.account,
                  password: this.form.password
                }
              }
            })
            .then(({ data: { login } }) => {
              this.$store.commit('LOGIN', login)
              this.closeDialog()
              this.$message({
                type: 'success',
                message: '登录成功'
              })
            })
            .catch(() => {
              this.closeDialog()
              this.$message({
                type: 'error',
                message: '登录失败'
              })
            })
        }
      })
    },
    closeDialog() {
      this.$store.commit('SET_LOGIN_DIALOG_VISIBLE', false)
    }
  }
}
</script>

<style lang="scss">
.theme_1-app .login-dialog {
  background: transparent !important;
  position: relative;

  .cancel-btn {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -56px;

    .btn-icon {
      display: block;
      margin: auto;
      width: 24px;
      cursor: pointer;
      margin-top: 32px;
    }
  }

  .submit-btn {
    margin-top: 26px;
    padding: 0 28px;

    .el-button {
      width: 100%;
      background: #5e83f2;
      box-shadow: 0px 3px 6px rgba(94, 131, 242, 0.5);
    }
  }

  .el-form .el-form-item {
    padding: 14px 26px 14px 30px;
    margin: 0;
    position: relative;

    &.is-active {
      background: #ececef;

      &:before {
        content: '';
        position: absolute;
        height: 100%;
        width: 8px;
        top: 0;
        left: 0;
        background: #5e83f2;
      }
    }

    .el-input__inner {
      border: 1px solid rgba(236, 236, 239, 1);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    }
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
    background: #fff;
    border-radius: 5px;
    padding-bottom: 56px;

    .header {
      height: 80px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background: linear-gradient(
        180deg,
        rgba(94, 131, 242, 1) 0%,
        rgba(63, 227, 211, 0.84) 100%
      );
      position: relative;
      margin-bottom: 20px;

      .bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: transparent;
        display: flex;

        .triangle-left {
          flex: 1;
          width: 0;
          height: 0;
          border-bottom: 23px solid #fff;
          border-right: 160px solid transparent;
        }

        .triangle-right {
          flex: 1;
          width: 0;
          height: 0;
          border-bottom: 23px solid #fff;
          border-left: 160px solid transparent;
        }
      }
    }
  }
}
</style>
