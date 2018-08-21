import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import User from '../views/sys/User.vue'
import Role from '../views/sys/Role.vue'
import Resource from '../views/sys/Resource.vue'
import Dict from '../views/bas/Dict'
import ModifyPassword from '../views/sys/ModifyPassword'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: [
        {
          path: '/sys/user',
          name: 'User',
          component: User,
          meta: { title: '用户管理' }
        },
        {
          path: '/sys/role',
          name: 'Role',
          component: Role
        },
        {
          path: '/sys/resource',
          name: 'Resource',
          component: Resource
        },
        {
          path: '/bas/dict',
          name: 'Dict',
          component: Dict
        },
        {
          path: '/sys/modify/password',
          name: 'ModifyPassword',
          component: ModifyPassword
        }
      ]
    }
  ]
})
