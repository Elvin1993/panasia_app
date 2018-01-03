import { connect } from 'dva'
import dynamic from 'dva/dynamic'
import { routerRedux, Redirect, Route, Router, Switch } from 'dva/router'
import React, { Component } from 'react'
import { processHistory } from 'utils/shim-router'
import CheckLoginRoute from './components/CheckLoginRoute'
import Activity from './modules/Activity'
import App from './modules/App'
import Article from './modules/Article'
import Edu from './modules/Edu'
import My from './modules/My'

// import Migrate from './modules/Migrate'
// import Demo from './modules/Demo'
const {ConnectedRouter} = routerRedux
const {BlankLayout, Layout} = App.pages

const RouterConfig = ({history, app}) => {
  // const {dispatch, getState} = app._store
  // const state = getState()
  // const {id, status} = state.my.myInfoModel.dataset || {}

  /*
  const Article = dynamic({
    app,
    component: () => import('./modules/Article/pages/index')
  })

  const Activity = dynamic({
    app,
    component: () => import('./modules/Activity')
  })

  const Edu = dynamic({
    app,
    component: () => import('./modules/Edu')
  })

  */

  const Shop = dynamic({
    app,
    models: () => [
      import('./modules/Shop/models/ShopModel')
    ],
    component: () => import('./modules/Shop')
  })

  const User = dynamic({
    app,
    models: () => [
      import('./modules/User/models/UserModel')
    ],
    component: () => import('./modules/User')
  })

  const Migrate = dynamic({
    app,
    models: () => [
      import('./modules/Migrate/models/MigrateModel')
    ],
    component: () => import('./modules/Migrate')
  })

  const College = dynamic({
    app,
    models: () => [
      import('./modules/College/models/CollegeModel')
    ],
    component: () => import('./modules/College')
  })

  const Demo = dynamic({
    app,
    models: () => [
      import('./modules/Demo/models/DemoModel')
    ],
    component: () => import('./modules/Demo')
  })

  history = processHistory(history) //兼容2/3
  return (
    <ConnectedRouter history={history}>
      <div className='app'>
        <Switch>
          <Route exact path='/login' component={App.pages.LoginPage} />
          <Route exact path='/logon' component={App.pages.LogonPage} />
          <Route exact path='/' render={() => <Redirect to='/login' component={App.pages.LoginPage} />} />
          <Route path='/article' component={Article} />
          <CheckLoginRoute path='/activity' component={Activity} />
          <Route path='/edu' component={Edu} />
          <CheckLoginRoute path='/my' component={My} />
          <CheckLoginRoute path='/college' component={College} />
          <Route path='/shop' component={Shop} />
          <CheckLoginRoute path='/user' component={User} />
          <CheckLoginRoute path='/migrate' component={Migrate} />
          <Route path='/demo' component={Demo} />
          <Route component={App.pages.NotFoundPage} />
        </Switch>
      </div>
    </ConnectedRouter>
  )
}

export default RouterConfig
