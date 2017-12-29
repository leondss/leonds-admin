import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import App from '../components/App.vue'
import User from '../components/sys/User.vue'
import Role from '../components/sys/Role.vue'
import Resource from '../components/sys/Resource.vue'

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
    },
    {
      path: '/role',
      name: 'Role',
      component: Role
    },
    {
      path: '/resource',
      name: 'Resource',
      component: Resource
    }
  ]
})
