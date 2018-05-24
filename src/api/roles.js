import http from './http'

function getList (params) {
  return http.get('/api/sysrole/page', {params: params})
}

function getAll () {
  return http.get('/api/sysrole/all')
}

function get (id) {
  return http.get(`/api/sysrole/${id}`)
}

function save (params) {
  return http.post('/api/sysrole/save', params)
}

function remove (params) {
  return http.post('/api/sysrole/remove', params)
}

function getResource (id) {
  return http.get(`/api/sysrole/get-role-resource?id=${id}`)
}

export default {
  getList, get, save, remove, getAll, getResource
}
