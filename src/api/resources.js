import http from './http'

function getList () {
  return http.get(`/api/sysresource/tree`)
}

function getAll () {
  return http.get('/api/role/all')
}

function get (id) {
  return http.get(`/api/role/get?id=${id}`)
}

function save (params) {
  return http.post('/api/resource/save', params)
}

function remove (params) {
  return http.post('/api/sysresource/remove', params)
}

function getTreeByPid (pid) {
  return http.get(`/api/sysresource/tree?pid=${pid}`)
}

export default {
  getList, get, save, remove, getAll, getTreeByPid
}
