import { connect } from 'dva'
import { routerRedux, Redirect, Route, Router, Switch } from 'dva/router'

import React, { Component } from 'react'

@connect()
export default class CheckLoginRoute extends Component {
  state = {
    checked: false
  }

  componentWillMount () {
    const next_url = location.href
    const {dispatch} = this.props
    dispatch({
      type: 'my/checkLogin',
      payload: {next_url}
    }).then((r) => {
      if (r.code !== 0) {
        return false
      }
      this.setState({
        checked: true
      })
    })
  }

  render () {
    const {checked} = this.state
    const {component, exact = false, path} = this.props
    if (!checked) {
      return null
    }
    return (
      <Route
        exact={exact}
        path={path}
        render={(props) => React.createElement(component, props)}
      />
    )
  }
}
