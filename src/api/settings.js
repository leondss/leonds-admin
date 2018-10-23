import http from './http'

function save (params) {
  return http.post('/api/settings/save', params)
}

function remove (params) {
  return http.post('/api/settings/remove', params)
}

function getList (params) {
  return http.get(`/api/settings/list`, { params: params })
}

function get (id) {
  return http.get(`/api/settings/${id}`)
}

export default {
  save, remove, getList, get
}
