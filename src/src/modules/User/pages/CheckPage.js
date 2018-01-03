import React from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd-mobile'
import autobind from 'autobind-decorator'
import { Link, routerRedux } from 'dva/router'
import Dialog from 'rc-dialog'
import 'rc-dialog/assets/index.css'
import Nav from 'components/Nav'
import DeptBreadcrumb from 'components/DeptBreadcrumb'
import styles from './CheckPage.less'
import { isMobile } from 'utils/helper'

const alert = Modal.alert

@connect(state => ({
  ...state.user.checkMobel,
  loading: state.loading.global
}))
@autobind
export default class CheckPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  handlerCheckMobile () {
    const {dispatch, match: {params: {aid, sec}}, dataset = {}, mobile} = this.props
    const params = {mobile, aid, bind_uid: dataset.id, sec}
    if (!isMobile(mobile)) {
      alert('手机号码格式不正确！')
      return
    }
    dispatch({type: 'user/checkMobile', payload: {params, cb: this.showDialog}})
  }

  handlerOnChange (e) {
    const {dispatch} = this.props
    const mobile = e.target.value
    dispatch({type: 'user/changeMobile', payload: {mobile}})
  }

  showDialog () {
    this.setState({
      visible: true
    })
  }

  hideDialog () {
    this.setState({
      visible: false
    })
  }

  render () {
    const {dispatch, dataset = {}, match: {params: {aid, sec}}, mobile} = this.props
    const {user_face, name, job, department, position} = dataset
    const {organization_name} = position || {}
    return (
      <div className='page'>
        <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => dispatch(routerRedux.goBack())} center='验证手机号' />
        <div className={styles.check_page}>

          <div className={styles.face_box}>
            <div className={styles.user_face}>
              <img src={user_face || 'img/user_face_default.png'} alt='头像' />
            </div>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.name}>{name}</div>
            <div className={styles.dep}>
              {
                !position ? <span>{`${department || '-'}`}</span>
                  : <div className={styles.job_level}><span>{organization_name || '-'} / </span><DeptBreadcrumb link={false} position={position} job crumb={false} size='small' /></div>
              }
              <div>{job}</div>
            </div>

          </div>
          <div className={styles.form}>
            <input placeholder='请输入您的手机号' type='tel' value={mobile} onChange={this.handlerOnChange} />
            <Button className='my_btn' type='primary' onClick={this.handlerCheckMobile}>验证手机号</Button>
          </div>
          <Dialog
            visible={this.state.visible}
            animation='zoom'
            maskAnimation='fade'
            onClose={this.hideDialog}
            wrapClassName='my-dialog-wrap'
            closable={false}
          >
            <h3>验证错误</h3>
            <p className='my-msg'>您输入的手机号与预留不符，如您并非嘉宾，请填写您自己的信息。</p>
            <div className='my-dialog-box'>
              <Button className='my_btn' type='primary' onClick={this.hideDialog}>重新输入</Button>
              <Button className='my_btn my_btn_cancel'><Link to={`/logon?aid=${aid}&sec=${sec}`}>去填写</Link></Button>
            </div>
          </Dialog>
        </div>
      </div>
    )
  }
}
