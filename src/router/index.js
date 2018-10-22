import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import User from '../views/sys/User.vue'
import Role from '../views/sys/Role.vue'
import Resource from '../views/sys/Resource.vue'
import ModifyPassword from '../views/sys/ModifyPassword'
import Category from '../views/cms/Category'
import PostsEdit from '../views/cms/PostsEdit'
import Posts from '../views/cms/Posts'
import Tag from '../views/cms/Tag'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/cms/posts/edit',
      name: 'PostsEdit',
      component: PostsEdit
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
          path: '/sys/modify/password',
          name: 'ModifyPassword',
          component: ModifyPassword
        },
        {
          path: '/cms/category',
          name: 'Category',
          component: Category
        },
        {
          path: '/cms/tag',
          name: 'Tag',
          component: Tag
        },
        {
          path: '/cms/posts',
          name: 'Posts',
          component: Posts
        }
      ]
    }
  ]
})
