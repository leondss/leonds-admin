<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="关键字">
            <el-input v-model="searchForm.text" placeholder="请输入关键字" clearable></el-input>
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
          stripe
          style="width: 100%">
          <el-table-column prop="name" label="门店名称"></el-table-column>
          <el-table-column prop="code" label="门店简码"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="creationTime" label="创建时间"></el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="remove(scope.row.id)" type="text">删除</el-button>
              <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="门店编辑"
          :visible.sync="dialogVisible"
          width="40%">
          <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
            <el-form-item label="门店名称" prop="name">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="门店简码" prop="code">
              <el-input v-model="editForm.code" :disabled="editForm.id.length!==0" placeholder="只能输入英文字母"></el-input>
            </el-form-item>
            <el-form-item label="门店地址" prop="address">
              <el-input v-model="editForm.address"></el-input>
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
    name: 'Store',
    data () {
      let checkCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入门店简码'))
        }
        if (!/^[A-Za-z]+$/.test(value)) {
          callback(new Error('只能输入英文字母'))
        } else {
          callback()
        }
      }

      return {
        searchForm: {
          text: ''
        },
        editForm: {
          id: '',
          name: '',
          code: '',
          address: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入门店名称', trigger: 'blur' }
          ],
          code: [
            { required: true, validator: checkCode, trigger: 'blur' }
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
    watch: {
      'editForm.code' (newVal) {
        this.editForm.code = newVal.toUpperCase()
      }
    },
    methods: {
      search () {
        this.loading = true
        const params = { page: this.page - 1, size: this.size }
        if (this.searchForm.text) {
          params.text = this.searchForm.text
        }
        this.$api.stores.getPage(params).then(result => {
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
            this.$api.stores.getOne(id).then(data => {
              Object.assign(this.editForm, data)
            })
          } else {
            this.editForm = {
              id: '',
              name: '',
              code: '',
              address: ''
            }
          }
        })
      },
      save () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.editLoading = true
            this.$api.stores.save(this.editForm).then(() => {
              this.editLoading = false
              this.dialogVisible = false
              this.$message.success('保存成功')
              this.handleCurrentChange(1)
            }).catch(err => {
              this.editLoading = false
              this.$alert(err.message)
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
          this.$api.stores.remove([id]).then(() => {
            this.$message.success('删除成功')
            this.handleCurrentChange(1)
          }).catch(err => {
            this.$alert(err)
          })
        }).catch(() => {})
      }
    },
    created: function () {
      this.search()
    }
  }
</script>

<style>
</style>
