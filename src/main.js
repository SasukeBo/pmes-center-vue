import Vue from 'vue'
// import App from './App.vue'
import Theme1 from './theme1/index.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import { createProvider } from './vue-apollo'
import 'babel-polyfill'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: (h) => h(Theme1)
}).$mount('#app')
