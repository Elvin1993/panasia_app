import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import autobind from 'autobind-decorator'
import Spinner from 'components/Spinner'
import styles from './Guests.less'
import UserList from 'components/UserList'

@connect(state => ({
  ...state.activity.guestList,
  loading: state.loading.global
}))
@autobind
export default class ActivityGuests extends React.Component {
  static propTypes = {}

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const {dispatch, match: {params: {aid}}, dataset = []} = this.props
    if (!aid || dataset.length > 0) {
      return
    }

    dispatch({
      type: 'activity/fetchActivityGuest',
      payload: {params: {current: 1, search: {aid}}}
    })
  }

  handlerScrollToBottom (cb) {
    const {match: {params: {aid}}, dispatch, size, current, total} = this.props
    if (current * size > total) {
      return cb()
    }
    const params = {current: current + 1, search: {aid}}

    dispatch({type: 'activity/fetchActivityGuest', payload: {params, cb}})
  }

  handlerLink (uid) {
    const {dispatch} = this.props
    dispatch(routerRedux.push(`/user/${uid}`))
  }

  render () {
    const {dataset = [], loading} = this.props
    return (
      <div className={styles.guests}>
        {(dataset.length <= 0 && loading) ? <Spinner loading mask={false} /> : <UserList dataset={dataset} loading={loading} onScrollToBottom={this.handlerScrollToBottom} onLink={this.handlerLink} />}
      </div>
    )
  }
}

// export default connect(state => ({count: state.count}))(HomePage);
