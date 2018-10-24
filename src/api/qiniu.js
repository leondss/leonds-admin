import http from './http'

function getToken () {
  return http.get('/api/qiniu/token')
}

export default {
  getToken
}
