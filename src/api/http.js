import axios from 'axios'
import { MessageBox } from 'element-ui'
import { getToken } from '../commons/token'
import store from '../store'

let http = axios.create({
  baseURL: '/',
  timeout: 60 * 1000
})

/* 过滤请求 */
http.interceptors.request.use((config) => {
  config.headers['Wkl-Auth-Token'] = getToken()
  return config
})
/* 过滤响应 */
http.interceptors.response.use(
  result => {
    const data = result.data
    if (data.status !== 0) {
      return Promise.reject(new Error(data.message))
    }
    return data.data
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        store.dispatch('logoutOnly').then(() => {
          location.reload()
        })
      } else if (error.response.status === 403) {
        MessageBox.alert('暂无权限')
      } else if (error.response.status === 500) {
        MessageBox.alert('服务器异常,请联系管理员')
      } else {
        MessageBox.alert(error.message)
      }
    }
  })

export default http
