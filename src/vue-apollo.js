import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { Message } from 'element-ui'
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'

// Install the vue plugin
Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token'

// const APIHost =
//   process.env.NODE_ENV === 'production' ? '192.168.5.146' : 'localhost'

// const httpEndpoint = 'http://' + APIHost + '/api/v1'
const httpEndpoint = '/api/v1'

// Files URL root
export const filesRoot =
  process.env.VUE_APP_FILES_ROOT ||
  httpEndpoint.substr(0, httpEndpoint.indexOf('/api/v1'))

Vue.prototype.$filesRoot = filesRoot

// Config
const defaultOptions = {
  httpEndpoint,
  httpLinkOptions: {
    headers: {
      Lang: 'zh_cn'
    }
  },
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  // link: myLink

  // Override default cache
  // cache: myCache

  // Override the way the Authorization header is set
  // getAuth: (tokenName) => ...

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
}

const adminOptions = {
  // httpEndpoint: 'http://' + APIHost + '/api/v1/admin'
  httpEndpoint: '/api/v1/admin'
}

// Call this in the Vue app file
export function createProvider(options = {}) {
  const adminClient = createApolloClient({
    ...defaultOptions,
    ...adminOptions,
    ...options
  })
  // adminClient.apolloClient.wsClient = adminClient.wsClient

  // Create apollo client
  const defaultClient = createApolloClient({
    ...defaultOptions,
    ...options
  })
  // apolloClient.wsClient = wsClient

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    clients: {
      adminClient: adminClient.apolloClient,
      defaultClient: defaultClient.apolloClient
    },
    defaultClient: defaultClient.apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      }
    },
    errorHandler(error, vm) {
      Message.closeAll()
      vm.$GraphQLError(error)
    }
  })

  return apolloProvider
}
