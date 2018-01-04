import axios from 'axios'

function getList (params) {
  return axios.get('/api/role/list', {params: params})
}

function getAll () {
  return axios.get('/api/role/all')
}

function get (id) {
  return axios.get(`/api/role/get?id=${id}`)
}

function save (params) {
  return axios.post('/api/role/save', params)
}

function remove (params) {
  return axios.post('/api/role/remove', params)
}

function getResource (id) {
  return axios.get(`/api/role/get-role-resource?id=${id}`)
}

export default {
  getList, get, save, remove, getAll, getResource
}
