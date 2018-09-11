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
    title: '修改密码',
    name: '/sys/modify/password'
  }
]

function findTab (index) {
  return tabs.filter((t) => { return t.name === index })
}

export { findTab }
