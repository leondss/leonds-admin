import http from './http'

function save (params) {
  return http.post('/api/cate/save', params)
}

function remove (params) {
  return http.post('/api/cate/remove', params)
}

function getList (pid) {
  return http.get(`/api/cate/tree?pid=${pid}`)
}

export default {
  save, remove, getList
}
