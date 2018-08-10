import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import api from './api'
import store from './store'
import permission from './directive/permission'
import perm from './commons/perm'
import Viewer from 'v-viewer'
import VueParticles from 'vue-particles'

import './lib/css'
import './lib/script'

Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small' })

Vue.use(api)
Vue.use(perm)

Vue.directive('perm', permission)

Vue.use(Viewer)

Vue.use(VueParticles)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
