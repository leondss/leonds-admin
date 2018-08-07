const getters = {
  perms: state => state.user.perms,
  dataPerms: state => state.user.dataPerms,
  realName: state => state.user.info.realName,
  storeName: state => state.user.store.name,
  resources: state => state.user.resources,
  menus: state => state.user.menus,
  routers: state => state.user.routers,
  messageCount: state => state.app.messageCount,
  messages: state => state.app.messages,
  tabs: state => state.app.tabs,
  activeTabIndex: state => state.app.activeTabIndex
}
export default getters
