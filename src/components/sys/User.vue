<template>
  <section class="content">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="关键字">
            <el-input v-model="searchForm.text" placeholder="关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="edit">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          ref="multipleTable"
          :data="rows"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="nickName" label="昵称"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{scope.row.status === 'on' ? '正常' : '禁用'}}
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="创建时间"></el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
              <el-button @click="remove(scope.row.id)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="[15,50,100]"
          :page-size="rowCount"
          :background="true"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
        <el-dialog
          title="用户编辑"
          :visible="dialogVisible"
          width="40%">
          <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="editForm.password"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="editForm.nickName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="save" :loading="editLoading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
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
          nickName: ''
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
        multipleSelection: [],
        rows: [],
        current: 1,
        rowCount: 15,
        total: 0,
        currentId: '',
        editLoading: false
      }
    },
    methods: {
      search () {
        this.$api.users.getUserList().then(result => {
          this.rows = result.data.rows
          this.total = result.data.total
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSizeChange (size) {
        this.rowCount = size
        this.search()
      },
      handleCurrentChange (page) {
        this.current = page
        this.search()
      },
      edit (id) {
        this.currentId = id
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.editForm.resetFields()
          if (id) {
            this.$api.users.getUser(id).then(result => {
              Object.assign(this.editForm, result.data)
            })
          } else {
            this.editForm = {}
          }
        })
      },
      save () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.editLoading = true
            this.$api.users.saveUser({
              sysUser: this.editForm,
              roleIds: []
            }).then(result => {
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

      }
    },
    created: function () {
      this.search()
    }
  }
</script>

<style>
</style>
