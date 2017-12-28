import Vue from 'vue'
import App from './components/App.vue'
import router from './router'
import ElementUI from 'element-ui'
import api from './api'
import 'element-ui/lib/theme-chalk/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import 'admin-lte/dist/css/AdminLTE.min.css'
import 'admin-lte/dist/css/skins/_all-skins.css'
import './assets/styles.css'

import 'jquery/dist/jquery.min'
import 'bootstrap/dist/js/bootstrap.min'
import 'admin-lte/dist/js/adminlte.min'
import 'admin-lte/dist/js/demo'

Vue.config.productionTip = false
Vue.use(ElementUI, {size: 'small'})

Vue.use(api)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
