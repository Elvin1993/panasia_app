import React from 'react'
import {Route, IndexRoute} from 'dva/router'
import IndexPage from './pages/IndexPage'

const route = (app) => {
  return (
    <Route path='/my'>
      <IndexRoute component={IndexPage}/>
      <Route path='info' component={IndexPage}/>
    </Route>
  )
}

export default {
  route
}
