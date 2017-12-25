<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="activeIndex"
          :active="activeIndex"
          class="el-menu-demo"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#b8c7ce"
          active-text-color="#fff">
          <el-menu-item index="/">订单同步</el-menu-item>
          <el-menu-item index="/order-details">订单明细</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'Main',
    data () {
      return {
        activeIndex: '/'
      }
    },
    methods: {
      handleSelect (index) {
        this.$router.push(index)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
