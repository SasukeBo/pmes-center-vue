import Console from '@/version2/pages/admin'
import Material from '@/version2/pages/admin/material/index.vue'
import MaterialListView from '@/version2/pages/admin/material/list-view.vue'
import Points from '@/version2/pages/admin/material/points.vue'
import MaterialEdit from '@/version2/pages/admin/material/edit-form.vue'
import MaterialCreate from '@/version2/pages/admin/material/create-form.vue'
import MaterialImportRecord from '@/version2/pages/admin/material/import-record.vue'
import MaterialDecodeTemplate from '@/version2/pages/admin/material/decode-template'

import Device from '@/version2/pages/admin/device/index.vue'
import DeviceListView from '@/version2/pages/admin/device/list-view.vue'
import DeviceImportRecord from '@/version2/pages/admin/device/import-record.vue'

import DataImport from '@/version2/pages/admin/data-import/index.vue'

const adminRoutes = {
  path: '/console',
  name: 'console',
  meta: { name: '数据中心后台管理' },
  redirect: { name: 'console-materials' },
  component: Console,
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
          path: ':id/edit',
          name: 'console-material-edit',
          meta: { name: '编辑料号' },
          props: true,
          component: MaterialEdit
        },
        {
          path: ':id/points',
          name: 'console-material-points',
          meta: { name: '检测项' },
          props: true,
          component: Points
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
      component: Device,
      redirect: { name: 'console-device-listview' },
      children: [
        {
          path: 'listview',
          name: 'console-device-listview',
          meta: { name: '设备列表' },
          component: DeviceListView
        },
        {
          path: ':id/import_records',
          name: 'console-device-import-record',
          meta: { name: '导入记录' },
          props: true,
          component: DeviceImportRecord
        }
      ]
    },
    {
      path: 'data-import',
      name: 'data-import',
      meta: { name: '数据导入' },
      component: DataImport
    }
  ]
}

export default adminRoutes
