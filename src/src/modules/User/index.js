
import React from 'react'
import { Route, Switch } from 'dva/router'
import DetailPage from './pages/DetailPage'
import SigninPage from './pages/SigninPage'
import CheckPage from './pages/CheckPage'



const route = ({match}) => {
  const checkSignin = (nextState, replace, callback) => {
    const {params: {aid, sec}} = nextState
    const next_url = location.href
    const {dispatch} = app._store

    dispatch({
      type: 'my/checkLogin',
      payload: {next_url}
    })

    dispatch({
      type: 'user/checkNext',
      payload: {cb: callback, params: {aid, sec}, next_url}
    })
  }

  const checkLogin = (nextState, replace, callback) => {
    const next_url = location.href
    const {dispatch} = app._store

    dispatch({
      type: 'my/checkLogin',
      payload: {cb: callback, next_url}
    })
  }



  return (
    <Switch>
      <Route path={`${match.url}/signin/:aid/:sec`} exact component={SigninPage} onEnter={checkSignin} />
      <Route path={`${match.url}/check/:aid/:sec`} exact component={CheckPage} />
      <Route path={`${match.url}/:uid`} component={DetailPage} onEnter={checkLogin} />
    </Switch>
  )
}
export default route



/*
import React from 'react'
import { Route, IndexRoute } from 'dva/router'
import DetailPage from './pages/DetailPage'
import SigninPage from './pages/SigninPage'
import CheckPage from './pages/CheckPage'

const route = (app) => {
  const checkSignin = (nextState, replace, callback) => {
    const {params: {aid, sec}} = nextState
    const next_url = location.href
    const {dispatch} = app._store

    dispatch({
      type: 'my/checkLogin',
      payload: {next_url}
    })

    dispatch({
      type: 'user/checkNext',
      payload: {cb: callback, params: {aid, sec}, next_url}
    })
  }

  const checkLogin = (nextState, replace, callback) => {
    const next_url = location.href
    const {dispatch} = app._store

    dispatch({
      type: 'my/checkLogin',
      payload: {cb: callback, next_url}
    })
  }

  return (
    <Route path='/user'>
      <Route path='signin/:aid/:sec' component={SigninPage} onEnter={checkSignin} />
      <Route path='check/:aid/:sec' component={CheckPage} />
      <Route path=':uid' component={DetailPage} onEnter={checkLogin} />
    </Route>
  )
}

export default {
  route
}
*/
