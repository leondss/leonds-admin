<template>
  <div class="post-edit" v-loading="loading">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="分类" prop="category">
            <el-select v-model="editForm.category" clearable multiple collapse-tags style="width: 130px;">
              <el-option v-for="item in categories" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="editForm.tag" clearable multiple collapse-tags style="width: 130px;">
              <el-option v-for="item in tags" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="editForm.posts.commentsStatus" :true-label="1" :false-label="2">允许评论</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="editForm.posts.topStatus" :true-label="1" :false-label="2">置顶</el-checkbox>
          </el-form-item>
          <el-form-item label="渠道">
            <el-select v-model="channel" clearable multiple
                       style="width: 150px;">
              <el-option label="PC" value="PC" key="PC"></el-option>
              <el-option label="小程序" value="XCX" key="XCX"></el-option>
            </el-select>
          </el-form-item>
          <el-button class="pull-right" type="primary" style="margin-left: 10px" @click="publish">发布</el-button>
          <el-button class="pull-right" @click="save">保存草稿</el-button>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <h4>文件列表</h4>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button type="success" @click="save">CLONE</el-button>
        <el-tree
          :props="columns"
          node-key="id"
          ref="tree"
          @node-click="onNodeClick"
          :load="loadPosts"
          lazy
          :default-expand-all="true"
          :expand-on-click-node="false"
          highlight-current>
        </el-tree>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { COMMENTS_STATUS, POSTS_STATUS, TOP_STATUS } from '../../commons/contants'

  export default {
    name: 'PostsUpload',
    data () {
      return {
        editForm: {
          posts: {
            id: '',
            title: '',
            contentMd: '',
            contentHtml: '',
            commentsStatus: COMMENTS_STATUS.OPEN,
            topStatus: TOP_STATUS.N,
            status: POSTS_STATUS.DRAFT,
            channel: ''
          },
          category: [],
          tag: []
        },
        rules: {
          'posts.title': [
            { required: true, message: '请输入文章标题', trigger: 'blur' }
          ],
          category: [
            { type: 'array', required: true, message: '请选择分类', trigger: 'change' }
          ]
        },
        categories: [],
        tags: [],
        loading: false,
        channel: ['PC'],
        columns: {
          label: 'name',
          id: 'path'
        }
      }
    },
    methods: {
      publish () {
        this.editForm.posts.status = POSTS_STATUS.PUBLISH
        this.doSave()
      },
      save () {
        this.editForm.posts.status = POSTS_STATUS.DRAFT
        this.doSave()
      },
      doSave () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.editForm.posts.channel = this.channel.join(',')
            console.log(this.editForm)
            this.$api.posts.save(this.editForm).then((result) => {
              this.loading = false
              this.$message.success('保存成功')
              this.$router.push({ name: 'PostsEdit', query: { id: result.posts.id } })
            }).catch(e => {
              this.loading = false
              this.$alert(e.message)
            })
          } else {
            return false
          }
        })
      },
      init () {
        const postsId = this.$route.query.id
        if (postsId) {
          this.loading = true
          this.$api.posts.get(postsId).then((result) => {
            this.loading = false
            Object.assign(this.editForm, result)
            this.channel = this.editForm.posts.channel ? this.editForm.posts.channel.split(',') : ['PC']
            console.log(this.editForm)
          }).catch(e => {
            this.loading = false
            this.$alert(e.message)
          })
        }
      },
      onNodeClick (data, node) {
        const parentName = node.parent.data && node.parent.data.name
        Object.assign(this.editForm, data, { parentName: parentName })
      },
      loadPosts (node, resolve) {
        let dir = ''
        if (node.data) {
          dir = node.data.path
        }
        this.$api.posts.getPostsFiles({ dir: dir }).then(data => {
          resolve(data)
        })
      }
    },
    created: function () {
      this.$api.cate.getList().then(result => {
        this.categories = result
      })
      this.$api.tags.getList().then(result => {
        this.tags = result
      })
      this.init()
    }
  }
</script>

<style>
  .post-edit {
    padding: 20px;
    min-height: 500px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 70px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .v-note-wrapper {
    min-height: 500px !important;
  }
</style>
