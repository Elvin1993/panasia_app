import React from 'react'
import { Route, IndexRoute } from 'dva/router'
import IndexPage from './pages/IndexPage'
import MyActivityPage from './pages/MyActivityPage'
import MyInfoPage from './pages/MyInfoPage'
import MyCardsPage from './pages/MyCardsPage'
import MyOrder from './pages/MyOrder'
import MyStudyPage from './pages/MyStudyPage'
import MyStudying from './pages/MyStudying'
import InvoiceList from './pages/InvoiceList'
import InvoiceDetailPage from './pages/InvoiceDetailPage'
import VIPPage from './pages/VIPPage'

const route = (app) => {
  const checkLogin = (nextState, replace, callback) => {
    const next_url = location.href
    const {dispatch, getState} = app._store
    const state = getState()
    const logined = () => {
      const {status} = state.my.myInfoModel.dataset || {}
      if (status !== 'WEIXIN') {
        callback()
      } else {
        dispatch({type: 'my/Logined', payload: {cb: callback}})
      }
    }

    logined()
    // dispatch({
    //   type: 'my/checkLogin',
    //   payload: {cb: logined, next_url}
    // })
  }

  const handlePay = (nextState, replace, callback) => {
    if (window.location.href.indexOf('?#') < 0) {
      window.location.href = window.location.href.replace('#', '?#')
    }
    return callback()
  }

  return (
    <Route path='/my'>
      <IndexRoute component={IndexPage} />
      <Route path='info' component={MyInfoPage} />
      <Route path='activity' component={MyActivityPage} />
      <Route path='order' component={MyOrder} />
      <Route path='cards' component={MyCardsPage} />
      <Route path='edu'>
        <IndexRoute component={MyStudyPage} />
        <Route path='studying' component={MyStudying} />
        <Route path='invoice' component={InvoiceList} />
        <Route path='invoice/detail' component={InvoiceDetailPage} />
        <Route path='vip' component={VIPPage} onEnter={handlePay} />
      </Route>
    </Route>
  )
}

export default {
  route
}
