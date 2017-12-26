import React from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import autobind from 'autobind-decorator'
import { Modal } from 'antd-mobile'
import UserFaceBox from 'components/UserFaceBox'
import Spinner from 'components/Spinner'
import TabBar from 'components/TabBar'
import styles from './IndexPage.less'

@connect(state => ({
  ...state.my.myInfoModel,
  loading: state.loading.global
}))
@autobind
export default class IndexPage extends React.Component {
  static propTypes = {}

  componentDidMount () {
    // const {dispatch,dataset} = this.props
    // if(dataset.id) {
    //   dispatch({
    //     type: 'my/fetchUserInfo'
    //   })
    // }

  }

  handlerLogout () {
    const {dispatch} = this.props

    Modal.alert('提示', '确定退出吗?', [
      {text: '取消'},
      {text: '确定', onPress: () => dispatch({type: 'my/Logout'}), style: {fontWeight: 'bold'}}
    ])
  }

  render () {
    const {dataset = {}, loading} = this.props
    return (
      <div className='page'>
        <div className={styles.my_page}>
          <UserFaceBox {...dataset} />
          <ul className={styles.menu}>
            <Link to='/my/edu' className='hide'>
              <li>我的学习 <i className='icon icon-arrows-right-max' /></li>
            </Link>
            <Link to='/my/activity'>
              <li>我的活动 <i className='icon icon-arrows-right-max' /></li>
            </Link>
            <Link to='/my/order' className='hide'>
              <li>购买记录 <i className='icon icon-arrows-right-max' /></li>
            </Link>
            <Link to='/my/info'>
              <li>个人信息 <i className='icon icon-arrows-right-max' /></li>
            </Link>
            <Link to='/my/cards' className='hide'>
              <li>名片夹 <i className='icon icon-arrows-right-max' /></li>
            </Link>
            <li className='hide'>我的消息 <i className='icon icon-arrows-right-max' /></li>
            <li className={__PROD__ && 'hide'} onClick={this.handlerLogout}>退出 <i className='icon icon-arrows-right-max' /></li>
          </ul>
          {
            dataset.company === 'ztrust' &&
            <div className={styles.system_info}>
              {`${__BRANCH__}@${__DATETIME__}`}
            </div>
          }
        </div>
        <TabBar activity='my' />
        <Spinner loading={loading} mask={false} />
      </div>
    )
  }
}
