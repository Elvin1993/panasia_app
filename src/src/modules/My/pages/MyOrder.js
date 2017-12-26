import React from 'react'
import { Link, routerRedux } from 'dva/router'
import Nav from 'components/Nav'
import OrderList from 'components/OrderList'

import Spinner from 'components/Spinner'
import styles from './MyOrder.less'

@connect(state => ({
  ...state.my.myOrderHistory,
  loading: state.loading.global
}))
@autobind
export default class extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const {dispatch, size, dataset} = this.props
    // if(dataset.length <= 0) {
    dispatch({
      type: 'my/fetchOrderHistory',
      params: {size, current: 1}
    })
    // }
  }

  handlerScrollToBottom (cb) {
    const {dispatch, size, current, total} = this.props
    if (current * size > total) {
      return cb()
    }
    const params = {size, current: current + 1}
    dispatch({type: 'my/fetchOrderHistory', payload: {params, cb}})
  }

  handlerClick (id) {
    if (!id) {
      return
    }
    const {dispatch} = this.props
    dispatch(routerRedux.push({
      pathname: `/edu/video/${id}`
    }))
  }

  render () {
    let {loading, dataset} = this.props
    const header = <Nav left={<Link to='/my'><i className='icon icon-arrows-left' /></Link>} center='购买记录' />

    return (
      <div className='page'>
        <div className={styles.my_order_page}>
          {dataset.length > 0
            ? <OrderList header={header} dataset={dataset} loading={loading} onScrollToBottom={this.handlerScrollToBottom} onClick={this.handlerClick} />
            : (!loading ? <div>{header}
              <div className={styles.empty_box}>您还没有购买记录哦~</div>
            </div> : null)
          }
          {loading && dataset.length <= 0 &&
          <Spinner loading={loading} mask={false} />
          }
        </div>
      </div>
    )
  }
}
