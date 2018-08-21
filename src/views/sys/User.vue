<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="关键字">
            <el-input v-model="searchForm.text" placeholder="关键字" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="success" @click="edit()">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="rows"
          stripe
          v-loading="loading"
          style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="realName" label="姓名"></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{scope.row.status === 1 ? '正常' : '禁用'}}
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="创建时间"></el-table-column>
          <el-table-column
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="remove(scope.row.id)">删除</el-dropdown-item>
                  <el-dropdown-item @click.native="edit(scope.row.id)">编辑</el-dropdown-item>
                  <el-dropdown-item @click.native="enable(scope.row.id)">启用</el-dropdown-item>
                  <el-dropdown-item @click.native="disable(scope.row.id)">禁用</el-dropdown-item>
                  <el-dropdown-item @click.native="showRoleDialog(scope.row.id)">设置角色</el-dropdown-item>
                  <el-dropdown-item @click.native="resetPassword(scope.row.id)">重置密码</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="用户编辑"
          :visible.sync="dialogVisible"
          width="40%">
          <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username" :disabled="!!currentId"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" v-if="!currentId">
              <el-input v-model="editForm.password"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="editForm.realName"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="所属门店" prop="store">
              <el-select v-model="editForm.storeId" placeholder="请选择">
                <el-option
                  v-for="item in stores"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="roleIds">
              <el-checkbox-group v-model="editForm.roleIds">
                <el-checkbox v-for="item in roles" :label="item.id" name="roleIds" :key="item.id">{{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="save" :loading="editLoading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
          title="设置角色"
          :visible.sync="roleDialogVisible"
          width="40%">
          <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
            <el-form-item label="用户名">
              {{editForm.username}}
            </el-form-item>

            <el-form-item label="角色" prop="roleIds">
              <el-checkbox-group v-model="editForm.roleIds">
                <el-checkbox v-for="item in roles" :label="item.id" name="roleIds" :key="item.id">{{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button @click="roleDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveUserRole" :loading="editRoleLoading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,50,100]"
          :page-size="size"
          :background="true"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  export default {
    name: 'User',
    data () {
      const checkPwd = (rule, value, callback) => {
        if (!value && !this.currentId) {
          return callback(new Error('密码不能为空'))
        }
        callback()
      }
      return {
        searchForm: {
          text: ''
        },
        editForm: {
          id: '',
          username: '',
          password: '',
          realName: '',
          mobile: '',
          storeId: '',
          roleIds: []
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, validator: checkPwd, trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          storeId: [
            { required: true, message: '请选择所属门店', trigger: 'blur' }
          ],
          roleIds: [
            { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
          ]
        },
        dialogVisible: false,
        rows: [],
        page: 1,
        size: 10,
        total: 0,
        currentId: '',
        editLoading: false,
        roles: [],
        roleDialogVisible: false,
        editRoleLoading: false,
        stores: [],
        loading: false
      }
    },
    methods: {
      search () {
        this.loading = true
        const params = { page: this.page - 1, size: this.size }
        if (this.searchForm.text) {
          params.text = this.searchForm.text
        }
        this.$api.users.getUserList(params).then(result => {
          this.rows = result.rows
          this.total = result.total
          this.loading = false
        })
      },
      handleSizeChange (size) {
        this.size = size
        this.search()
      },
      handleCurrentChange (page) {
        this.page = page
        this.search()
      },
      edit (id) {
        this.currentId = id
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.editForm.resetFields()
          if (id) {
            this.$api.users.getUser(id).then(data => {
              Object.assign(this.editForm, data)
            })
          } else {
            this.editForm = {
              id: '',
              username: '',
              password: '',
              roleIds: []
            }
          }
        })
      },
      save () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.editLoading = true
            this.$api.users.saveUser(this.editForm).then(() => {
              this.editLoading = false
              this.dialogVisible = false
              this.$message.success('保存成功')
              this.handleCurrentChange(1)
            }).catch(err => {
              this.editLoading = false
              this.$alert(err)
            })
          } else {
            return false
          }
        })
      },
      remove (id) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.users.remove([id]).then(() => {
            this.$message.success('删除成功')
            this.handleCurrentChange(1)
          }).catch(err => {
            this.$alert(err)
          })
        }).catch(() => {})
      },
      resetPassword (id) {
        this.$confirm('确定要重置用户密码吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.users.resetPassword(id).then(() => {
            this.$alert('密码重置成功，初始密码为123456')
          }).catch(err => {
            this.$alert(err)
          })
        }).catch(() => {})
      },
      enable (id) {
        this.$confirm('确定要启用吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.users.enable([id]).then(() => {
            this.$message.success('启用成功')
            this.handleCurrentChange(1)
          }).catch(err => {
            this.$alert(err)
          })
        }).catch(() => {})
      },
      disable (id) {
        this.$confirm('确定要禁用吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.users.disable([id]).then(() => {
            this.$message.success('禁用成功')
            this.handleCurrentChange(1)
          }).catch(err => {
            this.$alert(err)
          })
        }).catch(() => {})
      },
      showRoleDialog (userId) {
        this.roleDialogVisible = true
        this.$nextTick(() => {
          this.$api.users.getUser(userId).then(data => {
            Object.assign(this.editForm, data)
          })
        })
      },
      saveUserRole () {
        if (this.editForm.roleIds.length === 0) {
          this.$message.info('请选择角色')
          return
        }
        this.$api.users.saveUserRole(this.editForm).then(() => {
          this.editRoleLoading = false
          this.roleDialogVisible = false
          this.$message.success('保存成功')
          this.handleCurrentChange(1)
        }).catch(err => {
          this.$alert(err)
        })
      }
    },
    created: function () {

    },
    activated: function () {
      this.search()
      this.$api.roles.getAll().then(data => {
        this.roles = data
      })

      this.$api.stores.getAll().then(data => {
        this.stores = data
      })
    }
  }
</script>

<style scoped>

</style>
