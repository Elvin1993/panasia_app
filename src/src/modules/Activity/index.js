import { Route, Switch } from 'dva/router'

import React from 'react'
import AgendaPage from './pages/AgendaPage'
import ApplyPage from './pages/ApplyPage'
import DetailLayoutPage from './pages/DetailLayoutPage'
import IndexPage from './pages/IndexPage'
import Layout from './pages/Layout'
import SearchActivityPage from './pages/SearchActivityPage'

const route = ({match}) => {

  const checkLogin = (nextState, replace, callback) => {
    const next_url = location.href
    const {dispatch} = app._store
    dispatch({
      type: 'my/checkLogin',
      payload: {cb: callback, next_url}
    })
  }

  return (
    <Layout>
      <Switch>
        <Route path={`${match.url}`} exact component={IndexPage} />
        <Route path={`${match.url}/search`} exact component={SearchActivityPage} />
        <CheckLoginRoute path={`${match.url}/:aid/apply`} exact component={ApplyPage} onEnter={checkLogin} />
        <Route path={`${match.url}/:aid`} exact component={DetailLayoutPage} />
        <Route path={`${match.url}/agenda/:aid`} component={AgendaPage} onEnter={checkLogin} />
      </Switch>
    </Layout>
  )
}

export default route

/*
const route = (app) => {
  const checkLogin = (nextState, replace, callback) => {
    const next_url = location.href
    const {dispatch} = app._store
    dispatch({
      type: 'my/checkLogin',
      payload: {cb: callback, next_url}
    })
  }
  return (
    <Route path='/activity' component={Layout}>
      <IndexRoute breadcrumbName='活动' component={IndexPage} />
      <Route path='search' component={SearchActivityPage} />
      <Route path=':aid' component={DetailLayoutPage} />
      <Route path=':aid/apply' component={ApplyPage} onEnter={checkLogin} />
      <Route path='agenda/:aid' component={AgendaPage} onEnter={checkLogin} />
    </Route>
  )
}

export default {
  route,
  pages: {
    AgendaPage,
    ApplyPage
  }
}
*/
