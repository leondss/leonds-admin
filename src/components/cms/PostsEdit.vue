<template>
  <section class="content">
    <el-row>
      <el-col :span="3">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          style="min-height: 560px;"
          active-text-color="#ffd04b">

          <el-menu-item index="c.id" v-for="c in category">
            <span slot="title">{{c.name}}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="24">

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
          title: '',
          content: '',
          category: '',
          tag: '',
          status: ''
        },
        category: []
      }
    },
    methods: {
      save () {
        console.log()
      },
      getCategory () {
        this.$api.posts.getCategory().then(result => {
          this.category = result.data
        })
      }
    },
    created () {
      this.getCategory()
    }
  }
</script>

<style>

</style>
