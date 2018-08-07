import http from './http'

function getPage (params) {
  return http.get('/api/goods/page', { params: params })
}

function save (params) {
  return http.post('/api/goods/save', params)
}

function remove (params) {
  return http.post('/api/goods/remove', params)
}

function get (id) {
  return http.get(`/api/goods/${id}`)
}

function publish (params) {
  return http.post('/api/goods/publish', params)
}

function soldOut (params) {
  return http.post('/api/goods/sold-out', params)
}

export default {
  getPage, save, remove, get, publish, soldOut
}
