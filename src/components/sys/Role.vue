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
            <el-button @click="edit()">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="rows"
          style="width: 100%">
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="code" label="代码"></el-table-column>
          <el-table-column prop="creationTime" label="创建时间"></el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
              <el-button @click="remove(scope.row.id)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="角色编辑"
          :visible.sync="dialogVisible"
          width="40%">
          <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
            <el-form-item label="名称" prop="name">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="代码" prop="code">
              <el-input v-model="editForm.code"></el-input>
            </el-form-item>
            <el-form-item label="权限">
              <el-tree
                :props="columns"
                :data="treeData"
                node-key="id"
                ref="tree"
                show-checkbox
                :default-checked-keys="defaultKeys"
                default-expand-all>
              </el-tree>
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
          :current-page="current"
          :page-sizes="[10,20,50,100]"
          :page-size="rowCount"
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
    name: 'Role',
    data () {
      return {
        searchForm: {
          text: ''
        },
        editForm: {
          id: '',
          name: '',
          code: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入代码', trigger: 'blur'}
          ]
        },
        dialogVisible: false,
        rows: [],
        current: 1,
        rowCount: 10,
        total: 0,
        currentId: '',
        editLoading: false,
        columns: {
          id: 'id',
          label: 'name'
        },
        treeData: [],
        defaultKeys: []
      }
    },
    methods: {
      search () {
        const params = {current: this.current - 1, rowCount: this.rowCount}
        if (this.searchForm.text) {
          params.q = this.searchForm.text
        }
        this.$api.roles.getList(params).then(result => {
          this.rows = result.data.rows
          this.total = result.data.total
        })
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
            this.$api.roles.get(id).then(result => {
              Object.assign(this.editForm, result.data)
            })
          } else {
            this.editForm = {}
          }
          this.$api.resources.getList().then(result => {
            this.treeData = result.data
          }).then(() => {
            this.$api.roles.getResource(id).then(result => {
              this.defaultKeys = result.data
            })
          })
        })
      },
      save () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.editLoading = true
            const resourceIds = this.$refs.tree.getCheckedKeys()
            this.$api.roles.save({
              role: this.editForm,
              resourceIds: resourceIds
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
        this.$confirm('确认删除吗？')
          .then(() => {
            this.$api.roles.remove([id]).then(result => {
              if (result.data && result.data.status === 0) {
                this.$message.success('删除成功')
                this.handleCurrentChange(1)
              } else {
                this.$alert(result.data.message)
              }
            })
          })
      }
    },
    created: function () {
      this.search()
    }
  }
</script>

<style>
</style>
