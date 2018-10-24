<template>
  <div class="post-edit">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="editForm">
          <el-form-item label="标题">
            <el-input v-model="editForm.title" placeholder="请输入文章标题" clearable style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="inputCate" clearable>
              <el-option v-for="item in categories" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="inputTag" clearable multiple collapse-tags>
              <el-option v-for="item in tags" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="editForm.commentsStatus" :true-label="1" :false-label="2">允许评论</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="editForm.topStatus" :true-label="1" :false-label="2">置顶</el-checkbox>
          </el-form-item>
          <el-button class="pull-right" type="primary">发布</el-button>
          <el-button class="pull-right">保存草稿</el-button>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <mavon-editor v-model="editForm.content" ref="md" @imgAdd="handleImageAdd"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as qiniu from 'qiniu-js'

  export default {
    name: 'PostsEdit',
    data () {
      return {
        editForm: {
          id: '',
          title: '',
          content: '',
          html: '',
          commentsStatus: 1,
          topStatus: 2,
          status: 1
        },
        inputCate: [],
        inputTag: [],
        categories: [],
        tags: []
      }
    },
    methods: {
      doSave () {

      },
      handleImageAdd (pos, file) {
        this.$api.qiniu.getToken().then((token) => {
          const observable = qiniu.upload(file, null, token)
          observable.subscribe({
            complete: (res) => {
              console.log(res)
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
              console.log(imgLink)
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
