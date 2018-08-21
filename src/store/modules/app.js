import { findTab } from '../../commons/tabs'

const app = {
  state: {
    menuOpenStatus: false,
    tabs: [],
    activeTabIndex: '',
    messages: []
  },
  mutations: {
    setMenuOpenStatus: (state, status) => {
      state.menuOpenStatus = status
    },
    setTabItems: (state, tabItems) => {
      state.tabs = tabItems
    },
    appendTabbItem: (state, tabItem) => {
      const items = state.tabs.filter((r) => { return r.name === tabItem.name })
      if (items.length === 0) {
        state.tabs.push(tabItem)
      }
    },
    removeTabItem: (state, index) => {
      state.tabs.splice(state.tabs.findIndex(item => item.name === index), 1)
    },
    setActiveTabIndex (state, index) {
      state.activeTabIndex = index
    }
  },
  actions: {
    openMenu ({ commit }) {
      commit('setMenuOpenStatus', true)
    },
    hideMenu ({ commit }) {
      commit('setMenuOpenStatus', false)
    },
    appendTabItem ({ commit }, index) {
      const tabItem = findTab(index)
      if (tabItem.length > 0) {
        commit('appendTabbItem', tabItem[0])
      }
    },
    removeTabItem ({ commit }, index) {
      commit('removeTabItem', index)
    },
    setActiveTabIndex ({ commit }, index) {
      commit('setActiveTabIndex', index)
    },
    clearTab ({ commit }) {
      commit('setTabItems', [])
    }
  }
}

export default app
