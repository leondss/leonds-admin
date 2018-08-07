export const FILE_TYPE = {
  IMG: 'IMG',
  FILE: 'FILE'
}

export const DICT_TYPE = {
  GOODS_CATEGORY: 'GOODS_CATEGORY',
  QTY_UNIT: 'QTY_UNIT',
  WEIGHT_UNIT: 'WEIGHT_UNIT',
  PERM_ROW: 'PERM_ROW',
  PERM_CELL: 'PERM_CELL'
}

export const GOODS_STATUS = {
  NEW: 1,
  PUBLISH: 2,
  OUT: 3
}
export const ORDER_STATUS = {
  NEW: 1,
  SUBMIT: 2,
  AUDITED: 3,
  FINISH: 4
}

export const ORDER_DETAIL_STATUS = {
  NEW: 1,
  SUBMIT: 2
}

export const WHETHER = {
  N: 1,
  Y: 2
}

export const PERM_ROWS = [
  {
    name: '全部',
    value: 'ALL'
  },
  {
    name: '自己',
    value: 'ONESELF'
  },
  {
    name: '门店',
    value: 'STORE'
  }
]

export const PERM_CELLS = [
  {
    name: '商品名称',
    value: 'goodsName'
  },
  {
    name: '报货数量',
    value: 'qty'
  },
  {
    name: '实收数量',
    value: 'qtyReal'
  },
  {
    name: '实送数量',
    value: 'qtySend'
  },
  {
    name: '采购数量',
    value: 'qtyPurchase'
  },
  {
    name: '验收数量',
    value: 'qtyPurchaseRel'
  },
  {
    name: '进价',
    value: 'purchasePrice'
  },
  {
    name: '收货重量',
    value: 'bhWeight'
  },
  {
    name: '采购重量',
    value: 'cgWeight'
  }
]

export const SHORTCUTS = [{
  text: '今天',
  onClick (picker) {
    const end = new Date()
    const start = new Date()
    picker.$emit('pick', [start, end])
  }
}, {
  text: '昨天',
  onClick (picker) {
    const date = new Date()
    date.setTime(date.getTime() - 3600 * 1000 * 24)
    picker.$emit('pick', [date, date])
  }
}, {
  text: '最近一周',
  onClick (picker) {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '最近一个月',
  onClick (picker) {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '最近三个月',
  onClick (picker) {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
    picker.$emit('pick', [start, end])
  }
}]
