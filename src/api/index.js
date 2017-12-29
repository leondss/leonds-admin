import users from './users'
import roles from './roles'
import resources from './resources'

const apis = {
  users, roles, resources
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
