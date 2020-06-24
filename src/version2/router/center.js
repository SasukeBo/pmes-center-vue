import Center from '@/version2/pages/center'
import Home from '@/version2/pages/center/home'
import MaterialView from '@/version2/pages/center/material/view'
import SizeAnalyze from '@/version2/pages/center/material/sizeAnalyze'
import ProductData from '@/version2/pages/center/material/productData'

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
}

export default centerRoutes
