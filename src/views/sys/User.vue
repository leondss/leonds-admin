<template>
  <section class="content">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="关键字">
            <el-input v-model="searchForm.text" placeholder="关键字" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="success" @click="edit">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="rows"
          style="width: 100%">
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{scope.row.status === 'ON' ? '正常' : '禁用'}}
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="创建时间"></el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
              <el-button @click="remove(scope.row.id)" type="text" size="small">删除</el-button>
              <el-button @click="enable(scope.row.id)" type="text" size="small">启用</el-button>
              <el-button @click="disable(scope.row.id)" type="text" size="small">禁用</el-button>
            </template>
          </el-table-column>
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
            <el-form-item label="角色">
              <el-checkbox-group v-model="roleIds">
                <el-checkbox v-for="item in roles" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="save" :loading="editLoading">保存</el-button>
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
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
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
        roleIds: []
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
      edit (id) {
        this.currentId = id
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.editForm.resetFields()
          if (id) {
            this.$api.users.getUser(id).then(result => {
              Object.assign(this.editForm, result.data.sysUser)
              this.roleIds = result.data.roleIds
            })
          } else {
            this.editForm = {}
            this.roleIds = []
          }
        })
      },
      save () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.editLoading = true
            const params = {
              sysUser: this.editForm,
              roleIds: this.roleIds
            }
            this.$api.users.saveUser(params).then(result => {
              this.editLoading = false
              this.dialogVisible = false
              if (result.data && result.data.status === 0) {
                this.$message.success('保存成功')
                this.handleCurrentChange(1)
              } else {
                this.$alert(result.data.message)
              }
            })
          } else {
            return false
          }
        })
      },
      remove (id) {
        this.$confirm('确定要删除此用户吗？', '提示', {
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
      }
    },
    created: function () {
      this.search()
      this.$api.roles.getAll().then(result => {
        this.roles = result.data
      })
    }
  }
</script>

<style>
</style>
