import { Result, Icon } from 'antd-mobile'
import { Link } from 'dva/router'
import cx from 'classname'
import Nav from 'components/Nav'
import styles from './PayResult.less'
import moment from 'moment'

@connect(state => ({
  ...state.shop.orderResult
}))
@autobind
export default class extends React.Component {
  constructor (props) {
    super(props)
    const {dispatch, match: {params: {id}}} = this.props
    dispatch({
      type: 'shop/fetchOrderResult',
      payload: {
        params: {id}
      }
    })
  }

  componentDidMount () {

  }

  componentWillUnmount () {
    const {dispatch} = this.props
    dispatch({type: 'shop/clearData'})
  }

  render () {
    const {order_goods = [], consignee_address = {}, invoice_info, payment_success_time, order_no, money, express_standard = [], express_money} = this.props.dataset || {}
    const {goods_id, goods_title, count, money: book_money} = order_goods[0] || {}
    const {address, consignee, mobile} = consignee_address || {}
    const {header, taxpayer_id} = invoice_info || {}
    const {name} = express_standard[0] || {}

    return (
      <div className={styles.pay_result_page}>
        <Nav center='订单详情' left={<i className='icon icon-arrows-left' />} onLeftClick={() => { this.props.dispatch(routerRedux.goBack()) }} />
        <Result
          img={<Icon type='check-circle' style={{fill: '#1F90E6', width: '120px', height: '120px'}} />}
          title='购买成功'
          message='预售商品购买成功 请耐心等待发货'
        />

        <ul className={styles.order_info}>
          <li>
            <div className={styles.label}>商品名称</div>
            <Link to={`/shop/${goods_id}`} className={styles.text} style={{color: '#3d74c7'}}>{goods_title}</Link>
          </li>
          <li>
            <div className={styles.label}>商品单价</div>
            <div className={styles.text}>￥{book_money}</div>
            <div className={styles.label}>商品数量</div>
            <div className={styles.text}>{count}</div>
          </li>
          <li>
            <div className={styles.label}>付款金额</div>
            <div className={styles.text}>￥{money}</div>
          </li>
          <li>
            <div className={styles.label}>配送方式</div>
            <div className={styles.text}>{name} (运费￥{express_money})</div>
          </li>
          <li>
            <div className={styles.label}>订单编号</div>
            <div className={styles.text}>{order_no}</div>
          </li>
          <li>
            <div className={styles.label}>付款时间</div>
            <div className={styles.text}>{moment(+payment_success_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
          </li>
        </ul>

        <ul className={styles.order_info}>
          <li>
            <div className={styles.label}>收件人</div>
            <div className={cx([styles.text], [styles.multi_text])}><span>{consignee}</span><span>{mobile}</span></div>
          </li>
          <li>
            <div className={styles.label}>收件地址</div>
            <div className={styles.text}>{address}</div>
          </li>

        </ul>

        {
          invoice_info &&
          <ul className={styles.order_info}>
            <li >
              <div className={styles.label}>发票抬头</div>
              <div className={styles.text}>{header}</div>
              <div className={styles.label}>发票金额</div>
              <div className={styles.text}>￥{money}</div>
            </li>
            <li>
              <div className={styles.label} style={{flexBasis: '30%'}}>纳税人识别号</div>
              <div className={styles.text}>{taxpayer_id}</div>
            </li>
          </ul>
        }

        <div className={styles.footer}>
          <Link to='/article'><span className={styles.btn_goBack}>返回首页>></span></Link>
        </div>
      </div>
    )
  }
}
