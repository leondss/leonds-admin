<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
          <el-form-item label="旧密码" prop="username">
            <el-input type="password" v-model="editForm.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input type="password" v-model="editForm.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="realName">
            <el-input type="password" v-model="editForm.confirmPassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save" :loading="editLoading">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  export default {
    name: 'ModifyPassword',
    data () {
      return {
        editForm: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        rules: {
          oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请输入确认密码', trigger: 'blur' }
          ]
        },
        editLoading: false
      }
    },
    methods: {
      save () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.editLoading = true
            this.$api.users.modifyPassword(this.editForm).then(() => {
              this.editLoading = false
              this.$message.success('修改成功')
            }).catch(err => {
              this.editLoading = false
              this.$alert(err.message)
            })
          } else {
            return false
          }
        })
      }
    },
    created: function () {
    }
  }
</script>

<style scoped>

</style>
