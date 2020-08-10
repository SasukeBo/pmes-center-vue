import Console from '@//pages/admin'
import Material from '@//pages/admin/material/index.vue'
import MaterialListView from '@//pages/admin/material/list-view.vue'
import Points from '@//pages/admin/material/points.vue'
import MaterialEdit from '@//pages/admin/material/edit-form.vue'
import MaterialCreate from '@//pages/admin/material/create-form.vue'
import MaterialImportRecord from '@//pages/admin/material/import-record.vue'
import MaterialVersion from '@//pages/admin/material/material_version'
import DeviceListView from '@//pages/admin/material/device/list-view.vue'
import DataImport from '@//pages/admin/data-import/index.vue'
import SystemConfig from '@//pages/admin/config/index.vue'
import BarCodeRule from '@//pages/admin/barcode-rule/index.vue'

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
          path: ':id/versions',
          name: 'console-material-versions',
          meta: { name: '版本列表' },
          props: true,
          component: MaterialVersion
        },
        {
          path: ':id/versions/:versionID/points',
          name: 'console-material-versions__points',
          meta: { name: '尺寸或点位' },
          props: true,
          component: Points
        },
        {
          path: ':id/versions/:versionID/import_records',
          name: 'console-material-versions__import-records',
          meta: { name: '导入记录' },
          props: true,
          component: MaterialImportRecord
        },
        {
          path: ':id/devices',
          name: 'console-material-devices',
          props: true,
          meta: { name: '设备管理' },
          component: DeviceListView
        }
      ]
    },
    {
      path: 'data-import',
      name: 'data-import',
      meta: { name: '数据导入' },
      component: DataImport
    },
    {
      path: 'system-config',
      name: 'system-config',
      meta: { name: '系统配置' },
      component: SystemConfig
    },
    {
      path: 'barcode-rule',
      name: 'admin-barcode-rule',
      meta: { name: '编码规则' },
      component: BarCodeRule
    }
  ]
}

export default adminRoutes
