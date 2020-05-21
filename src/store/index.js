import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: undefined,
    loginDialogVisible: false
  },
  mutations: {
    SET_LOGIN_DIALOG_VISIBLE(state, payload) {
      state.loginDialogVisible = payload
    },
    LOGIN(state, payload) {
      state.currentUser = payload
    }
  },
  actions: {},
  modules: {}
})
