import users from './users'
import stores from './stores'
import roles from './roles'
import resources from './resources'
import dicts from './dicts'
import goods from './goods'
import orders from './orders'
import msgs from './msgs'
import rpts from './rpts'
import uploads from './uploads'

const apis = {
  users, roles, resources, stores, dicts, goods, orders, msgs, rpts, uploads
}

const install = function (Vue) {
  if (install.installed) return
  install.installed = true

  Object.defineProperties(Vue.prototype, {
    $api: {
      get () {
        return apis
      }
    }
  })
}

export default {
  install
}
