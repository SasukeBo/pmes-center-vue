import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '../store'
import Index from '@/version2/index.vue'
import adminRoutes from './admin'
import centerRoutes from './center'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'data-center' },
    component: Index
  },
  centerRoutes,
  adminRoutes
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to, from) => {
  Store.commit('SET_PAGE_TITLE', '')
})

export default router
