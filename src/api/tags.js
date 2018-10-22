import http from './http'

function save (params) {
  return http.post('/api/tag/save', params)
}

function remove (params) {
  return http.post('/api/tag/remove', params)
}

function getList () {
  return http.get(`/api/tag/list`)
}

function get (id) {
  return http.get(`/api/tag/${id}`)
}

export default {
  save, remove, getList, get
}
