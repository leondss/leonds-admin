<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true">
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
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
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
          title="标签编辑"
          :visible.sync="dialogVisible"
          width="40%">
          <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
            <el-form-item label="名称" prop="name">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="save" :loading="editLoading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  export default {
    name: 'Tag',
    data () {
      return {
        searchForm: {
          text: ''
        },
        editForm: {
          id: '',
          name: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        dialogVisible: false,
        rows: [],
        editLoading: false,
        loading: false
      }
    },
    methods: {
      search () {
        this.loading = true
        this.$api.tags.getList().then(result => {
          this.rows = result
          this.loading = false
        })
      },
      edit (id) {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.editForm.resetFields()
          if (id) {
            this.$api.tags.get(id).then(data => {
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
            this.$api.tags.save(this.editForm).then(() => {
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
          this.$api.tags.remove([id]).then(() => {
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
