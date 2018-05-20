<template>
  <el-container>
    <el-header class="main-header" height="50px">
        <a href="index2.html" class="banner-text">
          <span><b>Leonds</b></span>
        </a>

        <nav class="topbar">
          <a href="#" class="topbar-toggle">
            <i class="icon fa bars"></i>
          </a>
          <div class="navbar-custom-menu">

          </div>
        </nav>
    </el-header>
    <el-container>
      <el-aside width="220" class="main-menu">
        <el-menu
          class="nav-menu"
          theme="dark"
          router
          :default-active="$route.path">
          <div
            v-for="(item, index) in menus"
            :key="index">
            <el-menu-item
              class="nav-menu-item"
              v-if="typeof item.child === 'undefined'"
              :index="item.path">
              <i class="icon fa" :class="item.icon"></i>
              <span v-text="item.title" class="text"></span>
            </el-menu-item>
            <el-submenu
              :index="item.path"
              v-else>
              <template slot="title">
                <i class="icon fa" :class="item.icon"></i>
                <span v-text="item.title" class="text"></span>
              </template>
              <el-menu-item
                class="nav-menu-item"
                v-for="(sub_item, sub_index) in item.child"
                :index="sub_item.path"
                :key="sub_index">
                <!--<i class="icon fa" :class="sub_item.icon"></i>-->
                <span v-text="sub_item.title" class="text"></span>
              </el-menu-item>
            </el-submenu>
          </div>
        </el-menu>
      </el-aside>
      <el-main class="main-body">Main</el-main>
    </el-container>
  </el-container>
</template>
<script type="text/javascript">
  export default {
    name: 'page',
    data () {
      return {
        menus: [{
          title: '主页',
          path: '/home',
          icon: 'fa-home'
        }, {
          title: '表格管理',
          path: '/table',
          icon: 'fa-table',
          child: [{
            title: '基本表格',
            path: '/table/base'
          }, {
            title: '排序表格',
            path: '/table/sort'
          }]
        }, {
          title: '图表管理',
          path: '/charts',
          icon: 'fa-bar-chart-o',
          child: [{
            title: '柱状图表',
            path: '/charts/bar'
          }]
        }]
      }
    }
  }
</script>
