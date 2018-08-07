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
          <el-table-column prop="content" label="公告内容" width="500"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{ getRowStatus(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="创建时间" width="140"></el-table-column>
          <el-table-column prop="publishTime" label="发布时间" width="140"></el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button @click="remove(scope.row.id)" type="text">删除</el-button>
              <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
              <el-button @click="publishMessage(scope.row.id)" type="text">发布</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="公告编辑"
          :visible.sync="dialogVisible"
          width="70%">
          <el-form :model="editForm" ref="editForm" label-width="80px" v-loading="editLoading">
            <el-form-item label="公告内容">
              <el-input type="textarea" v-model="editForm.wklMessage.content" rows="6"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="images">
              <el-upload
                action="/wkl/api/upload"
                list-type="picture-card"
                :headers="getHeaders()"
                :on-preview="handlePictureCardPreview"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :file-list="imgList">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="imgDialogVisible" append-to-body>
                <img width="100%" :src="imgDialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item label="附件">
              <el-upload
                action="/wkl/api/upload"
                :headers="getHeaders()"
                :on-success="handleFileSuccess"
                :on-remove="handleFileRemove"
                :file-list="fileList">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="save" v-show="this.editForm.status !== 2">暂存
              </el-button>
              <el-button type="success" @click="publish" v-show="this.editForm.status !== 2">发布
                <i class="el-icon-upload el-icon--right"></i>
              </el-button>
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
  import { getToken } from '../../commons/token'

  export default {
    name: 'Role',
    data () {
      return {
        searchForm: {
          text: ''
        },
        editForm: {
          wklMessage: {
            id: '',
            content: '',
            status: 1
          },
          images: [],
          files: []
        },
        dialogVisible: false,
        rows: [],
        page: 1,
        size: 10,
        total: 0,
        editLoading: false,
        loading: false,
        imgDialogImageUrl: '',
        imgDialogVisible: false
      }
    },
    computed: {
      imgList () {
        return this.editForm.images.map(i => {
          return {
            name: i.alias,
            url: '/wkl' + i.path
          }
        })
      },
      fileList () {
        return this.editForm.files.map(i => {
          return {
            name: i.alias,
            url: '/wkl' + i.path
          }
        })
      }
    },
    methods: {
      search () {
        this.loading = true
        const params = { page: this.page - 1, size: this.size }
        if (this.searchForm.text) {
          params.text = this.searchForm.text
        }
        this.$api.msgs.getPage(params).then(result => {
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
            this.$api.msgs.get(id).then(data => {
              Object.assign(this.editForm, data)
            })
          } else {
            this.editForm = {
              wklMessage: {
                id: '',
                content: '',
                status: 1
              },
              images: [],
              files: []
            }
          }
        })
      },
      doSave () {
        if (!this.editForm.wklMessage.content) {
          this.$message.error('请输入公告内容')
          return
        }
        this.editLoading = true
        this.$api.msgs.save(this.editForm).then(() => {
          this.editLoading = false
          this.dialogVisible = false
          this.$message.success('保存成功')
          this.handleCurrentChange(1)
        }).catch(e => {
          this.editLoading = false
          this.$alert(e.message)
        })
      },
      save () {
        this.editForm.wklMessage.status = 1
        this.doSave()
      },
      publish () {
        this.editForm.wklMessage.status = 2
        this.doSave()
      },
      remove (id) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.msgs.remove([id]).then(() => {
            this.$message.success('删除成功')
            this.handleCurrentChange(1)
          }).catch(e => {
            this.$alert(e.message)
          })
        }).catch(() => {})
      },
      getRowStatus (status) {
        if (status === 1) {
          return '新增'
        } else if (status === 2) {
          return '已发布'
        }
      },
      publishMessage (id) {
        this.$api.msgs.publish([id]).then(() => {
          this.$message.success('发布成功')
          this.handleCurrentChange(1)
        }).catch(e => {
          this.$alert(e.message)
        })
      },
      handleRemove (file, fileList) {
        this.$api.uploads.remove(file.name).then(() => {
          this.$message.success('删除成功')
          this.editForm.images.splice(this.editForm.images.findIndex(item => item.path === file.name), 1)
        }).catch(e => {
          this.$alert(e.message)
        })
      },
      handleSuccess (response, file, fileList) {
        if (response.status === 0) {
          this.editForm.images.push(response.data)
        }
      },
      handlePictureCardPreview (file) {
        console.log(file)
        this.imgDialogImageUrl = file.url
        this.imgDialogVisible = true
      },
      getHeaders () {
        return {
          'Wkl-Auth-Token': getToken()
        }
      },
      handleFileRemove (file, fileList) {
        console.log(file)
        this.$api.uploads.remove(file.name).then(() => {
          this.$message.success('删除成功')
          this.editForm.files.splice(this.editForm.files.findIndex(item => item.path === file.name), 1)
        }).catch(e => {
          this.$alert(e.message)
        })
      },
      handleFileSuccess (response, file, fileList) {
        console.log(response)
        if (response.status === 0) {
          this.editForm.files.push(response.data)
        }
      }
    },
    created: function () {
      this.search()
    }
  }
</script>

<style>
</style>
