import React from 'react'
import { connect } from 'dva'
import Spinner from 'components/Spinner'

@connect(state => ({
  loading: state.loading.global
}))
@autobind
export default class AppLayout extends React.Component {
  constructor (props) {
    super(props)
    const {dispatch} = props
  }

  render () {
    const {children} = this.props
    return (
      <div className='app'>
        {children}
      </div>
    )
  }
}
