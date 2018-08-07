import store from '../../store'
import { isString, isArray, isFunction } from '../../commons/utils'

export default {
  inserted (el, binding, vnode) {
    const { value } = binding
    const perms = store.getters && store.getters.perms

    if (value) {
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
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
