import { isArray, isFunction, isString } from './utils'
import store from '../store'

function hasPerm (value) {
  if (value) {
    const perms = store.getters && store.getters.perms
    let hasPermission = false
    if (isString(value)) {
      hasPermission = perms.includes(value)
    } else if (isArray(value) && value.length > 0) {
      hasPermission = perms.some(perm => {
        return value.includes(perm)
      })
    } else if (isFunction(value)) {
      hasPermission = value()
    }
    return hasPermission
  }
  return false
}

const install = function (Vue) {
  if (install.installed) return
  install.installed = true

  Object.defineProperties(Vue.prototype, {
    hasPerm: {
      get () {
        return hasPerm
      }
    }
  })
}

export default {
  install
}
