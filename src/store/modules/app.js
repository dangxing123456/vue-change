import Cookies from 'js-cookie'
const state = {
  leftmenu: {
    opened: Cookies.get('leftmenuStatus') ? !!+Cookies.get('leftmenuStatus') : false,
    withoutAnimation: true
  },
  vShow:{opened:false}
}

const mutations = {
  TOGGLE_LEFTMENU: state => {
    state.leftmenu.opened = !state.leftmenu.opened
    state.leftmenu.withoutAnimation = true
    if (state.leftmenu.opened) {
      Cookies.set('leftmenuStatus', 1)
    } else {
      Cookies.set('leftmenuStatus', 0)
    }
  },
  CLOSE_LEFTMENU: (state, withoutAnimation) => {
    Cookies.set('leftmenuStatus', 0)
    state.leftmenu.opened = true
    state.leftmenu.withoutAnimation = withoutAnimation
  },
  TOGGLE_vShow: state => {
    state.vShow.opened=true
  }
}

const actions = {
  toggleLeftMenu({ commit }) {
    commit('TOGGLE_LEFTMENU')
  },
  closeLeftMenu({ commit }, { withoutAnimation }) {
    commit('CLOSE_LEFTMENU', withoutAnimation)
  },
  togglevShow({ commit }) {
    commit('TOGGLE_vShow')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
