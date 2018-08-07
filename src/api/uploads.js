import http from './http'

function remove (path) {
  return http.post(`/api/upload/remove?path=${path}`)
}

function getFiles (master, type) {
  return http.get(`/api/files?master=${master}&fileType=${type}`)
}

export default {
  remove, getFiles
}
