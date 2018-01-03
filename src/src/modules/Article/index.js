import { Route, Switch } from 'dva/router'
import React from 'react'
import ArticleDetailPage from './pages/DetailPage'
import IndexPage from './pages/IndexPage'
import SearchArticlePage from './pages/SearchArticlePage'
import CheckLoginRoute from '../../components/CheckLoginRoute'

const route = ({match}) => {

  return (
    <Switch>
      <Route path={`${match.url}`} exact component={IndexPage} />
      <Route path={`${match.url}/search`} exact component={SearchArticlePage} />
      <CheckLoginRoute path={`${match.url}/detail/:id`} exact component={ArticleDetailPage} />
      <Route path={`${match.url}/:id`} component={ArticleDetailPage} />
    </Switch>
  )
}
export default route
