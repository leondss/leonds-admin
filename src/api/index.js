import users from './users'
import roles from './roles'
import resources from './resources'
import uploads from './uploads'

const apis = {
  users, roles, resources, uploads
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
