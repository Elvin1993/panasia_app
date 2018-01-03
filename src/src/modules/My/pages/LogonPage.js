import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import autobind from 'autobind-decorator'
import Nav from 'components/Nav'
import UserForm from 'components/UserForm'
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

  handleSubmitted (v) {
    const {dispatch, location} = this.props
    const {aid, sec} = location.query
    let params = {...v}
    let url = '/my'

    if (aid && sec) {
      params.request_param = {aid, sec}
      params.request_type = 'activity_scan_join'
      url = `/activity/${aid}`
    }

    dispatch({
      type: 'my/updateUserInfo',
      payload: {
        params, cb: () => dispatch(routerRedux.replace(url))
      }
    })
  }

  render () {
    const {dataset} = this.props
    return (
      <div className='page'>
        <Nav center='填写个人信息' />
        <div className={styles.logon_page}>
          <h1 className={styles.title}>智信是一个实名金融社区<br />请完善您的信息</h1>
          <UserForm onSubmitted={this.handleSubmitted} initialValues={{...dataset}} />
        </div>
      </div>
    )
  }
}
