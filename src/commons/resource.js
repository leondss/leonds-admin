function buildMenus (pid, resources) {
  const currentResources = resources.filter((res) => { return res.id === pid })
  const current = currentResources.length >= 1 ? currentResources[0] : null
  const root = convertMenu(current)
  const childResources = resources.filter((res) => { return res.pid === pid })
  const childRouter = childResources.map((res) => { return convertMenu(res) })
  childRouter.forEach(res => {
    const router = buildMenus(res.id, resources)
    root.child.push(router)
  })
  return root
}

function convertMenu (res) {
  return {
    id: res.id,
    title: res.name,
    path: res.path,
    icon: res.icon,
    child: []
  }
}

export function generateRouters (resources) {
  const result = []
  const routers = resources.filter(res => { return !!res.path })
  routers.forEach(r => {
    result.push({
      path: r.path,
      name: r.path,
      component: resolve => require([`@/views/${r.component}`], resolve)
    })
  })
  return result
}

export function generateMenus (resources) {
  const result = []
  const rootResources = resources.filter(res => { return !res.pid })
  rootResources.map(res => {
    result.push(buildMenus(res.id, resources))
  })
  return result[0].child
}
