import Vue from 'vue'
import entry from './index.vue'
import router from './router'
import store from './store'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import { createProvider } from './vue-apollo'
import 'babel-polyfill'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

Vue.use(VXETable)
Vue.prototype.$XModal = VXETable.modal
Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: (h) => h(entry)
}).$mount('#app')
