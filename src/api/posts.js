import http from './http'

function getList (params) {
  return http.get('/api/posts/page', { params: params })
}

function get (id) {
  return http.get(`/api/posts/${id}`)
}

function save (params) {
  return http.post('/api/posts/save', params)
}

function remove (params) {
  return http.post('/api/posts/remove', params)
}

function publish (params) {
  return http.post('/api/posts/publish', params)
}

function out (params) {
  return http.post('/api/posts/out', params)
}

function clonePosts () {
  return http.get('/api/posts/clone')
}

function getPostsFiles (params) {
  return http.get('/api/posts/files', { params: params })
}

export default {
  getList, get, save, remove, publish, out, clonePosts, getPostsFiles
}
