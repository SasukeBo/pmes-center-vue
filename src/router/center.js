import Center from '@/pages/center'
import Home from '@/pages/center/home'
import MaterialView from '@/pages/center/material'
import MaterialOverview from '@/pages/center/material/overview'
import MaterialSizes from '@/pages/center/material/size'
import MaterialDevices from '@/pages/center/material/device'
import DeviceView from '@/pages/center/device'
import SizeView from '@/pages/center/size'

const centerRoutes = {
  path: '/center',
  name: 'data-center',
  component: Center,
  redirect: { name: 'data-center-home' },
  children: [
    {
      path: 'home',
      name: 'data-center-home',
      component: Home
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
    }
  ]
}

export default centerRoutes
