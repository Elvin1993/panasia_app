import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Nav from 'components/Nav'
import { Modal, List, Button, Icon, Stepper } from 'antd-mobile'
import UserForm from 'components/UserForm'
import styles from './IndexPage.less'

const Item = List.Item
const Brief = Item.Brief

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
let maskProps
if (isIPhone) {
  // Note: the popup contendt will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault()
  }
}

@connect(state => ({
  ...state.shop.ShopModel,
  userInfo: {...state.my.myInfoModel.dataset},
  loading: state.loading.global
}))
@autobind
export default class View extends React.Component {
  goFollow (event) {
    event.preventDefault()
    location.href = 'http://mp.weixin.qq.com/s?__biz=MzA3NjE3MzYwMQ==&mid=203780394&idx=1&sn=fdb290bdef350c039acc5a97ca647060#rd'
  }

  handleChangeDoubleSize (str) {
    return str.replace(/font-size: \w+;?/g, (world) => {
      return world.replace(/\d+/, (size) => size * 2)
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      edit: false,
      showLogin: false
    }
  }

  componentDidMount () {
    let {match: {params: {id}}, dispatch, location} = this.props
    const {is_preview = 0} = location.query
    dispatch({
      type: 'shop/fetchShopInfo',
      payload: {
        params: {id, is_preview},
        cb: (v) => wx.ready(() => this.initWXShare(v))
      }
    })
  }

  initWXShare (v) {
    let {dataset: {name: title, book_face: imgUrl}} = v
    document.title = `智信 • 荐书 - ${title}`

    let link = location.href
    const message = {
      title: '智信 • 荐书',
      link: link,
      imgUrl: imgUrl,
      desc: title,
      type: 'link'
    }

    let tlmessage = {...message, title: document.title}
    wx.onMenuShareAppMessage(message)
    wx.onMenuShareQQ(message)
    wx.onMenuShareTimeline(tlmessage)
  }

  changeCount (book_count) {
    const {dispatch} = this.props
    dispatch({
      type: 'shop/changeOrderCount',
      payload: {book_count}
    })
  }

  chooseCount () {
    this.setState({
      editing: true
    })
  }

  handlerHidePopup () {
    this.setState({
      editing: false
    })
  }

  handlerNext () {
    const {userInfo = {}} = this.props
    if (userInfo.status === 'WEIXIN') {
      this.setState({
        editing: false,
        showLogin: true
      })
    } else {
      this.goPayPage()
    }
  }

  handlerLogined (values) {
    let {dispatch} = this.props
    dispatch({
      type: 'my/updateUserInfo',
      payload: {
        params: {...values}, cb: this.goPayPage
      }
    })
  }

  goPayPage () {
    let {match: {params: {id}}, dispatch} = this.props
    dispatch(routerRedux.push(`/shop/${id}/pay`))
  }

  render () {
    const {dataset = {}, userInfo = {}, orderInfo = {}} = this.props
    const {thumb_img, name, description, express_standard = [], origin_price, sell_price, max_buy_number, goods_count} = dataset
    const {book_count} = orderInfo || {}
    const {showLogin = false, editing = false} = this.state
    let style = editing ? {position: 'relative', overflow: 'hidden', height: window.innerHeight, paddingBottom: 0} : null
    const express = express_standard ? express_standard[0] : {}
    const {base_money = 0} = express || {}

    return (
      <div className={styles.book_detail} style={style}>
        <Nav center='智信 • 荐书' left={showLogin && <i className='icon icon-arrows-left' />} onLeftClick={() => showLogin && this.setState({showLogin: false})} />
        {
          showLogin
            ? <UserForm initialValues={{...userInfo, remark: ''}} type='shopForm' onSubmitted={this.handlerLogined} />
            : (
              <div>
                <div className={styles.book_main}>
                  <img src={thumb_img} />
                </div>
                <div className={styles.book_inf}>
                  <h2>{name}</h2>
                  <span> <i>￥</i>{sell_price}元<del>原价:{origin_price}元</del></span>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <label> 运费：{!base_money ? '免运费' : `￥${base_money.toFixed(2)}元`} </label>
                    <label> 销量：{goods_count || 0}本 </label>
                  </div>

                  <div className={styles.pic_list}>
                    <div><i className='icon icon_shop_p1' />智信资产管理研究院</div>
                    <div><i className='icon icon_shop_p2' />企业认证</div>
                    <div><i className='icon icon_shop_p3' />担保交易</div>
                  </div>

                </div>
                <div id='mainContent' className={styles.main_content}>
                  <div dangerouslySetInnerHTML={{__html: description && this.handleChangeDoubleSize(description)}} />
                </div>
                <div className={styles.bottom_ann}>
                  <span onClick={this.goFollow}> +关注 </span>
                  <img src='img/ztrue.png' />
                </div>

                <div className={styles.footer}>
                  <Button className={styles.btn_buy} onClick={this.chooseCount}>立即购买</Button>
                </div>
              </div>
          )
        }

        {
          editing &&
          <div>
            <div className={styles.white_content} onClick={this.handlerHidePopup} />
            <div className={styles.popup_box}>
              <List>
                <List.Item
                  wrap
                  className={styles.top}
                  extra={<Icon onClick={this.handlerHidePopup} type='cross-circle' size='md' />}
                  thumb={<img className={styles.book_thumb_img} src={thumb_img} alt='缩略图' />}
                  multipleLine
                >
                  {name} <Brief className={styles.price}>￥{sell_price}</Brief>
                </List.Item>
                <List.Item extra={
                  <Stepper
                    style={{width: '100%', minWidth: '2rem'}}
                    wrap
                    showNumber
                    max={max_buy_number === '0' ? Infinity : +max_buy_number}
                    min={1}
                    value={book_count}
                    onChange={this.changeCount}
                  />}
                >
                  购买数量:
                  {max_buy_number !== '0' && <Brief>每人限购{max_buy_number}件</Brief>}
                </List.Item>
              </List>
              <Button className={styles.btn_next} onClick={this.handlerNext}>下一步</Button>
            </div>
          </div>
        }
      </div>
    )
  }
}
