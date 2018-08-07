const tabs = [
  {
    title: '用户管理',
    name: '/sys/user'
  },
  {
    title: '角色管理',
    name: '/sys/role'
  },
  {
    title: '门店管理',
    name: '/sys/store'
  },
  {
    title: '资源管理',
    name: '/sys/resource'
  },
  {
    title: '字典管理',
    name: '/bas/dict'
  },
  {
    title: '商品管理',
    name: '/bas/goods'
  },
  {
    title: '报货单',
    name: '/order'
  },
  {
    title: '报货单汇总',
    name: '/order/summary'
  },
  {
    title: '报货单详情',
    name: '/order/detail'
  },
  {
    title: '公告管理',
    name: '/sys/message'
  },
  {
    title: '修改密码',
    name: '/sys/modify/password'
  },
  {
    title: '我的公告',
    name: '/sys/message/list'
  },
  {
    title: '采购单',
    name: '/purchase/order'
  },
  {
    title: '采购单详情',
    name: '/purchase/order/detail'
  },
  {
    title: '门店收货情况',
    name: '/rpt/order'
  },
  {
    title: '总部采购情况',
    name: '/rpt/purchase/order'
  }
]

function findTab (index) {
  return tabs.filter((t) => { return t.name === index })
}

export { findTab }
