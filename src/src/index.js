import { Modal } from 'antd-mobile'
import autobind from 'autobind-decorator'
import 'babel-polyfill'
import dva, { connect } from 'dva'
import createLoading from 'dva-loading'
import { routerRedux, browserHistory, useRouterHistory } from 'dva/router'
import FastClick from 'fastclick'
// import createHashHistory from 'history/lib/createHashHistory'
import moment from 'moment'
import React from 'react'
import { reducer as formReducer } from 'redux-form'
import { InitWXConfig } from 'utils/WeiXin'
import './index.less'
import APIClient from './utils/APIClient'
import Config from './utils/Config'

moment.locale('zh-cn')

let BASE_PATH = '//api.zentrust.cn/test/mobile'
// let BASE_PATH = '//01.zxzc.co/mobile'
// let BASE_PATH = '.'

if (__PROD__) {
  BASE_PATH = '//api.zentrust.cn/mobile'
}
global.React = React
global.autobind = autobind
global.connect = connect
global.routerRedux = routerRedux
global.BASE_PATH = BASE_PATH
global.API = global.FetchAPI = new APIClient(BASE_PATH)
global.Config = Config

window.addEventListener('load', () => {
  FastClick.attach(document.body)
})

const initialState = {
  // count: {record: 2, current: 0}
}
// const history = useRouterHistory(createHashHistory)()
// const history = createHashHistory()

// 1. Initialize
const app = dva({
  initialState,
  // history,
  extraReducers: {
    form: formReducer
  },
  onError (ex) {
    console.error(ex.code, ex)
    switch (ex.code) {
      case -1001:
        const {origin, href} = window.location
        const path = {
          pathname: '/login',
          search: `?next_url=${encodeURIComponent(href)}`
        }
        window.location.href = `${origin}/?#${path.pathname}${path.search}`
        // console.log(window.location.href)
        // routerRedux.replace(path)
        break
      case -1000:
        Modal.alert(ex.message)
        break
      default:
        break
    }
  }
})

// 2. Plugins
const loadingPlugin = createLoading({
  namespace: 'loading'
})
app.use(loadingPlugin)

// 3. Model
app.models = (models) => {
  Object.keys(models).forEach(name => app.model(models[name]))
}
app.models(require('./models'))

// 4. Router
app.router(require('./router'))

// 5. Start
app.start('#root')

if (!__DEV__) {
  console.log(`>>>${__BRANCH__}@${__DATETIME__}<<<`)
}