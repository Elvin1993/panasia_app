import React from 'react'
import autobind from 'autobind-decorator'
import { Link } from 'dva/router'
import cx from 'classname'
import Dialog from 'rc-dialog'
import 'rc-dialog/assets/index.css'
import styles from './UserInfo.less'
import UserFaceBox from './UserFaceBox'

@autobind
export default class UserInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dialogVisible: false,
      successDialogVisible: false
    }
  }

  hideBussinessCard () {
    this.setState({
      dialogVisible: false
    })
  }

  showSuccessDialog () {
    this.setState({
      successDialogVisible: true
    })
  }

  hideSuccessDialog () {
    this.setState({
      successDialogVisible: false
    })
  }

  showBussinessCard (url) {
    this.setState({
      dialogVisible: url
    })
  }

  renderSuccessDialog () {
    return (
      <Dialog
        visible={this.state.successDialogVisible}
        animation='zoom'
        maskAnimation='fade'
        closable={false}
        onClose={this.hideSuccessDialog}
        maskStyle={{backgroundColor: '#fff'}}
        wrapClassName='success-dialog-wrap'
      >
        <h1>你的交换请求<br />
          已发送给对方</h1>
        <p className='msg'>请耐心等待对方反馈<br />对方同意后<br />你们就可以互通信息啦</p>
        <h2>关注“智信网”服务号<br />才能收到对方信息通知<br /><span className='text_blue'>请务必关注！</span></h2>
        <img src='img/zx_code.png' className='code_box' alt='二维码' />
        <h2>点击保存图片 用微信打开 <br />长按识别二维码</h2>
        <Link to='/article'>
          <button className='btn btn-blue'>返回首页</button>
        </Link>
      </Dialog>
    )
  }

  handlerExchangeCard () {
    const {onExchangeCarded} = this.props
    onExchangeCarded && onExchangeCarded(this.showSuccessDialog)
  }

  render () {
    const {self, hideUserFace, dataset, dataset: {name, company, department, job, mobile, business_card_a, business_card_b, is_exchange = 0}} = this.props
    return (
      <div className={styles.user_info_wrapper}>
        {!hideUserFace && <UserFaceBox {...dataset} />}
        <div className={styles.user_info}>
          {
            self && <div className={styles.row}>
              <label>姓名</label>
              <span>{name}</span>
            </div>
          }

          <div className={styles.row}>
            <label>单位</label>
            <span>{company}</span>
          </div>
          <div className={styles.row}>
            <label>部门</label>
            <span>{department}</span>
          </div>
          <div className={styles.row}>
            <label>职务</label>
            <span>{job}</span>
          </div>
          <div className={styles.row}>
            <label>电话</label>
            {is_exchange === 1 || self ? <a href={`tel:${mobile}`}>{mobile}</a> : <span>{mobile}<b className={styles.tel_msg} style={{display: 'none'}}>（交换名片后可见）</b></span>}
          </div>
        </div>
        {
          is_exchange === 1 || self ? <div>
            <div className={styles.bussiness_card} onClick={() => this.showBussinessCard(business_card_a)}>
              <img src={business_card_a} alt='名片正面' />
            </div>
            <div className={styles.bussiness_card} onClick={() => this.showBussinessCard(business_card_b)}>
              <img src={business_card_b} alt='名片背面' />
            </div>
          </div>
            : <div style={{display: 'none'}} className={cx(styles.bussiness_card, styles.bussiness_card_false)}>
              <button className='btn btn-blue hide' onClick={this.handlerExchangeCard}>交换名片</button>
            </div>
        }

        {this.state.successDialogVisible && this.renderSuccessDialog()}
        <Dialog
          visible={this.state.dialogVisible}
          animation='zoom'
          maskAnimation='fade'
          onClose={this.hideBussinessCard}
          closable={false}
          wrapClassName='bussiness-card-dialog-wrap'
        >
          {this.state.dialogVisible && <img src={this.state.dialogVisible} />}
        </Dialog>
      </div>
    )
  }
}
