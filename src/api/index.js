import users from './users'
import roles from './roles'
import resources from './resources'
import uploads from './uploads'
import cate from './categories'
import posts from './posts'
import tags from './tags'

const apis = {
  users, roles, resources, uploads, cate, posts, tags
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
