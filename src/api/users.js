import http from './http'

function getUserList (params) {
  return http.get('/api/sysuser/page', {params: params})
}

function getUser (id) {
  return http.get(`/api/sysuser/${id}`)
}

function saveUser (params) {
  return http.post('/api/sysuser/save', params)
}

function remove (params) {
  return http.post('/api/sysuser/remove', params)
}

function enable (params) {
  return http.post('/api/sysuser/enable', params)
}

function disable (params) {
  return http.post('/api/sysuser/disable', params)
}

function saveUserRole (params) {
  return http.post('/api/sysuser/save/role', params)
}

export default {
  getUserList, getUser, saveUser, remove, enable, disable, saveUserRole
}
