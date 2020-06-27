import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Home from '@/version1/pages/home.vue'
// import MaterialView from '../views/MaterialView.vue'
import MaterialView from '@/version1/pages/material/index.vue'
import MaterialOverview from '@/version1/pages/material/overview'
import MaterialDevices from '@/version1/pages/material/device'
import DeviceView from '@/version1/pages/device/index.vue'

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
    component: MaterialView,
    redirect: { name: 'material-overview' },
    children: [
      {
        path: 'overview',
        name: 'material-overview',
        props: true,
        component: MaterialOverview
      },
      {
        path: 'devices',
        name: 'material-device',
        props: true,
        component: MaterialDevices
      }
    ]
  },
  {
    path: '/devices/:id/view',
    name: 'device-view',
    props: true,
    component: DeviceView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
