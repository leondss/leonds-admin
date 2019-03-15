import http from './http'

function save (params) {
  return http.post('/api/cate/save', params)
}

function remove (params) {
  return http.post('/api/cate/remove', params)
}

function getList () {
  return http.get(`/api/cate/list`)
}

function get (id) {
  return http.get(`/api/cate/${id}`)
}

export default {
  save, remove, getList, get
}
