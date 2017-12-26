import { Tabs, Picker, List, Modal } from 'antd-mobile'
import Nav from 'components/Nav'
import { SubmissionError } from 'redux-form'
import cx from 'classname'
import InvoiceForm from './InvoiceForm'
import styles from './InvoiceDetailPage.less'
import Spinner from 'components/Spinner'
const TabPane = Tabs.TabPane

@connect(state => ({
  ...state.my.invoiceInfo,
  loading: state.loading.global
}))
@autobind
export default class extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const {dispatch, location = {}, initialize} = this.props
    const {query: {order_ids}} = location

    if (!order_ids) {
      Modal.alert('错误', '请先选择要开票的订单', [
        {text: '确定', onPress: () => dispatch(routerRedux.push('/my/edu/invoice'))}
      ])
    }

    dispatch({
      type: 'my/fetchInvoiceInfo'
    })
  }

  submit (values, dispatch, even) {
    const {isEmpty} = this
    const {location = {}} = this.props
    const {query: {order_ids}} = location
    const {type, header, content = [], taxpayer, taxpayer_id, address, mobile, bank_name, bank_account, consignee, consignee_mobile, consignee_address_city = [], consignee_address_info} = values

    return new Promise((resolve, reject) => {
      const errors = {}
      if (type === 'plain') {
        if (isEmpty(header)) {
          errors.header = '必填'
        }

        if (content.length <= 0) {
          errors.content = '必填'
        }
      } else {
        if (isEmpty(taxpayer)) {
          errors.taxpayer = '必填'
        }

        if (isEmpty(taxpayer_id)) {
          errors.taxpayer_id = '必填'
        }

        if (isEmpty(address)) {
          errors.address = '必填'
        }

        if (isEmpty(mobile)) {
          errors.mobile = '必填'
        } else if (!(/^1\d{10}$/i.test(mobile))) {
          errors.mobile = '手机号码格式不正确'
        }

        if (isEmpty(bank_name)) {
          errors.bank_name = '必填'
        }

        if (isEmpty(bank_account)) {
          errors.bank_account = '必填'
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
      if (Object.keys(errors).length > 0) {
        return reject(new SubmissionError(errors))
      }
      const params = {
        ...values,
        consignee_address: consignee_address_city.join('') + consignee_address_info,
        consignee_address_city: consignee_address_city.join(','),
        content: content.join(''),
        order_id: order_ids
      }

      const cb = (result) => {
        if (result.code === 0) {
          Modal.alert(result.message)
          return resolve()
        } else {
          Modal.alert(result.message)
          return reject(new Error(result.message))
        }
      }
      dispatch({
        type: 'my/addOrderInvoice',
        payload: {
          params,
          cb
        }
      })
    })
  }

  handlerChangeTab (type) {
    this.props.dispatch({
      type: 'my/changeInvoiceType',
      payload: {
        type
      }
    })
  }

  handlerOnSubmitted (params, resolve, reject) {
    const {dispatch, location = {}} = this.props
    const {query: {order_ids = ''}} = location
    const cb = (result) => {
      if (result.code === 0) {
        Modal.alert('成功', result.message, [
          {
            text: '确定',
            onPress: () => {
              resolve()
              dispatch(routerRedux.push('/my'))
            }
          }])
      } else {
        Modal.alert('失败', result.message, [{text: '确定', onPress: () => reject()}])
      }
    }
    dispatch({
      type: 'my/addOrderInvoice',
      payload: {
        params: {...params, order_ids: order_ids.split(',')},
        cb
      }
    })
  }

  render () {
    const {dispatch, initialValues = {}, location} = this.props
    const {query: {sum = 0}} = location
    const {type = 'plain'} = initialValues
    return (
      <div>
        <div className={styles.invoice_detail_page}>
          <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => { dispatch(routerRedux.goBack()) }} center='开发票' />
          <div className={styles.title}>当前已选开票总额：<span className='text_blue'>{sum}元</span></div>
          <Tabs animated={false} swipeable={false} activeKey={type} onTabClick={this.handlerChangeTab}>
            <TabPane tab='增值税普通发票' key='plain'>
              <InvoiceForm formKey='1' initialValues={initialValues} type='plain' onSubmitted={this.handlerOnSubmitted} />
            </TabPane>
            <TabPane tab='增值税专项发票' key='vat'>
              <InvoiceForm formKey='2' initialValues={initialValues} type='vat' onSubmitted={this.handlerOnSubmitted} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
