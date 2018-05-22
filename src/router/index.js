import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import User from '../views/sys/User.vue'
import Role from '../views/sys/Role.vue'
import Resource from '../views/sys/Resource.vue'
import Posts from '../views/cms/Posts.vue'
import PostsEdit from '../views/cms/PostsEdit.vue'

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
        },
        {
          path: '/posts',
          name: 'Posts',
          component: Posts
        },
        {
          path: '/posts-edit',
          name: 'PostsEdit',
          component: PostsEdit
        }
      ]
    }
  ]
})
