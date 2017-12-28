import axios from 'axios'

function getUserList (params) {
  return axios.get('/api/user/list', {params: params})
}

function getUser (id) {
  return axios.get(`/api/user/get?id=${id}`)
}

function saveUser (params) {
  return axios.post('/api/user/save', params)
}

export default {
  getUserList, getUser, saveUser
}
