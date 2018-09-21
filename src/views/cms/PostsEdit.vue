<template>
  <div class="post-edit">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="editForm">
          <el-form-item label="标题">
            <el-input v-model="editForm.title" placeholder="请输入文章标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-input v-model="editForm.cate" clearable></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-tag
              :key="tag"
              v-for="tag in editForm.tag"
              closable
              :disable-transitions="false"
              size="medium"
              :hit="true"
              type="success"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput"><i class="fa fa-plus"></i></el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">保存</el-button>
          </el-form-item>
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
          tag: [],
          cate: ''
        },
        inputVisible: false,
        inputValue: ''
      }
    },
    methods: {
      handleClose (tag) {
        this.editForm.tag.splice(this.editForm.tag.indexOf(tag), 1)
      },

      showInput () {
        this.inputVisible = true
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      handleInputConfirm () {
        let inputValue = this.inputValue
        if (inputValue) {
          this.editForm.tag.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      }
    },
    created: function () {
    }
  }
</script>

<style>
  .post-edit {
    padding: 20px;
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
</style>
