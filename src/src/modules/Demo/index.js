import React from 'react'
import { IndexRoute, Route } from 'dva/router'
import DemoModel from './models/DemoModel'
import CountModel from './models/CountModel'

import Layout from './pages/Layout'
import IndexPage from './pages/IndexPage'
import CountPage from './pages/CountPage'
import CalcPage from './pages/CalcPage'
import FormPage from './pages/FormPage'

const route = (
  <Route path='/demo' components={Layout}>
    <IndexRoute component={IndexPage} />
    <Route path='count' component={CountPage} />
    <Route path='calc' component={CalcPage} />
    <Route path='form' component={FormPage} />
  </Route>
)

/*

const IndexPage = Loadable({
  LoadingComponent,
  loader: () => new Promise(resolve =>
    require.ensure([], (require) => {
      resolve(require('./pages/IndexPage'))
    }, 'Demo')
  )
})

const CountPage = Loadable({
  LoadingComponent,
  loader: () => System.import('./pages/CountPage')
})

const route = (
  <Route path="/demo" components={Layout}>
    <IndexRoute component={require('react-router?name=Demo!./pages/IndexPage')} />
    <Route path="count" component={require('react-router?name=Demo!./pages/CountPage')} />
  </Route>
)
*/

export default {
  route,
  models: {
    DemoModel,
    CountModel
  }
  // pages: { //非必须
  //   CountPage,
  //   FormPage,
  //   CalcPage
  // },
}
