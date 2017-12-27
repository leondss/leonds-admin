import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import App from '../components/App.vue'

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
    }
  ]
})
