import http from './http'

function getPage (params) {
  return http.get('/api/store/page', {params: params})
}

function getOne (id) {
  return http.get(`/api/store/${id}`)
}

function save (params) {
  return http.post('/api/store/save', params)
}

function remove (params) {
  return http.post('/api/store/remove', params)
}

function getAll () {
  return http.get('/api/store/all')
}

export default {
  getPage, getOne, save, remove, getAll
}
