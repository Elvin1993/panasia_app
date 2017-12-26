import 'babel-polyfill'
import autobind from 'autobind-decorator'
import dva, {connect} from 'dva'
import createLoading from 'dva-loading'
import {routerRedux, useRouterHistory} from 'dva/router'
import {Modal} from 'antd-mobile'
import FastClick from 'fastclick'
import {createHashHistory} from 'history'
import moment from 'moment'
import React from 'react'
import {reducer as formReducer} from 'redux-form'
import './index.less'
import APIClient from './utils/APIClient'
import Config from './utils/Config'

moment.locale('zh-cn')

let BASE_PATH = 'http://api.zentrust.cn/test/mobile'

if (__PROD__) {
  BASE_PATH = 'http://api.zentrust.cn/mobile'
}
global.React = React
global.autobind = autobind
global.connect = connect
global.routerRedux = routerRedux
global.BASE_PATH = BASE_PATH
global.API = global.FetchAPI = new APIClient(BASE_PATH)
global.Config = Config

const initialState = {
  count: {record: 2, current: 0}
}
const history = useRouterHistory(createHashHistory)({queryKey: false})
// 1. Initialize
const app = dva({
  initialState,
  history,
  extraReducers: {
    form: formReducer
  },
  onError (e) {
    if (e.code === -1000) {
      Modal.alert(e.message)
    }
    console.error('error!', e)
  }
})

// 2. Plugins
const loadingPlugin = createLoading({
  namespace: 'loading'
})
app.use(loadingPlugin)

window.addEventListener('load', () => {
  FastClick.attach(document.body)
})

// 3. Model
// app.model(require('./models/example'));
app.models = (models) => {
  Object.keys(models).forEach(name => app.model(models[name]))
}
app.models(require('./models'))

// 4. Router
app.router(require('./router'))

// 5. Start
if (__PROD__) {
  document.addEventListener('deviceready', () => {
    app.start('#root')
  })
} else {
  app.start('#root')
}

if (!__DEV__) {
  console.log(`>>>${__BRANCH__}@${__DATETIME__}<<<`)
}
