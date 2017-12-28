import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import App from '../components/App.vue'
import User from '../components/sys/User.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/user',
      name: 'User',
      component: User
    }
  ]
})
