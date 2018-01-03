import React, { Component } from 'react'
import { Modal, Toast, Checkbox } from 'antd-mobile'
import { connect } from 'dva'
import autobind from 'autobind-decorator'
import moment from 'moment'
import cx from 'classname'
import Dialog from 'rc-dialog'
import { checkEmail } from 'utils/helper'
import Spinner from 'components/Spinner'
import styles from './DataList.less'

@connect(
  state => ({})
)
@autobind
export default class DataList extends Component {
  state = {
    dialogVisible: false,
    sendOk: false,
    selectList: [],
    userEmail: ''
  }

  componentDidMount() {
    this.setState({
      userEmail: this.props.email
    })
  }

  componentWillReceiveProps(nextProps, prveProps) {
    console.log(nextProps,prveProps)

    if (nextProps.email !== this.props.email) {
      this.setState({
        userEmail: nextProps.email
      })
    }
  }

  handlerChangeCheckBox (item) {
    const selectListCopy = this.state.selectList.slice()
    const index = selectListCopy.findIndex(listitem => listitem.id === item.id )
    if (~index) {
      selectListCopy.splice(index, 1)
    } else {
      selectListCopy.push(item)
    }
    this.setState({
      selectList: selectListCopy
    })
  }

  getSmallExt (ext = '?') {
    return ext.substr(0, 1)
  }

  handlerChangeEmal (e) {
    const userEmail = e.target.value
    this.setState({
      userEmail
    })
  }

  send2Email () {
    this.setState({
      dialogVisible: true
    })
  }

  hideDialog() {
    this.setState({
      dialogVisible: false
    })
  }

  reset() {
    this.setState({
      selectList: [],
    })
  }

  postSendEmail () {
    const { userEmail, selectList } = this.state
    const { id, postEmail, dispatch } = this.props
    const params = {email: userEmail, id}
    if (!checkEmail(userEmail)) {
      Toast.fail('Email地址不对', 1)
      return
    }

    params.information = selectList.map((item) => {
        return {name: item.name, url: item.url, id: item.id, size: ~item.size.indexOf('KB') ? item.size : `${item.size/1000}KB` }
    }).filter(i => i)
    const cb = (res = {}) => {
      if (res.code === 0) {
        this.hideDialog()
        Modal.alert('发送成功', `活动资料已发送到${userEmail}，请注意查收`)
        this.reset()
      } else {
        Modal.alert('发送失败', `系统繁忙，请稍后再试`) 
      }
    }
    postEmail(params, cb)

    
    // dispatch({type: 'activity/postFile2Email', payload: {params, cb}})
  }

  renderItem (row, showCheckBox = true) {
    const { selectList } = this.state
    return (
      <label className={styles.activity_item} key={row.id}>
        {
          showCheckBox &&
          <Checkbox
            className={styles.btn_select}
            checked={~selectList.findIndex(item => item.id === row.id )}
            onChange={() => this.handlerChangeCheckBox(row)}
            disabled={this.state.disabled}
          />
        }
        <div className='file-icon file-icon-lg' data-type={this.getSmallExt(row.extension)} style={{background: row.extension_bg}} />
        <div className={styles.file_info_box}>
          <div className={styles.file_name}>{row.name}</div>
          <div className={styles.file_info}>
            <span className={styles.file_time}>{moment(row.create_time * 1000).format('YYYY.MM.DD')}</span>
            <span className={styles.size}>{~row.size.indexOf('KB') ? row.size : `${row.size/1000}KB` }</span>
          </div>
        </div>
        {!showCheckBox && <div className={styles.btn_close} onClick={() => this.handlerChangeCheckBox(row)}><i className='icon icon-close' /></div>}
      </label>
    )
  }

  render() {
    const { loading = false, dataset } = this.props
    const { selectList, userEmail, sendOk, dialogVisible } = this.state
    return (
      <div className={styles.data_wrapper}>
        <div className={styles.list_box}>
          {
            dataset.length > 0 ? dataset.map((item) => {
              return this.renderItem(item, true)
            })
              : (!loading ? <div className={styles.empty_box}>暂时没有资料</div> : null)
          }
        </div>
        <div className={styles.footer}>
          <button className={cx('btn', 'btn-blue', styles.btn_send2email)} onClick={this.send2Email} disabled={selectList.length <= 0}>一键发送到邮箱</button>
        </div>
        <Dialog
          visible={dialogVisible}
          animation='zoom'
          maskAnimation='fade'
          onClose={this.hideDialog}
          wrapClassName='my-dialog-wrap'
          closable={false}
        >
          <h3>请填写你的个人邮箱</h3>
          <input type='text' value={userEmail} onChange={this.handlerChangeEmal} />
          <p className='my-msg'>我们将把活动资料发送到你个人邮箱，请确保
            邮箱填写正确。</p>
          <div className={cx(styles.list_box, styles.small)}>
            {
              selectList.length > 0 && selectList.map((item) => {
                return this.renderItem(item, false)
              })
            }
          </div>
          <div className='my-dialog-box'>
            <button className='btn btn-blue' onClick={this.postSendEmail} disabled={loading}>发送</button>
            <button className='btn' style={{marginLeft: '25px'}} onClick={this.hideDialog}>取消</button>
          </div>
        </Dialog>

        <Dialog
          visible={sendOk}
          animation='zoom'
          maskAnimation='fade'
          onClose={() => this.reset()}
          wrapClassName='my-dialog-wrap'
          closable={false}
        >
          <h3>发送成功</h3>
          <p className='my-msg'>活动资料已发送到{userEmail}的邮箱，请注意查收</p>
          <div className='my-dialog-box'>
            <button className='btn btn-blue' onClick={() => this.reset()}>我知道了</button>
          </div>
        </Dialog>
        <Spinner loading={loading} mask={false} />
      </div>
    )
  }
}