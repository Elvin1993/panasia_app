import { Route, Switch } from 'dva/router'
import React from 'react'
import CheckLoginRoute from '../../components/CheckLoginRoute'
import BookPayPage from './pages/BookPayPage'
import IndexPage from './pages/IndexPage'
import PayResult from './pages/PayResult'

const route = ({match}) => {
  return (
    <Switch>
      <CheckLoginRoute path={`${match.url}/order/:id`} component={PayResult} />
      <CheckLoginRoute path={`${match.url}/:id/pay`} component={BookPayPage} />
      <Route path={`${match.url}/:id`} component={IndexPage} />
    </Switch>
  )
}

export default route
