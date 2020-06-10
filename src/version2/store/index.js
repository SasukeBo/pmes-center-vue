import Vue from 'vue'
import Vuex from 'vuex'
import gql from 'graphql-tag'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: undefined,
    pageTitle: ''
  },
  mutations: {
    LOGIN(state, payload) {
      state.currentUser = payload
    },
    SET_PAGE_TITLE(state, payload) {
      state.pageTitle = payload
    }
  },
  actions: {
    fetchCurrentUser(context, app) {
      return app.$apollo.query({
        query: gql`
          query {
            response: currentUser {
              id
              uuid
              account
              isAdmin
            }
          }
        `
      })
    }
  },
  modules: {}
})
