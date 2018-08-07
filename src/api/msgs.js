import http from './http'

function getPage (params) {
  return http.get('/api/sys/message/page', { params: params })
}

function save (params) {
  return http.post('/api/sys/message/save', params)
}

function remove (params) {
  return http.post('/api/sys/message/remove', params)
}

function get (id) {
  return http.get(`/api/sys/message/${id}`)
}

function publish (id) {
  return http.get(`/api/sys/message/publish?id=${id}`)
}

function getUnReadCount () {
  return http.get('/api/sys/message/un-read-count')
}

function getUserMessage (params) {
  return http.get('/api/sys/message/user', { params: params })
}

function setRead (params) {
  return http.post('/api/sys/message/set/read', params)
}

export default {
  getPage, save, remove, get, publish, getUnReadCount, getUserMessage, setRead
}
