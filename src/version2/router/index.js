import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/version2/index.vue'
import Center from '@/version2/pages/center'
import Console from '@/version2/pages/admin'
import Material from '@/version2/pages/admin/material.vue'
import MaterialListView from '@/version2/pages/admin/material_listview.vue'
import Device from '@/version2/pages/admin/device.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'data-center' },
    component: Index
  },
  {
    path: '/center',
    name: 'data-center',
    component: Center
  },
  {
    path: '/console',
    name: 'console',
    meta: { name: '数据中心后台管理' },
    redirect: { name: 'console-materials' },
    component: Console,
    beforeEnter(to, from, next) {
      setTimeout(() => {
        router.app.$store
          .dispatch('fetchCurrentUser', router.app)
          .then(({ data: { response } }) => {
            if (response.isAdmin) {
              next()
            } else {
              alert('sorry，you are not admin')
              next(false)
            }
          })
          .catch((e) => {
            alert(e.message.replace('GraphQL error:', ''))
            next({ path: '/' })
          })
      }, 200)
    },
    children: [
      {
        path: 'materials',
        name: 'console-materials',
        meta: { name: '料号管理' },
        component: Material,
        redirect: { name: 'console-materials-listview' },
        children: [
          {
            path: 'listview',
            name: 'console-materials-listview',
            meta: { name: '料号列表' },
            component: MaterialListView
          }
        ]
      },
      {
        path: 'devices',
        name: 'console-devices',
        meta: { name: '设备管理' },
        component: Device
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
