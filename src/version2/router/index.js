import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/version2/index.vue'
import Center from '@/version2/pages/center'
import Console from '@/version2/pages/admin'
import Material from '@/version2/pages/admin/material/index.vue'
import MaterialListView from '@/version2/pages/admin/material/listview.vue'
import Device from '@/version2/pages/admin/device.vue'
import MaterialCreate from '@/version2/pages/admin/material/createform.vue'
import MaterialImportRecord from '@/version2/pages/admin/material/importrecord.vue'
import MaterialDecodeTemplate from '@/version2/pages/admin/material/decode-template'

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
        path: 'material',
        name: 'console-materials',
        meta: { name: '料号管理' },
        component: Material,
        redirect: { name: 'console-material-listview' },
        children: [
          {
            path: 'listview',
            name: 'console-material-listview',
            meta: { name: '料号列表' },
            component: MaterialListView
          },
          {
            path: 'new',
            name: 'console-material-create',
            meta: { name: '新增料号' },
            component: MaterialCreate
          },
          {
            path: ':id/import_records',
            name: 'console-material-import-record',
            meta: { name: '导入记录' },
            props: true,
            component: MaterialImportRecord
          },
          {
            path: ':id/decode_templates',
            name: 'console-material-decode-template',
            meta: { name: '解析模板' },
            props: true,
            component: MaterialDecodeTemplate
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
