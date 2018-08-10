<template>
  <div>
    <div class="login-wrapper">
      <div class="login-box">
        <div class="login-logo">
          <b>Leonds Admin</b>
        </div>
        <div class="login-box-body">
          <el-form :model="loginForm" :rules="rules" ref="loginForm">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="用户名" clearable
                        @keyup.enter.native="submitForm('loginForm')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="loginForm.password" placeholder="密码" clearable
                        @keyup.enter.native="submitForm('loginForm')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-button"
                         @click="submitForm('loginForm')"
                         :loading="editLoading">登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <vue-particles color="#ccc">
    </vue-particles>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        editLoading: false
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          }
          this.editLoading = true
          this.$store.dispatch('login', this.loginForm).then(() => {
            this.editLoading = false
            this.$router.push('/')
          }).catch((err) => {
            this.editLoading = false
            this.$alert(err.message)
          })
        })
      }
    },
    beforeCreate: function () {
      // window.$('body').addClass('login-page')
    },
    beforeDestroy: function () {
      window.$('body').removeClass('login-page')
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login-button {
    width: 100%;
  }

  .login-wrapper {
    position: absolute;
    text-align: center;
    width: 100%;
  }
</style>
