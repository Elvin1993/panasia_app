import { Route, Switch } from 'dva/router'
import React from 'react'
import Any from './pages/Any'
import Apply from './pages/Apply'
import Classmate from './pages/Classmate'
import Classmates from './pages/Classmates'
import Classroom from './pages/Classroom'
import Confirm from './pages/Confirm'
import CourseList from './pages/CourseList'
import HomePage from './pages/HomePage'
import Liveroom from './pages/Liveroom'
import Success from './pages/PaySuccess'
import Trailer from './pages/Trailer'

const route = ({match}) => {
  return (
    <Switch>
      <Route path={`${match.url}`} component={HomePage} />
      <Route path={`${match.url}/trailer/:id`} component={Trailer} />
      <Route path={`${match.url}/liveroom`} exact component={Liveroom} />
      <Route path={`${match.url}/classroom/:id`} component={Classroom} />
      <Route path={`${match.url}/classmates`} exact component={Classmates} />
      <Route path={`${match.url}/classmate/:id`} component={Classmate} />
      <Route path={`${match.url}/course/:type`} component={CourseList} />
      <Route path={`${match.url}/apply`} exact component={Apply} />
      <Route path={`${match.url}/confirm/:id`} component={Confirm} />
      <Route path={`${match.url}/success/:type`} component={Success} />
      <Route path={`${match.url}/any`} exact component={Any} />
    </Switch>
  )
}

export default route
