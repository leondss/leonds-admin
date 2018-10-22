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
            <router-link to="/cms/posts/edit" target="_blank">
              <el-button type="success">新增</el-button>
            </router-link>
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
          <el-table-column prop="sn" label="编号" width="50"></el-table-column>
          <el-table-column prop="name" label="标题" width="200"></el-table-column>
          <el-table-column prop="goodCount" label="好评"></el-table-column>
          <el-table-column prop="badCount" label="差评"></el-table-column>
          <el-table-column prop="commentsCount" label="评论"></el-table-column>
          <el-table-column prop="viewCount" label="浏览"></el-table-column>
          <el-table-column prop="topStatus" label="置顶"></el-table-column>
          <el-table-column prop="commentsStatus" label="评论状态"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="publishTime" label="发布时间"></el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="remove(scope.row.id)" type="text">删除</el-button>
              <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
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
    name: 'Posts',
    data () {
      return {
        searchForm: {
          text: ''
        },
        rows: [],
        page: 1,
        size: 10,
        total: 0,
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
        this.$api.posts.getList(params).then(result => {
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
        console.log(id)
      },
      remove (id) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.posts.remove([id]).then(() => {
            this.$message.success('删除成功')
            this.handleCurrentChange(1)
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
