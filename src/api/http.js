import axios from 'axios'

let http = axios.create({
  headers: {
    'token': '111111'
  }
})

/* 过滤请求 */
http.interceptors.request.use((config) => {
  return config
})
/* 过滤响应 */
http.interceptors.response.use(result => {
  const data = result.data
  if (data.status !== 0) {
    return Promise.reject(data.message)
  }
  return data.data
}, error => {
  return Promise.reject(error)
})

export default http
