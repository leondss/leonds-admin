<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true">
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
          v-loading="loading"
          style="width: 100%">
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="code" label="代码"></el-table-column>
          <el-table-column prop="value" label="值" width="500"></el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="remove(scope.row.id)" type="text">删除</el-button>
              <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="编辑"
          :visible.sync="dialogVisible"
          width="40%">
          <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
            <el-form-item label="名称" prop="name">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="代码" prop="code">
              <el-input v-model="editForm.code"></el-input>
            </el-form-item>
            <el-form-item label="值" prop="value">
              <el-input v-model="editForm.value"></el-input>
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
  </el-card>
</template>

<script>
  export default {
    name: 'Settings',
    data () {
      return {
        searchForm: {
          text: ''
        },
        editForm: {
          id: '',
          name: '',
          code: '',
          value: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入代码', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '请输入值', trigger: 'blur' }
          ]
        },
        dialogVisible: false,
        rows: [],
        page: 1,
        size: 10,
        total: 0,
        editLoading: false,
        loading: false
      }
    },
    methods: {
      search () {
        this.loading = true
        const params = { page: this.page - 1, size: this.size }
        if (this.searchForm.text) {
          params.q = this.searchForm.text
        }
        this.$api.settings.getList(params).then(result => {
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
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.editForm.resetFields()
          if (id) {
            this.$api.settings.get(id).then(data => {
              Object.assign(this.editForm, data)
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
            this.$api.settings.save(this.editForm).then(() => {
              this.editLoading = false
              this.dialogVisible = false
              this.$message.success('保存成功')
              this.search()
            }).catch(e => {
              this.editLoading = false
              this.$alert(e.message)
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
          this.$api.settings.remove([id]).then(() => {
            this.$message.success('删除成功')
            this.search()
          }).catch(e => {
            this.$alert(e.message)
          })
        }).catch(() => {})
      }
    },
    created: function () {
    },
    activated: function () {
      this.search()
    }
  }
</script>

<style>
</style>
