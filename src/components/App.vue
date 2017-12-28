<template>
  <div class="wrapper">

    <header class="main-header">
      <a href="index2.html" class="logo">
        <span class="logo-mini"><b>L</b></span>
        <span class="logo-lg"><b>Leon</b></span>
      </a>
      <nav class="navbar navbar-static-top">
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>
      </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">
      <!-- sidebar: style can be found in sidebar.less -->
      <section class="sidebar">
        <ul class="sidebar-menu" data-widget="tree">
          <li class="header">主菜单</li>
          <li class="active treeview">
            <a href="#">
              <i class="fa fa-dashboard"></i> <span>系统管理</span>
              <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
            </a>
            <ul class="treeview-menu">
              <li class="active">
                <router-link to="/user">用户管理</router-link>
              </li>
              <li><a href="index.html">角色管理</a></li>
              <li><a href="index.html">资源管理</a></li>
              <li><a href="index.html">权限配置</a></li>
            </ul>
          </li>
        </ul>
      </section>
      <!-- /.sidebar -->
    </aside>

    <div class="content-wrapper">
      <router-view></router-view>
    </div>
    <div class="control-sidebar-bg"></div>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
