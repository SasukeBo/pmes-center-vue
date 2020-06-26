import Center from '@/version2/pages/center'
import Home from '@/version2/pages/center/home'
import MaterialPage from '@/version2/pages/center/material'
import SizeAnalyze from '@/version2/pages/center/material/sizeAnalyze'
import ProductData from '@/version2/pages/center/material/productData'
import MaterialOverview from '@/version2/pages/center/material/MaterialOverview'

const centerRoutes = {
  path: '/center',
  name: 'data-center',
  component: Center,
  redirect: { name: 'materials' },
  children: [
    {
      path: 'materials',
      name: 'materials',
      component: Home
    },
    {
      path: 'material/:id/view',
      name: 'MaterialView',
      props: true,
      component: MaterialPage,
      redirect: { name: 'material-overview' },
      children: [
        {
          path: 'overview',
          name: 'material-overview',
          props: true,
          component: MaterialOverview
        },
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
}

export default centerRoutes
