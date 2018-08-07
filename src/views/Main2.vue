<template>
  <div class="wrapper">

    <header class="main-header">

      <a href="#" class="logo">
        <span class="logo-mini"><b>W</b></span>
        <span class="logo-lg"><b>WKL</b></span>
      </a>

      <nav class="navbar navbar-static-top">
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>
        <a href="#" class="kf-qq">
          <span>QQ:390528974</span>
        </a>
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">

            <li class="dropdown notifications-menu">
              <a href="#" @click="handleOpenMessage" title="公告">
                <i class="fa fa-envelope-o"></i>
                <span class="label label-warning" v-if="unReadCount>0">{{unReadCount}}</span>
              </a>
            </li>
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

    <el-dialog
      :visible.sync="unReadMessages.length>0"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="70%">
      <div slot="title" class="clearfix">
        <h3>您有{{unReadMessages.length}}条未读公告</h3>
      </div>
      <el-row>
        <el-table
          :data="unReadMessages"
          style="width: 100%">
          <el-table-column prop="content" label="公告内容"></el-table-column>
          <el-table-column label="图片" width="250">
            <template slot-scope="scope">
              <div v-viewer>
                <img v-for="src in getImages(scope.row.images)" :src="src" width="50" height="50"
                     class="row-image"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="publishTime" label="发布时间" width="150"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="openFiles(scope.row.msgId)" type="text">查看附件</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          title="附件"
          :visible.sync="filesDialogVisible"
          :append-to-body="true"
          width="50%">
          <el-row>
            <el-col :span="24">
              <ul>
                <li v-for="item in filesRows">
                  <a :href="'wkl/'+item.path" class="file-link" target="_blank">{{item.alias}}</a>
                </li>
              </ul>
            </el-col>
          </el-row>
        </el-dialog>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleReadMessage">已阅</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script type="text/javascript">
  import $ from '../lib/jquery-vendor'
  import { FILE_TYPE } from '../commons/contants'

  export default {
    name: 'Main',
    data () {
      return {
        personDialogStatus: false,
        unReadMessages: [],
        filesDialogVisible: false,
        filesRows: [],
        previewImages: [],
        currentImg: {},
        currentImgIndex: 0,
        imageDialogVisible: false
      }
    },
    computed: {
      menus () {
        return this.$store.getters.menus || []
      },
      displayName () {
        if (this.$store.getters.realName) {
          const storeName = this.$store.getters.storeName
          const store = storeName ? `(${storeName})` : ''
          return `${this.$store.getters.realName}${store}`
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
        this.$router.push('/sys/modify/password')
      },
      handleLogout () {
        this.$store.dispatch('logout').then(() => {
          this.$router.push('/login')
        })
      },
      handleOpenMessage () {
        this.$router.push('/sys/message/list')
      },
      getUnReadMessage () {
        this.$store.dispatch('getUnReadMessage').then((rows) => {
          this.unReadMessages = rows
        })
      },
      handleReadMessage () {
        const ids = this.unReadMessages.map(i => { return i.id })
        this.$api.msgs.setRead(ids).then(() => {
          this.unReadMessages = []
          this.getUnReadMessage()
        }).catch(e => {
          this.$alert(e.message)
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
      },
      openFiles (id) {
        this.filesDialogVisible = true
        this.$api.uploads.getFiles(id, FILE_TYPE.FILE).then(result => {
          this.filesRows = result
        })
      },
      getImages (images) {
        const urls = (images && images.split(',')) || []
        return urls.map(i => { return 'wkl' + i })
      }
    },
    created: function () {
      this.getUnReadMessage()
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

  .m-image {
    margin: 5px;
  }

  .m-card {
    margin-bottom: 10px;
  }

  .kf-qq {
    color: #ffffff;
    line-height: 50px;
    margin-left: 5px;
  }

  .row-image {
    margin-left: 5px;
    cursor: pointer;
  }

  .row-image:hover {
    border: 1px #0d6aad solid;
  }
</style>
