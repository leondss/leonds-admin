const getters = {
  perms: state => state.user.perms,
  realName: state => state.user.info.realName,
  resources: state => state.user.resources,
  menus: state => state.user.menus,
  routers: state => state.user.routers,
  tabs: state => state.app.tabs,
  activeTabIndex: state => state.app.activeTabIndex
}
export default getters
