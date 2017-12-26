import React from 'react'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import Nav from 'components/Nav'
import VaildPhoneNum from 'components/VaildPhoneNum'
import { Toast, Modal } from 'antd-mobile'
import Spinner from 'components/Spinner'
import styles from './VIPPage.less'

@connect(state => ({
  ...state.my.myInfoModel,
  loading: state.loading.global
}))
@autobind
export default class extends React.Component {
  constructor (props) {
    super(props)
  }

  state = {
    modal: false,
    type_id: ''
  }

  componentDidMount () {

  }

  handlerFetch (cb, charge_id) {
    const {dispatch, dataset, params: {id}} = this.props
    dispatch({
      type: 'my/fetchUserInfo',
      payload: {
        cb,
        charge_id
      }
    })
  }

  handlerBuy (id) {
    console.log(this.props)
    const {dataset, dispatch} = this.props
    this.setState({
      type_id: id
    })
    if (!dataset.mobile || dataset.mobile === '') {
      this.vaildTel()
    } else {
      this.handlerPay(id)
    }
  }

  vaildTel () {
    this.setState({
      modal: true
    })
  }

  handlerPay (id = this.state.type_id) {
    this.onClose()
    const {dispatch} = this.props
    dispatch({
      type: 'course/orderPay',
      payload: {
        params: {
          order_type: 'vip',
          payment_channel: 'wx_pub',
          payment_method: 'online',
          goods_list: [
            {
              id,
              count: 1
            }]
        },
        cb: (msg, charge_id) => {
          if (msg === '支付成功') {
            this.handlerFetch(() => Toast.success('支付成功', 1), charge_id)
          } else {
            Toast.fail(msg || '购买失败', 1)
          }
        }
      }
    })
  }

  onClose () {
    this.setState({
      modal: false
    })
  }

  render () {
    const {loading, dispatch, dataset = {}} = this.props
    const {user_face, name, vip_info, mobile} = dataset
    const {is_buy, expire_time = 0, is_expire} = vip_info || {}
    const expireDay = moment(+expire_time * 1000).diff(moment(), 'days')

    return (
      <div className='page'>
        <div className={styles.vip_page}>
          <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => { dispatch(routerRedux.goBack()) }} center={+is_buy ? '我的VIP' : '开通VIP会员'} />
          <div className={styles.top}>
            <div className={styles.user_face}>
              <img src={user_face || 'img/user_face_default.png'} alt='头像' />
            </div>
            <div className={styles.user_info}>
              <div className={styles.name}>{name || mobile}</div>
              {+is_buy ? <div className={styles.vip_msg}><i className='icon icon_vip' /> VIP会员（{+is_expire ? '已过期' : `剩余${expireDay}天`}）</div> : <div className={styles.msg}>您还不是VIP会员</div>}
            </div>
          </div>

          <ul className={styles.vip_list}>
            <li>
              <i className='icon icon-vip-year' />
              <span className={styles.vip_name}>年费VIP会员（推荐）</span>
              <span className={styles.price}>￥2998</span>
              <button onClick={() => this.handlerBuy(1)}>{+is_buy ? '续费' : '开通'}</button>
            </li>
            <li>
              <i className='icon icon-vip-month' />
              <span className={styles.vip_name}>6个月VIP</span>
              <span className={styles.price}>￥1598</span>
              <button onClick={() => this.handlerBuy(2)}>{+is_buy ? '续费' : '开通'}</button>
            </li>
          </ul>

          <div className={styles.footer}>
            <h1>VIP会员权益</h1>
            <ul className={styles.vip_info}>
              <li>
                <i className='icon vip_icon_1' />
                <div className={styles.right}>
                  <h3>全部免费</h3>
                  <span>所有课程想看就看</span>
                </div>
              </li>
              <li>
                <i className='icon vip_icon_2' />
                <div className={styles.right}>
                  <h3>行业热点</h3>
                  <span>带你挖掘业务新蓝海</span>
                </div>
              </li>
              <li>
                <i className='icon vip_icon_3' />
                <div className={styles.right}>
                  <h3>每日更新</h3>
                  <span>每天get一项业务新技能</span>
                </div>
              </li>
              <li>
                <i className='icon vip_icon_4' />
                <div className={styles.right}>
                  <h3>新政解读</h3>
                  <span>第一时间为您解读最新政策</span>
                </div>
              </li>
              <li>
                <i className='icon vip_icon_5' />
                <div className={styles.right}>
                  <h3>丰富知识</h3>
                  <span>金融核心要点全覆盖</span>
                </div>
              </li>
              <li>
                <i className='icon vip_icon_6' />
                <div className={styles.right}>
                  <h3>资深讲师</h3>
                  <span>全是一线部门总经理</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {
          this.state.modal ? (
            <Modal
              title={<span style={{color: '#3d74c7', fontWeight: 'bold'}}>验证手机号码</span>}
              transparent
              maskClosable
              closable
              visible={this.state.modal}
              onClose={this.onClose}
              style={{width: '6.5rem'}}
            >
              <VaildPhoneNum onSubmit={this.handlerPay.bind(this)} />
            </Modal>
          ) : null
        }
      </div>
    )
  }
}
