import React from 'react'
import { connect, routerRedux } from 'dva'
import { Button } from 'antd-mobile'
import { Link } from 'dva/router'
import autobind from 'autobind-decorator'
import styles from './IndexPage.less'

@connect(state => ({
  loading: state.loading.global
}))
export default class IndexPage extends React.Component {
  static propTypes = {}

  componentDidMount () {
    console.log('hello')
  }

  render () {
    return (
      <div className={styles['page-migrate']}>
        <div>
          <h2 className={styles['h2']}>淘金课堂</h2>
          <h3 className={styles['h3']}>升级到小程序</h3>
          <p>亲爱的淘金课堂VIP会员</p>
          <p>感谢您升级到小程序</p>
          <p>只需要进行一步手机验证</p>
          <p>您就可以在小程序上学习了</p>
        </div>
        <div className={styles['footer']}>
          <Link to='/migrate/check' className='am-button am-button-primary'>现在验证</Link>
        </div>
      </div>
    )
  }
}
