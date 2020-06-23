import { Message } from 'element-ui'
const GraphQLError = function(error) {
  var message = error.message.replace('GraphQL error: ', '')
  Message({ type: 'error', message })
}

export default GraphQLError
