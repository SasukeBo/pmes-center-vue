import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Home from '@/version1/pages/home.vue'
// import MaterialView from '../views/MaterialView.vue'
import MaterialView from '@/version1/pages/material/index.vue'
import MaterialOverview from '@/version1/pages/material/overview'
import MaterialDevices from '@/version1/pages/material/device'
import MaterialSizes from '@/version1/pages/material/size'
import DeviceView from '@/version1/pages/device/index.vue'
import SizeView from '@/version1/pages/size/index.vue'
import AdminPage from '@/version1/pages/admin'
import AdminImportRecords from '@/version1/pages/admin/records.vue'

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
        path: 'sizes',
        name: 'material-size',
        props: true,
        component: MaterialSizes
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
  },
  {
    path: '/sizes/:id/view',
    name: 'size-view',
    props: true,
    component: SizeView
  },
  {
    path: '/admin',
    name: 'admin-page',
    component: AdminPage
  },
  {
    path: '/admin/material/:id/import_records',
    name: 'admin-import-records',
    props: true,
    component: AdminImportRecords
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
