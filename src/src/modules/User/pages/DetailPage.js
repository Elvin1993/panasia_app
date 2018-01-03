import autobind from 'autobind-decorator'
import cx from 'classname'
import Nav from 'components/Nav'
import Spinner from 'components/Spinner'
import UserInfo from 'components/UserInfo'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Dialog from 'rc-dialog'
import 'rc-dialog/assets/index.css'
import React from 'react'
import styles from './DetailPage.less'

@connect(state => ({
  ...state.user.userInfoModel,
  logoUser: state.my.myInfoModel.dataset,
  loading: state.loading.global
}))
@autobind
export default class DetailPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dialogVisible: false
    }
  }

  componentDidMount () {
    const {dispatch, match: {params: {uid}}} = this.props

    dispatch({
      type: 'user/fetchDetail',
      payload: {params: {uid}}
    })
  }

  add2AddressList () {
    const {dispatch, dataset: {id}} = this.props
    const params = {uid: id, check: 1}
    const cb = (url) => {
      this.setState({
        dialogVisible: url
      })
    }
    dispatch({type: 'user/fetchUserInfoCode', payload: {params, cb}})
  }

  onExchangeCarded (cb) {
    const {dispatch, dataset: {id}} = this.props
    const params = {exchange_uid: id}
    dispatch({type: 'user/addExchangeCard', payload: {params, cb}})
  }

  hideDialog () {
    this.setState({
      hideDialog: false
    })
  }

  render () {
    const {loading, dispatch, dataset = {}, dataset: {id, is_exchange = 0}, logoUser} = this.props

    return (
      <div className='page'>
        <div className={styles.detail_page}>
          <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => dispatch(routerRedux.goBack())} />
          <UserInfo dataset={dataset} onExchangeCarded={this.onExchangeCarded} self={logoUser.id === id} />
          {
            is_exchange === 1 &&
            <div className={styles.btn_box}>
              <button className={cx('btn', 'btn-blue', styles.btn)} onClick={this.add2AddressList}>保存到手机通讯录</button>
            </div>
          }
        </div>
        <Spinner loading={loading} mask={false} />
        <Dialog
          visible={this.state.dialogVisible}
          animation='zoom'
          maskAnimation='fade'
          onClose={this.hideDialog}
          closable={false}
          wrapClassName='bussiness-card-dialog-wrap'
        >
          {this.state.dialogVisible && <img className='code_box' src={this.state.dialogVisible} alt='二维码' />}
          <h2>长按识别二维码</h2>
        </Dialog>

      </div>
    )
  }
}
