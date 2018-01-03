import React from 'react'
import { connect } from 'dva'
import { List, InputItem, Toast, Button } from 'antd-mobile'
import classNames from 'classnames/bind'
import styles from './VaildPhoneNum.less'

let cx = classNames.bind(styles)

@connect(state => ({
  ...state.my.myInfoModel,
  loading: state.migrate.loading
}))
export default class VaildPhoneNum extends React.Component {
  static propTypes = {}

  state = {
    hasError: false,
    getCodeStatus: 0, // 0: 获取验证码; 1: 重发; 2: 59s后重发
    timerCount: 60,
    value: '',
    codeValue: ''
  }

  onErrorClick = () => {
    if (this.state.hasError) {
      Toast.info('Please enter 11 digits')
    }
  }
  onChange = (value) => {
    if (value.replace(/\s/g, '').length < 11) {
      this.setState({
        hasError: true
      })
    } else {
      this.setState({
        hasError: false
      })
    }
    this.setState({
      value
    })
  }

  onCodeChange = (value) => {
    this.setState({
      codeValue: value.trim()
    })
  }

  componentDidMount () {
    console.log(this.props)
  }

  componentWillUnmount () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  getCode () {
    if (this.state.value === '' || this.state.hasError) {
      Toast.fail('请输入正确的手机号码', 1)
      return
    }
    if (this.timer) {
      return
    }
    const {dispatch} = this.props
    dispatch({
      type: 'migrate/fetchCode',
      payload: {
        params: {mobile: this.state.value.replace(/\s/g, '')},
        cb: () => {
          this.setState({
            getCodeStatus: 2
          })
          this.timer = setInterval(this.setTimer.bind(this), 1000)
        }
      }
    })
  }

  setTimer () {
    if (this.state.timerCount > 1) {
      const timerCount = this.state.timerCount - 1
      this.setState({timerCount})
    } else {
      clearInterval(this.timer)
      this.setState({
        timerCount: 60,
        getCodeStatus: 1
      })
      this.timer = null
    }
  }

  handleCheck () {
    const {dispatch} = this.props
    dispatch({
      type: 'migrate/vaild',
      payload: {
        params: {
          mobile: this.state.value.replace(/\s/g, ''),
          code: this.state.codeValue
        },
        cb: () => {
          this.fetchUser(this.props.onSubmit)
        }
      }
    })
  }

  fetchUser (cb) {
    const {dispatch} = this.props
    dispatch({
      type: 'my/fetchUserInfo',
      payload: {cb}
    })
  }

  render () {
    const {dataset = {}} = this.props
    let className = cx({
      'send-code': true,
      'disabled': this.state.getCodeStatus === 2
    })
    return (
      <div className={styles['page']}>
        <div className={styles['input-row']}>
          <InputItem
            type='phone'
            placeholder='请输入手机号'
            onChange={this.onChange}
            value={this.state.value}
          />
          <a className={className} onClick={this.getCode.bind(this)}>
            {this.state.getCodeStatus === 0 ? '获取验证码' : this.state.getCodeStatus === 1 ? '重发' : `${this.state.timerCount}s后重发` }
          </a>
        </div>
        <div className={styles['input-row']}>
          <InputItem
            type='number'
            placeholder='输入验证码'
            onChange={this.onCodeChange}
            value={this.state.codeValue}
          />
        </div>
        <div className={styles['submit-container']}>
          <Button type='primary' disabled={this.state.value === '' || this.state.getCodeStatus <= 0} onClick={this.handleCheck.bind(this)} loading={this.props.loading}>验证手机号</Button>
        </div>
      </div>
    )
  }
}
