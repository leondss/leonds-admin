import Vue from 'vue'
import App from './components/App.vue'
import router from './router'
import ElementUI from 'element-ui'
import api from './api'
import mavonEditor from 'mavon-editor'
import 'element-ui/lib/theme-chalk/index.css'
import 'mavon-editor/dist/css/index.css'
import './assets/styles.css'

Vue.config.productionTip = false
Vue.use(ElementUI, {size: 'small'})

Vue.use(api)
Vue.use(mavonEditor)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
