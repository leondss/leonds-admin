<template>
  <div class="post-edit" v-loading="loading">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="标题" prop="posts.title">
            <el-input v-model="editForm.posts.title" placeholder="请输入文章标题" clearable style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="category">
            <el-select v-model="editForm.category" clearable multiple style="width: 100px;">
              <el-option v-for="item in categories" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="editForm.tag" clearable multiple collapse-tags>
              <el-option v-for="item in tags" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="editForm.posts.commentsStatus" :true-label="1" :false-label="2">允许评论</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="editForm.posts.topStatus" :true-label="1" :false-label="2">置顶</el-checkbox>
          </el-form-item>
          <el-button class="pull-right" type="primary" style="margin-left: 10px" @click="publish">发布</el-button>
          <el-button class="pull-right" @click="save">保存草稿</el-button>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <mavon-editor v-model="editForm.posts.contentMd" ref="md" @imgAdd="handleImageAdd" @change="handleMdChange"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as qiniu from 'qiniu-js'

  import { COMMENTS_STATUS, POSTS_STATUS, TOP_STATUS } from '../../commons/contants'

  export default {
    name: 'PostsEdit',
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
            status: POSTS_STATUS.DRAFT
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
        loading: false
      }
    },
    methods: {
      publish () {
        this.editForm.posts.status = POSTS_STATUS.PUBLISH
        this.doSave()
      },
      save () {
        console.log(this.editForm)
        this.editForm.posts.status = POSTS_STATUS.DRAFT
        this.doSave()
      },
      doSave () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$api.posts.save(this.editForm).then((result) => {
              this.loading = false
              this.$message.success('保存成功')
              this.$router.push({ name: 'PostsEdit', params: { id: result.posts.id } })
            }).catch(e => {
              this.loading = false
              this.$alert(e.message)
            })
          } else {
            return false
          }
        })
      },
      handleMdChange (value, render) {
        this.editForm.posts.contentHtml = render
      },
      handleImageAdd (pos, file) {
        this.$api.qiniu.getToken().then((token) => {
          const observable = qiniu.upload(file, null, token)
          observable.subscribe({
            complete: (res) => {
              const imgLink = qiniu.watermark({
                mode: 2,  // 文字水印
                text: 'www.leonds.com', // 水印文字，mode = 2 时 **必需**
                dissolve: 30,          // 透明度，取值范围1-100，非必需，下同
                gravity: 'SouthEast',  // 水印位置，同上
                fontsize: 500,         // 字体大小，单位: 缇
                font: '黑体',           // 水印文字字体
                dx: 10,               // 横轴边距，单位:像素(px)
                dy: 10,               // 纵轴边距，单位:像素(px)
                fill: '#FFF000'        // 水印文字颜色，RGB格式，可以是颜色名称
              }, res.key, 'http://img.leonds.com')
              this.$refs.md.$img2Url(pos, imgLink)
            }
          })
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
