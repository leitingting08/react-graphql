import { lazy } from 'react'
import { RouteProp } from 'src/interface'

const rootRoute: RouteProp[] = [
  {
    path: '/',
    breadcrumbName: 'Home',
    component: lazy(() => import('src/pages/home/index')),
    children: [
      {
        path: '/launch',
        breadcrumbName: 'launch',
        component: lazy(() => import('src/pages/launch/index')),
        children: [{ path: '/launch/list', component: lazy(() => import('src/pages/launch/list/index')) }]
      }
    ]
  }
]

export default rootRoute
