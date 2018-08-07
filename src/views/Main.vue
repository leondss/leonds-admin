<template>
  <el-container>
    <el-header class="main-header" height="50px">
      <a href="#" class="banner-text">
        <span><b>A</b></span>
      </a>

      <nav class="topbar">
        <!--<a href="#" class="topbar-toggle">
          <i class="icon fa fa-bars"></i>
        </a>-->
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">
            <li class="dropdown">
              <a href="#" @click="handleOpenMessage" title="公告">
                <i class="fa fa-envelope-o"></i>
                <span v-if="unReadCount>0" class="label">{{unReadCount}}</span>
              </a>
            </li>
            <li class="dropdown" v-bind:class="{ open: personDialogStatus }"
                @mouseenter="personDialogStatus = true"
                @mouseleave="personDialogStatus = false">
              <a href="#" class="dropdown-toggle">
                <span class="hidden-xs">{{displayName}}</span>
              </a>
              <ul class="dropdown-menu">
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
      <el-main class="main-body">
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
      </el-main>
    </el-container>
  </el-container>
</template>
<script type="text/javascript">
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
        if (this.$store.getters.realName) {
          return `${this.$store.getters.realName}(${this.$store.getters.storeName})`
        }
        return ''
      },
      unReadCount () {
        return this.$store.getters.messageCount
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
        this.$taber.open({ name: '/sys/modify/password' })
      },
      handleLogout () {
        this.$store.dispatch('logout').then(() => {
          this.$router.push('/login')
        })
      },
      handleOpenMessage () {
        this.$taber.open({ name: '/sys/message/list' })
      },
      getUnReadCount () {
        this.$store.dispatch('getUnReadMessageCount').then((count) => {
          if (count > 0) {
            const notify = this.$notify.info({
              title: '消息',
              customClass: 'msg-dialog',
              position: 'bottom-right',
              showClose: false,
              dangerouslyUseHTMLString: true,
              message: `您有<span style="color: red;">${count}</span>条新的消息，点击查看详情`,
              duration: 0,
              onClick: function () {
                notify.close()
                this.$taber.open({ name: '/sys/message/list' })
              }
            })
          }
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
      this.getUnReadCount()
      this.initTabs(this.$route.path)
    }
  }
</script>

<style>
  .label {
    position: absolute;
    top: 9px;
    right: 7px;
    text-align: center;
    font-size: 9px;
    padding: 2px 3px;
    line-height: .9;
    background: #f11f1f !important;
  }

  .msg-dialog {
    cursor: pointer;
  }
</style>
