import http from './http'

function getPage (params) {
  return http.get('/api/dict/page', { params: params })
}

function save (params) {
  return http.post('/api/dict/save', params)
}

function remove (params) {
  return http.post('/api/dict/remove', params)
}

function getDictItems (type) {
  return http.get(`/api/dict/items?type=${type}`)
}

function getCategory () {
  return http.get('/api/dict/category')
}

export default {
  getPage, save, remove, getDictItems, getCategory
}
