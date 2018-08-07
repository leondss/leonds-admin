import router from './router'
import NProgress from 'nprogress'
import './assets/scss/nprogress.scss'
import { getToken } from './commons/token'
import store from './store'
import { Message } from 'element-ui'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.resources.length === 0 || store.getters.menus.length === 0) {
        store.dispatch('getUserInfo').then(() => {
          store.dispatch('createMenus').then(() => {
            next()
          })
        }).catch((err) => {
          store.dispatch('logoutOnly').then(() => {
            Message.error(err || '权限校验失败，请重新登录')
            next('/login')
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
