import users from './users'
import roles from './roles'
import resources from './resources'
import posts from './posts'

const apis = {
  users, roles, resources, posts
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
