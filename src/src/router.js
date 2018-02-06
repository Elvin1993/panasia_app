import React from 'react'
import {Router, Route, Redirect} from 'dva/router'
import App from './modules/App'
import My from './modules/My'
import Demo from './modules/Demo'

function RouterConfig(props) {
  const {history, app} = props
  // const {getState} = app._store
  // const state = getState()
  // const checkLogin = (nextState, replace, callback) => {
  //   const next_url = location.href
  //   callback()
  //   // dispatch({
  //   //   type: 'my/checkLogin',
  //   //   payload: {cb: callback, next_url}
  //   // })
  // }
  // onEnter={checkLogin}
  return (
    <Router history={history}>
      <Route path='/login' component={App.pages.LoginPage} />
      <Redirect from='/' to='/my' />
      <Route path='/' component={App.pages.Layout}>
        {My.route(app)}
        {Demo.route}
      </Route>
      <Route path='*' component={App.pages.NotFoundPage} />
    </Router>
  )
}
export default RouterConfig
