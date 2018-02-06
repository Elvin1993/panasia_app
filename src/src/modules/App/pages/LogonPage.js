import React from 'react'
import { connect } from 'dva'
import autobind from 'autobind-decorator'
import styles from './LogonPage.less'

@connect(state => ({
  ...state.my.myInfoModel,
  loading: state.loading.global
}))
@autobind
export default class LogonPage extends React.Component {
  static propTypes = {}

  componentDidMount () {

  }

  render () {
    return (
      <div className='page'>
        <div className={styles.logon_page}>
          <p>logon</p>
        </div>
      </div>
    )
  }
}
