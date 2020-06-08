import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Home from '@/version1/pages/home.vue'
// import MaterialView from '../views/MaterialView.vue'
import MaterialView from '@/version1/pages/material/index.vue'
import SizeAnalyze from '@/version1/pages/material/sizeAnalyze.vue'
import ProductData from '@/version1/pages/material/productData.vue'

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
    path: '/material/:id/view',
    name: 'MaterialView',
    props: true,
    component: MaterialView,
    redirect: { name: 'size-analyze' },
    children: [
      {
        path: 'size-analyze',
        name: 'size-analyze',
        props: true,
        component: SizeAnalyze
      },
      {
        path: 'product-data',
        name: 'product-data',
        props: true,
        component: ProductData
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
