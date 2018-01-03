import { Route, Switch } from 'dva/router'
import React from 'react'
import IndexPage from './pages/IndexPage'
import InvoiceDetailPage from './pages/InvoiceDetailPage'
import InvoiceList from './pages/InvoiceList'
import MyActivityPage from './pages/MyActivityPage'
import MyCardsPage from './pages/MyCardsPage'
import MyInfoPage from './pages/MyInfoPage'
import MyOrderPage from './pages/MyOrder'
import MyStudying from './pages/MyStudying'
import MyStudyPage from './pages/MyStudyPage'
import VIPPage from './pages/VIPPage'

const route = ({match}) => {
  return (
    <Switch>
      <Route path={`${match.url}`} exact component={IndexPage} />
      <Route path={`${match.url}/info`} exact component={MyInfoPage} />
      <Route path={`${match.url}/activity`} exact component={MyActivityPage} />
      <Route path={`${match.url}/order`} exact component={MyOrderPage} />
      <Route path={`${match.url}/cards`} exact component={MyCardsPage} />
      <Route path={`${match.url}/edu`} exact component={MyStudyPage} />
      <Route path={`${match.url}/edu/studying`} exact component={MyStudying} />
      <Route path={`${match.url}/edu/invoice`} exact component={InvoiceList} />
      <Route path={`${match.url}/edu/invoice/detail`} exact component={InvoiceDetailPage} />
      <Route path={`${match.url}/edu/vip`} exact component={VIPPage} />
    </Switch>
  )
}
export default route
