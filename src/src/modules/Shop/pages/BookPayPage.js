import { List, Button, Toast } from 'antd-mobile'
import Nav from 'components/Nav'
import cx from 'classname'
import { submit, SubmissionError } from 'redux-form'
import Spinner from 'components/Spinner'
import OrderForm from './OrderForm'
import styles from './BookPayPage.less'
const Item = List.Item

@connect(state => ({
  ...state.shop.ShopModel,
  loading: state.loading.global
}))
@autobind
export default class extends React.Component {
  constructor (props) {
    super(props)
    let {match: {params: {id}}, dispatch, dataset = {}, orderInfo = {}} = props

    if (!dataset.id) {
      dispatch(routerRedux.push(`/shop/${id}`))
      this.state = {}
      return
    }

    let {sell_price = 0, express_standard} = dataset
    express_standard = express_standard || []
    let {book_count = 1} = orderInfo || {}
    let express_name, good_price
    let express_sum = 0
    const expressList = express_standard.map((item) => {
      let {name, add_count, add_money, base_count, base_money} = item
      let expressPrice = this.calcExpressPrice(book_count, base_money, base_count, add_money, add_count)
      let des = `前${base_count}本${base_money}元，超过${base_count}本每${add_count}本${add_money}元`
      return {
        label: item.name,
        value: item.name,
        extra: `${item.base_money ? des : '包邮'}`,
        base_money: item.base_money
      }
    })

    if (express_standard.length > 0) {
      let {name, add_count, add_money, base_count, base_money} = express_standard[0] || {}

      express_name = name
      express_sum = this.calcExpressPrice(book_count, base_money, base_count, add_money, add_count)
    }

    good_price = sell_price * book_count

    this.state = {
      book_count,
      express_standard,
      expressList,
      consigneeInfo: null,
      express_name,
      express_sum,
      good_price
    }
  }

  calcExpressPrice (bookCount, baseMoney, baseCount, addMoney, addCount) {
    if (bookCount > baseCount && addCount > 0) {
      return baseMoney + Math.ceil((bookCount - baseCount) / addCount) * addMoney
    } else {
      return baseMoney
    }
  }

  componentDidMount () {
    let {dispatch} = this.props

    dispatch({
      type: 'shop/fetchInvoiceInfo',
      payload: {
        cb: this.init
      }
    })
  }

  init (consigneeInfo = {}) {
    let {express_name} = this.state

    if (express_name) {
      consigneeInfo.express_name = express_name
    }

    this.setState({
      consigneeInfo
    })
  }

  isEmpty (value) {
    return !(value && value.trim() !== '')
  }

  validate (values, _error = '操作失败') {
    const {isEmpty} = this
    const {is_need_invoice, header, taxpayer_id, consignee, consignee_mobile, consignee_address_city = [], consignee_address_info} = values
    let errors = {}
    if (+is_need_invoice) {
      if (isEmpty(header)) {
        errors.header = '必填'
      }

      if (isEmpty(taxpayer_id)) {
        errors.taxpayer_id = '必填'
      }
    }

    if (isEmpty(consignee)) {
      errors.consignee = '必填'
    }

    if (isEmpty(consignee_mobile)) {
      errors.consignee_mobile = '必填'
    } else if (!(/^1\d{10}$/i.test(consignee_mobile))) {
      errors.consignee_mobile = '手机号码格式不正确'
    }

    if (consignee_address_city.length <= 0) {
      errors.consignee_address_city = '必填'
    }

    if (isEmpty(consignee_address_info)) {
      errors.consignee_address_info = '必填'
    }

    if (Object.keys(errors).length) {
      errors._error = _error
    }
    return errors
  }

  handlerPay (values) {
    const {dispatch, match: {params: {id}}, orderInfo = {}} = this.props
    const {book_count = 1} = orderInfo
    const errors = this.validate(values)

    if (Object.keys(errors).length > 0) {
      throw new SubmissionError(errors)
    }

    let values_ = {
      ...values,
      consignee_address: values.consignee_address_city.join('') + ' ' + values.consignee_address_info,
      consignee_address_city: values.consignee_address_city.join(','),
      is_need_invoice: +values.is_need_invoice
    }

    if (!+values_.is_need_invoice) {
      delete values_.header
      delete values_.taxpayer_id
    }
    const ext_info = {
      type: 'plain',
      content: '图书',
      ...values_
    }

    let params = {
      order_type: 'book',
      payment_channel: 'wx_pub',
      payment_method: 'online',
      goods_list: [{id: id, count: book_count, express_name: values.express_name}],
      ext_info
    }
    dispatch({
      type: 'shop/orderPay',
      payload: {
        params,
        consigneeInfo: values,
        cb: (msg, charge_id, oid) => {
          if (msg === '支付成功') {
            dispatch({
              type: 'shop/getChargeStatus',
              payload: {
                params: {charge_id}
              }
            })
            dispatch(routerRedux.push(`/shop/order/${oid}`))
          } else {
            Toast.fail(msg || '购买失败', 1)
          }
        }
      }
    })
  }

  handleChangeExpress (name) {
    let {book_count, express_standard} = this.state

    let {base_money, base_count, add_money, add_count} = express_standard.find((item) => item.name === name)

    let express_sum = this.calcExpressPrice(book_count, base_money, base_count, add_money, add_count)
    this.setState({
      express_sum
    })
  }

  render () {
    const {loading, dispatch, dataset = {}, userInfo = {}, orderInfo = {}} = this.props
    let {is_allow_apply_invoice, thumb_img, name, description, origin_price, sell_price = 0, max_buy_number} = dataset || {}
    let {book_count = 1} = orderInfo || {}
    let {consigneeInfo, express_sum = 0, good_price = 0, expressList = []} = this.state || {}

    return (
      <div className={styles.book_order_page}>
        <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => { dispatch(routerRedux.goBack()) }} center='待付款订单' />

        {/* <!-- 订单商品开始 --> */}
        <div className={styles.book_info}>
          <div className={styles.left}>
            <img src={thumb_img} alt='缩略图' />
          </div>
          <div className={styles.right}>
            <div className={styles.book_name}>{name}</div>
            <div className={styles.right_bottom}>
              <div className={styles.price}>￥{sell_price}</div>
              <div className={styles.count}>x{book_count}</div>
            </div>
          </div>
        </div>
        {/* <!-- 订单商品结束 --> */}

        {/* <!-- 收货信息开始 --> */}
        {consigneeInfo &&
        <OrderForm initialValues={consigneeInfo} expressList={expressList} showInvoice={!!+is_allow_apply_invoice} onSubmit={this.handlerPay} onChangeExpress={this.handleChangeExpress} />}
        {/* <!-- 收货信息结束 --> */}

        <List renderHeader={() => !!+is_allow_apply_invoice && '此商品只能开具内容为图书的增值税普通发票'} className={styles.result_list}>
          <Item extra={`￥${good_price.toFixed(2)}元`}>商品金额</Item>
          <Item extra={`￥${express_sum.toFixed(2)}元`}>运费</Item>
        </List>
        <div className={styles.temp} />

        <div className={styles.footer}>
          <div className={styles.sum}>
            合计：<span className={styles.price}>￥ {(good_price + express_sum).toFixed(2)}</span>
          </div>
          <Button loading={loading} disabled={loading} className={styles.pay_button} onClick={() => dispatch(submit('OrderForm'))}>提交订单</Button>
        </div>

      </div>
    )
  }
}
