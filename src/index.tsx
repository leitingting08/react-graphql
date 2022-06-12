import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import routes from 'src/routes/index'
import { RouteProp } from 'src/interface/index'
import App from 'src/pages/App'
import NotFound from 'src/pages/notFound'
import { ApolloClient, NormalizedCacheObject, ApolloProvider } from '@apollo/client'
import { cache } from './cache'
import 'antd/dist/antd.css'

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  uri: 'https://api.spacex.land/graphql'
})

const createRoute: any = (routesArr: RouteProp[]) => {
  return routesArr.reduce((pre: RouteProp[], cur: RouteProp) => {
    return [...pre, cur, ...(cur.children ? createRoute(cur.children) : [])]
  }, [])
}

const createBasicRoute = (
  route: { path: string; component: React.LazyExoticComponent<() => JSX.Element> },
  index: React.Key | null | undefined
) => {
  //  最基础的Router 用法
  const { path, component: Component } = route
  return (
    <Route
      exact
      key={index}
      path={path}
      component={(props: JSX.IntrinsicAttributes) => {
        return (
          <App>
            <Component {...props} />
          </App>
        )
      }}
    />
  )
}

const RouteApp = () => {
  return (
    <HashRouter>
      <Switch>
        {createRoute(routes).map((route: RouteProp, index: number) => createBasicRoute(route, index))}
        <Route path="/notFound" component={NotFound} />
        <Redirect to="/notFound" />
      </Switch>
    </HashRouter>
  )
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <RouteApp />
  </ApolloProvider>,
  document.querySelector('#app')
)
