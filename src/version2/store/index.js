import Vue from 'vue'
import Vuex from 'vuex'
import gql from 'graphql-tag'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: undefined
  },
  mutations: {
    LOGIN(state, payload) {
      state.currentUser = payload
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
