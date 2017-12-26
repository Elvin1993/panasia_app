import React from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import autobind from 'autobind-decorator'
import Nav from 'components/Nav'
import styles from './MyStudyPage.less'

@connect(state => ({
  ...state.my.myInfoModel,
  loading: state.loading.global
}))
@autobind
export default class MyStudyPage extends React.Component {
  static propTypes = {}

  handlerLogout () {
    const {dispatch} = this.props
    dispatch({type: 'my/Logout'})
  }

  render () {
    const {dataset = {}} = this.props
    const {vip_info} = dataset
    const {is_buy} = vip_info || {}
    return (
      <div className='page'>
        <ul className={styles.menu}>
          <Nav left={<Link to='/my'><i className='icon icon-arrows-left' /></Link>} center='我的学习' />
          <Link to='/my/edu/studying'>
            <li>最近学习 <i className='icon icon-arrows-right-max' /></li>
          </Link>
          <Link to='/my/edu/vip'>
            <li>{+is_buy ? '我的VIP' : '成为VIP会员'} <i className='icon icon-arrows-right-max' /></li>
          </Link>
          <Link to='/my/edu/invoice'>
            <li>开发票 <i className='icon icon-arrows-right-max' /></li>
          </Link>
        </ul>
      </div>
    )
  }
}
