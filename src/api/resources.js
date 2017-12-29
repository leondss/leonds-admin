import axios from 'axios'

function getList (pid) {
  return axios.get(`/api/resource/list?pid=${pid}`)
}

function getAll () {
  return axios.get('/api/role/all')
}

function get (id) {
  return axios.get(`/api/role/get?id=${id}`)
}

function save (params) {
  return axios.post('/api/resource/save', params)
}

function remove (params) {
  return axios.post('/api/role/remove', params)
}

export default {
  getList, get, save, remove, getAll
}
