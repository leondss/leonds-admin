const files = require.context('.', false, /\.js$/)
const apis = {}

files.keys().forEach(key => {
  if (key === './index.js' || key === './http.js') return
  apis[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

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
