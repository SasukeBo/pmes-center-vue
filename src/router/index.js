import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '../store'
import Index from '@/index.vue'
import adminRoutes from './admin'
import centerRoutes from './center'
import ErrorPage from '@/pages/errorPage'
import LoginPage from '@/pages/login/login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: { name: 'data-center' },
    component: Index
  },
  centerRoutes,
  adminRoutes,
  {
    path: '/login',
    name: 'login-page',
    component: LoginPage
  },
  {
    path: '/*',
    name: 'error-page',
    component: ErrorPage
  }
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
