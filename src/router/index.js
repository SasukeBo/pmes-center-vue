import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MaterialView from '../views/MaterialView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'Materials' }
  },
  {
    path: '/materials',
    name: 'Materials',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/material/:id/view',
    name: 'MaterialView',
    props: true,
    component: MaterialView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
