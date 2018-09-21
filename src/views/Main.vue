<template>
  <div class="wrapper">

    <header class="main-header">

      <a href="#" class="logo">
        <span class="logo-mini"><b>L</b></span>
        <span class="logo-lg"><b>Leonds</b></span>
      </a>

      <nav class="navbar navbar-static-top">
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>
        <router-link to="/posts/edit" class="link-title" target="_blank">
          写文章
        </router-link>
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">
            <li class="dropdown" v-bind:class="{ open: personDialogStatus }"
                @mouseenter="personDialogStatus = true"
                @mouseleave="personDialogStatus = false">
              <a href="#" class="dropdown-toggle">
                <span class="hidden-xs">{{displayName}}</span>
              </a>
              <ul class="dropdown-menu user-settings">
                <li>
                  <a href="#" @click="handleChangePassword">修改密码</a>
                </li>
                <li>
                  <a href="#" @click="handleLogout">退出</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>

      </nav>
    </header>
    <aside class="main-sidebar">
      <section class="sidebar">
        <ul class="sidebar-menu" data-widget="tree">
          <li class="treeview" v-for="menu in menus">
            <a href="#">
              <i class="fa" :class="menu.icon"></i>
              <span>{{menu.title}}</span>
              <span class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
            </a>
            <ul class="treeview-menu">
              <li v-for="item in menu.child" :class="{active: activeTabIndex === item.path}">
                <router-link :to="item.path">{{item.title}}</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </aside>

    <div class="content-wrapper">
      <section class="content">
        <el-tabs v-show="tabs.length>0" v-model="activeTabIndex" type="card" closable @tab-click="tabClick"
                 @tab-remove="removeTab">
          <el-tab-pane
            v-for="item in tabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
          </el-tab-pane>

          <keep-alive>
            <router-view/>
          </keep-alive>

        </el-tabs>
      </section>
    </div>

    <div class="control-sidebar-bg"></div>

  </div>
</template>
<script type="text/javascript">
  import $ from '../lib/jquery-vendor'

  export default {
    name: 'Main',
    data () {
      return {
        personDialogStatus: false
      }
    },
    computed: {
      menus () {
        return this.$store.getters.menus || []
      },
      displayName () {
        return this.$store.getters.realName
      },
      tabs () {
        return this.$store.getters.tabs
      },
      activeTabIndex: {
        get () {
          return this.$store.getters.activeTabIndex
        },
        set (val) {
          this.$store.dispatch('setActiveTabIndex', val)
        }
      }
    },
    watch: {
      '$route' (to) {
        this.initTabs(to.path)
      }
    },
    methods: {
      handleChangePassword () {
        this.$router.push('/sys/modify/password')
      },
      handleLogout () {
        this.$store.dispatch('logout').then(() => {
          this.$router.push('/login')
        })
      },
      removeTab (index) {
        this.$store.dispatch('removeTabItem', index)
        if (this.activeTabIndex === index && this.tabs.length > 0) {
          this.$store.commit('setActiveTabIndex', this.tabs[this.tabs.length - 1].name)
          this.$router.push({ path: this.activeTabIndex })
        } else {
          this.$router.push({ path: '/' })
        }
      },
      tabClick () {
        this.$router.push({ path: this.activeTabIndex })
      },
      initTabs (path) {
        let tab = this.tabs.filter(r => { return r.name === path })
        if (tab.length > 0) {
          this.$store.dispatch('setActiveTabIndex', path)
        } else {
          this.$store.dispatch('setActiveTabIndex', path)
          this.$store.dispatch('appendTabItem', path)
        }
      }
    },
    created: function () {
      this.initTabs(this.$route.path)
    },
    mounted: function () {
      $('body').resize()
      $('[data-widget="tree"]').tree()
    }
  }
</script>

<style>
  .msg-dialog {
    cursor: pointer;
  }

  .user-settings {
    min-width: 124px;
  }
</style>
