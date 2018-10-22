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
        <mavon-editor v-model="editForm.content"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
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
    methods: {},
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
