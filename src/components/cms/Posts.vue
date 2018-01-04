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
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{getRowStatus(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column prop="goodCount" label="好评"></el-table-column>
          <el-table-column prop="badCount" label="差评"></el-table-column>
          <el-table-column prop="viewCount" label="阅读"></el-table-column>
          <el-table-column prop="commentCount" label="评论"></el-table-column>
          <el-table-column prop="publishTime" width="150" label="发布时间"></el-table-column>
          <el-table-column prop="creationTime" width="150" label="创建时间"></el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
              <el-button @click="remove(scope.row.id)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
        treeData: []
      }
    },
    methods: {
      search () {
        const params = {current: this.current - 1, rowCount: this.rowCount}
        if (this.searchForm.text) {
          params.q = this.searchForm.text
        }
        this.$api.posts.getList(params).then(result => {
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
      getRowStatus (status) {
        if (status === 'draft') {
          return '草稿'
        } else if (status === 'publish') {
          return '已发布'
        }
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
              this.$refs.tree.setCheckedKeys(result.data, true)
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
