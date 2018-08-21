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
          v-loading="loading"
          style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="角色名称"></el-table-column>
          <el-table-column prop="description" label="角色描述"></el-table-column>
          <el-table-column prop="creationTime" label="创建时间"></el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="remove(scope.row.id)" type="text">删除</el-button>
              <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
              <el-button @click="openPerm(scope.row.id)" type="text">设置权限</el-button>
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
            <el-form-item label="描述">
              <el-input v-model="editForm.description"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="save" :loading="editLoading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
          title="设置权限"
          :visible.sync="dialogVisiblePerm"
          width="50%">
          <el-tabs v-model="activeName">
            <el-tab-pane label="菜单配置" name="tabMenu">
              <el-tree
                :props="columns"
                node-key="id"
                ref="tree"
                :load="load"
                lazy
                :show-checkbox="true"
                :default-expand-all="true"
                :expand-on-click-node="true"
                :check-strictly="true"
                highlight-current>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisiblePerm = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleResource">确 定</el-button>
          </span>
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
    name: 'Role',
    data () {
      return {
        searchForm: {
          text: ''
        },
        editForm: {
          id: '',
          name: '',
          description: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ]
        },
        dialogVisible: false,
        dialogVisiblePerm: false,
        rows: [],
        page: 1,
        size: 10,
        total: 0,
        editLoading: false,
        columns: {
          id: 'id',
          label: 'name'
        },
        treeData: [],
        loading: false,
        activeName: 'tabMenu',
        currentRoleId: ''
      }
    },
    methods: {
      search () {
        this.loading = true
        const params = { page: this.page - 1, size: this.size }
        if (this.searchForm.text) {
          params.text = this.searchForm.text
        }
        this.$api.roles.getList(params).then(result => {
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
            this.$api.roles.get(id).then(data => {
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
            this.$api.roles.save(this.editForm).then(() => {
              this.editLoading = false
              this.dialogVisible = false
              this.$message.success('保存成功')
              this.handleCurrentChange(1)
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
          this.$api.roles.remove([id]).then(() => {
            this.$message.success('删除成功')
            this.handleCurrentChange(1)
          }).catch(e => {
            this.$alert(e.message)
          })
        }).catch(() => {})
      },
      openPerm (id) {
        this.currentRoleId = id
        this.dialogVisiblePerm = true
        this.$nextTick(() => {
          this.$api.roles.getResource(id).then(result => {
            this.$refs.tree.setCheckedKeys(result)
          })
        })
      },
      load (node, resolve) {
        let pid = ''
        if (node.data) {
          pid = node.data.id
        }
        this.$api.resources.getTreeByPid(pid).then(data => {
          resolve(data)
        })
      },
      saveRoleResource () {
        const resourceIds = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
        if (resourceIds.length === 0) {
          this.$message.error('请配置菜单')
          return
        }
        this.$api.roles.saveResource({
          id: this.currentRoleId,
          resourceIds: resourceIds
        }).then(() => {
          this.dialogVisiblePerm = false
          this.$message.success('保存成功')
        }).catch(e => {
          this.$alert(e.message)
        })
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
