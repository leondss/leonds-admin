<template>
  <section>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="关键字">
            <el-input v-model="searchForm.text" placeholder="关键字" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="success" @click="edit()">新增</el-button>
            <el-button @click="remove" v-show="selectRows.length > 0">删除</el-button>
            <el-button @click="enable" v-show="selectRows.length > 0">启用</el-button>
            <el-button @click="disable" v-show="selectRows.length > 0">禁用</el-button>
            <el-button @click="showRoleDialog" v-show="selectRows.length > 0">设置角色</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="rows"
          stripe
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{scope.row.status === 'ON' ? '正常' : '禁用'}}
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="创建时间"></el-table-column>
        </el-table>
        <el-dialog
          title="用户编辑"
          :visible.sync="dialogVisible"
          width="40%">
          <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="editForm.password"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleIds">
              <el-checkbox-group v-model="editForm.roleIds">
                <el-checkbox v-for="item in roles" :label="item.id" name="roleIds" :key="item.id">{{item.name}}</el-checkbox>
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
                <el-checkbox v-for="item in roles" :label="item.id" name="roleIds" :key="item.id">{{item.name}}</el-checkbox>
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
  </section>
</template>

<script>
  export default {
    name: 'User',
    data () {
      return {
        searchForm: {
          text: ''
        },
        editForm: {
          id: '',
          username: '',
          password: '',
          roleIds: []
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          roleIds: [
            {type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change'}
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
        selectRows: [],
        roleDialogVisible: false,
        editRoleLoading: false
      }
    },
    methods: {
      search () {
        const params = {page: this.page - 1, size: this.size}
        if (this.searchForm.text) {
          params.text = this.searchForm.text
        }
        this.$api.users.getUserList(params).then(result => {
          this.rows = result.content
          this.total = result.totalElements
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
      handleSelectionChange (val) {
        this.selectRows = val
      },
      getSelectIds () {
        return this.selectRows.map(row => row.id)
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
              this.$alert(err)
            })
          } else {
            return false
          }
        })
      },
      remove () {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.users.remove(this.getSelectIds()).then(() => {
            this.$message.success('删除成功')
            this.handleCurrentChange(1)
          }).catch(err => {
            this.$alert(err)
          })
        }).catch(() => {})
      },
      enable () {
        this.$confirm('确定要启用吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.users.enable(this.getSelectIds()).then(() => {
            this.$message.success('启用成功')
            this.handleCurrentChange(1)
          }).catch(err => {
            this.$alert(err)
          })
        }).catch(() => {})
      },
      disable () {
        this.$confirm('确定要禁用吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.users.disable(this.getSelectIds()).then(() => {
            this.$message.success('禁用成功')
            this.handleCurrentChange(1)
          }).catch(err => {
            this.$alert(err)
          })
        }).catch(() => {})
      },
      showRoleDialog () {
        if (this.selectRows.length !== 1) {
          this.$message.info('请选择一条记录')
          return
        }
        this.roleDialogVisible = true
        const id = this.getSelectIds()[0]
        this.$nextTick(() => {
          this.$api.users.getUser(id).then(data => {
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
      this.search()
      this.$api.roles.getAll().then(data => {
        this.roles = data
      })
    }
  }
</script>

<style>
</style>
