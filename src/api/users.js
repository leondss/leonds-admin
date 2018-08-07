import http from './http'

function getUserList (params) {
  return http.get('/api/sysuser/page', { params: params })
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

function resetPassword (id) {
  return http.post(`/api/sysuser/reset/password?id=${id}`)
}

function login ({ username, password }) {
  return http.post(`/login?username=${username}&password=${password}`)
}

function getUserInfo (token) {
  return http.post(`/api/sysuser/info?token=${token}`)
}

function logout () {
  return http.post(`/logout`)
}

function modifyPassword (params) {
  return http.post(`/modify/password?newPassword=${params.newPassword}&oldPassword=${params.oldPassword}&confirmPassword=${params.confirmPassword}`)
}

export default {
  getUserList,
  getUser,
  saveUser,
  remove,
  enable,
  disable,
  saveUserRole,
  resetPassword,
  login,
  getUserInfo,
  logout,
  modifyPassword
}
