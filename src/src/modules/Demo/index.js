import { Switch, Route } from 'dva/router'
import React from 'react'
import CalcPage from './pages/CalcPage'
import CountPage from './pages/CountPage'
import FormPage from './pages/FormPage'
import IndexPage from './pages/IndexPage'

import Layout from './pages/Layout'
import VideoPlay from './pages/VideoPlay'

const route = ({match}) => {
  return (
    <Layout>
      <Switch>
        <Route path={`${match.url}`} exact component={IndexPage} />
        <Route path={`${match.url}/count`} exact component={CountPage} />
        <Route path={`${match.url}/calc`} exact component={CalcPage} />
        <Route path={`${match.url}/form`} exact component={FormPage} />
        <Route path={`${match.url}/video`} exact component={VideoPlay} />
      </Switch>
    </Layout>
  )
}
export default route
