export const FILE_TYPE = {
  IMG: 'IMG',
  FILE: 'FILE'
}

/**
 * 评论状态: OPEN-开启；CLOSE-关闭
 * @type {{OPEN: number, CLOSE: number}}
 */
export const COMMENTS_STATUS = {
  OPEN: 1,
  CLOSE: 2
}
/**
 * 是否置顶
 * @type {{Y: number, N: number}}
 */
export const TOP_STATUS = {
  Y: 1,
  N: 2
}

/**
 * 文章状态
 * @type {{DRAFT: number, PUBLISH: number}}
 */
export const POSTS_STATUS = {
  DRAFT: 1,
  PUBLISH: 2
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
