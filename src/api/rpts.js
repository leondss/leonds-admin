import http from './http'

function getOrders (params) {
  return http.get('/api/rpt/orders', { params: params })
}

function getPurchaseOrders (params) {
  return http.get('/api/rpt/purchase/orders', { params: params })
}

function exportOrders (params) {
  return http.get('/api/rpt/orders/export', { params: params })
}

export default {
  getOrders, getPurchaseOrders, exportOrders
}
