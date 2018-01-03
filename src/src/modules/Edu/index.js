import { Route, Switch } from 'dva/router'
import React from 'react'
import CourseList from './pages/CourseCategoryList'
import CourseDetailPage from './pages/CourseDetailPage'
import IndexPage from './pages/IndexPage'
import SearchCoursePage from './pages/SearchCoursePage'
import SeriesCourse from './pages/SeriesCourse'
import Special from './pages/Special'

const route = ({match}) => (
  <Switch>
    <Route path={`${match.url}`} exact component={IndexPage} />
    <Route path={`${match.url}/search`} exact component={SearchCoursePage} />
    <Route path={`${match.url}/course/:id`} exact component={CourseList} />
    <Route path={`${match.url}/series/:id`} exact component={SeriesCourse} />
    <Route path={`${match.url}/special/:id`} exact component={Special} />
    <Route path={`${match.url}/video/:id`} component={CourseDetailPage} />
  </Switch>
)

export default route
