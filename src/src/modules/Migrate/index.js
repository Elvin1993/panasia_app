import React from 'react'
import { Route, Switch } from 'dva/router'
import IndexPage from './pages/IndexPage'
import CheckPage from './pages/CheckPage'
import SuccessPage from './pages/SuccessPage'

const route = ({match}) => {

  const checkLogin = (nextState, replace, callback) => {
    const next_url = location.href
    const {dispatch, getState} = app._store
    const state = getState()

    dispatch({
      type: 'my/checkLogin',
      payload: {cb: callback, next_url}
    })
  }

  return (
    <Switch>
      <Route path={`${match.url}`} component={IndexPage} />
      <Route path={`${match.url}/check`} component={CheckPage} onEnter={checkLogin} />
      <Route path={`${match.url}/success`} component={SuccessPage} />
    </Switch>
  )
}

export default route
