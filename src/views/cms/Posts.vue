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
          <el-table-column prop="title" label="标题" width="300"></el-table-column>
          <el-table-column prop="goodCount" label="好评" width="50"></el-table-column>
          <el-table-column prop="badCount" label="差评" width="50"></el-table-column>
          <el-table-column prop="commentsCount" label="评论" width="50"></el-table-column>
          <el-table-column prop="viewCount" label="浏览" width="50"></el-table-column>
          <el-table-column prop="topStatus" label="置顶" width="50">
            <template slot-scope="scope">
              {{scope.row.topStatus === 1 ? '是' : '否'}}
            </template>
          </el-table-column>
          <el-table-column prop="commentsStatus" label="评论状态" width="80">
            <template slot-scope="scope">
              {{scope.row.commentsStatus === 1 ? '开启' : '关闭'}}
            </template>
          </el-table-column>
          <el-table-column prop="channel" label="渠道" width="50"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{scope.row.status === 1 ? '草稿' : '已发布'}}
            </template>
          </el-table-column>
          <el-table-column prop="publishTime" label="发布时间" width="140"></el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="remove(scope.row.id)" v-if="scope.row.status === 1">删除
                  </el-dropdown-item>
                  <router-link :to="{ name: 'PostsEdit', query: { id: scope.row.id }}">
                    <el-dropdown-item>编辑</el-dropdown-item>
                  </router-link>
                  <el-dropdown-item @click.native="publish(scope.row.id)" v-if="scope.row.status === 1">发布
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="out(scope.row.id)" v-if="scope.row.status === 2">下架
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
      },
      publish (id) {
        this.$confirm('确定要发布吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.posts.publish([id]).then(() => {
            this.$message.success('发布成功成功')
            this.handleCurrentChange(1)
          }).catch(e => {
            this.$alert(e.message)
          })
        }).catch(() => {})
      },
      out (id) {
        this.$confirm('确定要下架吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.posts.out([id]).then(() => {
            this.$message.success('下架成功')
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
