import { getToken, removeToken, setToken } from '../../commons/token'
import users from '../../api/users'
import { generateMenus, generateRouters } from '../../commons/resource'

const user = {
  state: {
    token: '',
    info: {},
    perms: [],
    dataPerms: {},
    resources: [],
    store: {},
    routers: [],
    menus: []
  },
  mutations: {
    setToken: (state, token) => {
      state.token = token
    },
    setInfo: (state, info) => {
      state.info = info
    },
    setPerms: (state, perms) => {
      state.perms = perms
    },
    setResources: (state, resources) => {
      state.resources = resources
    },
    setStore: (state, store) => {
      state.store = store
    },
    setRouters: (state, routers) => {
      state.routers = routers
    },
    setMenus: (state, menus) => {
      state.menus = menus
    },
    setDataPerms: (state, dataPerms) => {
      state.dataPerms = dataPerms
    }
  },
  actions: {
    // 用户名登录
    login ({ commit }, params) {
      return new Promise((resolve, reject) => {
        users.login(params).then(token => {
          commit('setToken', token)
          setToken(token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        users.logout().then(() => {
          commit('setToken', '')
          commit('setInfo', {})
          commit('setPerms', [])
          commit('setResources', [])
          commit('setStore', {})
          commit('setRouters', [])
          commit('setMenus', [])
          commit('setTabItems', [])
          commit('setActiveTabIndex', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    logoutOnly ({ commit }) {
      return new Promise(resolve => {
        commit('setToken', '')
        commit('setInfo', {})
        commit('setPerms', [])
        commit('setResources', [])
        commit('setStore', {})
        commit('setRouters', [])
        commit('setMenus', [])
        commit('setTabItems', [])
        commit('setActiveTabIndex', '')
        removeToken()
        resolve()
      })
    },
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        users.getUserInfo(getToken()).then(data => {
          commit('setInfo', data.user)
          commit('setPerms', data.perms)
          commit('setResources', data.resources)
          commit('setStore', data.store)
          commit('setDataPerms', data.dataPerms)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    createRouters ({ commit, state }) {
      return new Promise((resolve) => {
        if (state.resources.length > 0) {
          const routers = generateRouters(state.resources)
          commit('setRouters', routers)
          resolve(routers)
        }
      })
    },
    createMenus ({ commit, state }) {
      return new Promise((resolve) => {
        if (state.resources && state.resources.length > 0) {
          const menus = generateMenus(state.resources)
          commit('setMenus', menus)
          resolve(menus)
        }
      })
    }
  }
}

export default user
