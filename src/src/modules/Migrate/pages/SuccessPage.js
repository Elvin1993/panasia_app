import React from 'react'
import { Icon } from 'antd-mobile'
import { connect } from 'dva'
import styles from './SuccessPage.less'
import qrcode from 'assets/wx_app_code.jpg'

@connect(state => ({
  loading: state.loading.global
}))
export default class SuccessPage extends React.Component {
  static propTypes = {}

  render () {
    return (
      <div className={styles['page']}>
        <div className={styles['header']}>
          <Icon type='check-circle-o' size='lg' className={styles['icon']} />
          <h1 className={styles['h1']}>验证成功</h1>
        </div>
        <div className={styles['content']}>
          <img className={styles['qrcode']} src={qrcode} alt='qrcode' />
          <p>长按识别小程序</p>
          <p>开启您的学习之旅</p>
        </div>
      </div>
    )
  }
}
