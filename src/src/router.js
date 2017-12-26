import React from 'react'
import { Router, Route, Redirect } from 'dva/router'
import App from './modules/App'
import My from './modules/My'
import Demo from './modules/Demo'

function RouterConfig (props) {
  const {history, app} = props
  const {dispatch, getState} = app._store
  const state = getState()
  const {id, status} = state.my.myInfoModel.dataset || {}

  const checkLogin = (nextState, replace, callback) => {
    const next_url = location.href
    callback()
    // dispatch({
    //   type: 'my/checkLogin',
    //   payload: {cb: callback, next_url}
    // })
  }
  //onEnter={checkLogin}
  return (
    <Router history={history}>
      <Redirect from='/' to='/my' />
      <Route path='/login' component={App.pages.LoginPage} />
      <Route path='/logon' component={App.pages.LogonPage} />
      <Route path='/' component={App.pages.Layout} >
        {My.route(app)}
        {Demo.route}
      </Route>
      <Route path='*' component={App.pages.NotFoundPage} />
    </Router>
  )
}
export default RouterConfig
