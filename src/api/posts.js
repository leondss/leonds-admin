import axios from 'axios'

function getList (params) {
  return axios.get('/api/posts/list', {params: params})
}

function getCategory () {
  return axios.get('/api/category/list')
}

export default {
  getList, getCategory
}
