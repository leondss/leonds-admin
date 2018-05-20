<template>
  <section class="content">
    <el-row>
      <el-col :span="24">
        <el-form :model="posts" :rules="rules" ref="posts" label-width="100px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="posts.title"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="10">
              <el-form-item label="分类" prop="category">
                <el-select v-model="posts.category" clearable multiple>
                  <el-option
                    v-for="item in categories"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="标签">
                <el-select v-model="posts.tag" clearable multiple>
                  <el-option
                    v-for="item in tags"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="内容" prop="content">
            <mavon-editor v-model="posts.content"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save('posts','draft')" :loading="editLoading">保存草稿</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  export default {
    name: 'PostsEdit',
    data () {
      return {
        posts: {
          id: '',
          title: '',
          content: '',
          category: [],
          tag: [],
          status: ''
        },
        categories: [],
        tags: [],
        rules: {
          title: [
            {required: true, message: '请输入文章标题', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入文章内容', trigger: 'change'}
          ],
          category: [
            {required: true, message: '请选择分类', trigger: 'change'}
          ]
        },
        editLoading: false
      }
    },
    methods: {
      save (formName, status) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.editLoading = true
            this.posts.status = status
            this.$api.posts.save(this.posts).then(result => {
              this.editLoading = false
              if (result.data && result.data.status === 0) {
                this.$message.success('保存成功')
                this.posts = result.data.data
              } else {
                this.$alert(result.data.message)
              }
            })
          }
        })
      },
      getCategory () {
        this.$api.posts.getCategory().then(result => {
          this.categories = result.data
        })
      },
      getTag () {
        this.$api.posts.getTag().then(result => {
          this.tags = result.data
        })
      },
      getPosts (id) {
        this.$api.posts.get(id).then(result => {
          this.posts = result.data
        })
      }
    },
    created () {
      this.getCategory()
      this.getTag()
    }
  }
</script>

<style>

</style>
