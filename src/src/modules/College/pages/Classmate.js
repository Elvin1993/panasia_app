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
import styles from './Classmate.less'

@connect(state => ({
  classmateModel: state.college.classmateModel,
  loading: state.loading.global
}))
@autobind
export default class Classmate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dialogVisible: false
    }
  }

  componentDidMount () {
    const {dispatch, match: {params: {id}}} = this.props
    dispatch({
      type: 'college/fetchClassmate',
      payload: {params: {uid: id}}
    })
  }

  add2AddressList () {
    const {dispatch, match: {params: {id}}} = this.props
    const params = {uid: id, check: 1}
    const cb = (url) => {
      this.setState({
        dialogVisible: url
      })
    }
    dispatch({type: 'college/fetchClassmateQRCode', payload: {params, cb}})
  }

  onExchangeCarded (cb) {
    const {dispatch, dataset: {id}} = this.props
    const params = {exchange_uid: id}
    dispatch({type: 'user/addExchangeCard', payload: {params, cb}})
  }

  hideDialog () {
    this.setState({
      dialogVisible: false
    })
  }

  render () {
    const {loading, dispatch, classmateModel} = this.props

    return (
      <div className='page'>
        <div className={styles.detail_page}>
          <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => dispatch(routerRedux.goBack())} />
          <UserInfo dataset={classmateModel} onExchangeCarded={this.onExchangeCarded} self={true} />
          <div className={styles.btn_box}>
            <button className={cx('btn', 'btn-blue', styles.btn)} onClick={this.add2AddressList}>保存到手机通讯录</button>
          </div>
        </div>
        <Spinner loading={loading} mask={false} />
        <Dialog
          visible={this.state.dialogVisible}
          animation='zoom'
          maskAnimation='fade'
          onClose={this.hideDialog}
          wrapClassName='bussiness-card-dialog-wrap'
        >
          {this.state.dialogVisible && <img className='code_box' src={this.state.dialogVisible} alt='二维码' />}
          <h2 style={{color: '#fff'}}>长按识别二维码</h2>
        </Dialog>

      </div>
    )
  }
}

