import http from './http'

function getPage (params) {
  return http.get('/api/order/page', { params: params })
}

function save (params) {
  return http.post('/api/order/save', params)
}

function removeDetail (detailId) {
  return http.post(`/api/order/detail/remove?id=${detailId}`)
}

function remove (params) {
  return http.post('/api/order/remove', params)
}

function get (orderId) {
  return http.get(`/api/order/get?orderId=${orderId}`)
}

function getLogs (orderId) {
  return http.get(`/api/order/logs?orderId=${orderId}`)
}

function getOrderSummary (params) {
  return http.get('/api/order/summary', { params: params })
}

function getPurchasePage (params) {
  return http.get('/api/purchase/order/page', { params: params })
}

function getPurchaseOrderLogs (orderId) {
  return http.get(`/api/purchase/order/logs?orderId=${orderId}`)
}

function removePurchaseOrder (params) {
  return http.post('/api/purchase/order/remove', params)
}

function savePurchaseOrder (params) {
  return http.post('/api/purchase/order/save', params)
}

function createPurchaseOrder (params) {
  return http.post('/api/purchase/order/create', params)
}

function getPurchaseOrder (orderId) {
  return http.get(`/api/purchase/order/get?orderId=${orderId}`)
}

function confirmReceive (params) {
  return http.post('/api/order/confirm/receive', params)
}

function confirmSend (detailId, qtySend) {
  return http.post(`/api/order/confirm/send?detailId=${detailId}&qtySend=${qtySend}`)
}

function getOrderSummaryAssign (params) {
  return http.post('/api/order/summary/assign', params)
}

export default {
  save,
  removeDetail,
  getPage,
  get,
  getLogs,
  getOrderSummary,
  savePurchaseOrder,
  remove,
  getPurchaseOrder,
  getPurchaseOrderLogs,
  confirmReceive,
  confirmSend,
  getPurchasePage,
  getOrderSummaryAssign,
  createPurchaseOrder,
  removePurchaseOrder
}
