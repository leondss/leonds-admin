import axios from 'axios'

function getList (params) {
  return axios.get('/api/posts/list', {params: params})
}

function getCategory () {
  return axios.get('/api/category/list')
}

function getTag () {
  return axios.get('/api/tag/list')
}

function save (params) {
  return axios.post('/api/posts/save', params)
}

function get (id) {
  return axios.get(`/api/posts/get?id=${id}`)
}

export default {
  getList, getCategory, getTag, save, get
}
