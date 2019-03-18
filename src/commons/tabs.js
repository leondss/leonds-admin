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
  },
  {
    title: '分类管理',
    name: '/cms/category'
  },
  {
    title: '标签管理',
    name: '/cms/tag'
  },
  {
    title: '文章管理',
    name: '/cms/posts'
  },
  {
    title: '系统设置',
    name: '/sys/settings'
  },
  {
    title: '文章发布',
    name: '/cms/posts/edit'
  }
]

function findTab (index) {
  return tabs.filter((t) => { return t.name === index })
}

export { findTab }
