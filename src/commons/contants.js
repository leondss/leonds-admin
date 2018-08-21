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

export const TOKEN_NAME = 'Leonds-Auth-Token'
