<template>
  <el-row>
    <mavon-editor v-model="editForm.content"/>
  </el-row>
</template>

<script>
  export default {
    name: 'PostsEdit',
    data () {
      return {
        editForm: {
          id: '',
          content: '',
          tag: '',
          cate: ''
        }
      }
    },
    methods: {},
    created: function () {
    }
  }
</script>

<style>

</style>
