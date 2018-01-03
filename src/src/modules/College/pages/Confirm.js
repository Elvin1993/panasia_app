import { Flex, Switch, InputItem, Button, Picker, Toast, Modal } from 'antd-mobile'
import cx from 'classname'
import { routerRedux } from 'dva/router'
import React from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import Config from 'utils/Config'
import styles from './Confirm.less'

function isEmpty (value) {
  return !(value && value.trim() !== '')
}

function isAllEmpty (array = []) {
  let result = true
  array.map((value) => {
    result = result && !(value && value.trim() !== '')
  })
  return result
}

function onErrorClick (msg) {
  if (msg) {
    Toast.info(msg)
  }
}

const FieldInput = ({input, label, type, meta: {touched, error, warning}, placeholder}) => {
  console.log(input)
  return (
    <div style={{overflow: 'hidden'}}>
      <div className={cx({
        [styles['ticket-form-field']]: true
      })}>
        <Flex>
          <label>{label}:</label>
          <Flex.Item>
            <InputItem {...input} type={type} placeholder={placeholder} error={touched && error}
                       onErrorClick={onErrorClick.bind(this, error)} />
          </Flex.Item>
        </Flex>
      </div>
    </div>
  )
}

const PickerHolder = props => (
  <div
    onClick={props.onClick}
    className={styles['picker-holder']}
  >
    <div style={{display: 'flex', height: '0.6rem', lineHeight: '0.6rem'}}>
      <div style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} />
      <div style={{textAlign: 'right', color: '#888'}}>{props.extra}</div>
    </div>
  </div>
)

const FieldPicker = ({input, label, type, meta: {touched, error, warning}, placeholder, dataSource, row, showErrorMsg}) => (
  <div style={{overflow: 'hidden'}}>
    <div className={cx({
      [styles['ticket-form-field']]: true,
      [styles.field_error]: touched && error
    })} style={{padding: '.15rem .3rem'}}>
      <Flex>
        <label htmlFor={input.name}>{label}:</label>
        <Flex.Item>
          <Picker
            data={dataSource}
            title='选择'
            cols={row}
            {...input}
          >
            <PickerHolder />
          </Picker>
        </Flex.Item>
        {touched && (error && <span className={styles.error} onClick={showErrorMsg} />)}
      </Flex>
    </div>
  </div>
)

@reduxForm({
  form: 'PayForm'
})
@connect(state => {
  return {
    applyModel: state.college.applyModel,
    loading: state.loading.global
  }
})
export default class Confirm extends React.Component {
  constructor (props) {
    super(props)
    this.switchChange = this.switchChange.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
    console.log(this.props)
  }

  state = {
    payType: 'online',
    receive: 'offline',
    needTicket: false,
    modal: false
  }

  radioChange (type) {
    if (type === this.state.payType) {
      return
    }
    this.setState({
      payType: type
    })
  }

  receiveChange (type) {
    this.setState({
      receive: type
    })
  }

  switchChange (value) {
    this.setState({
      needTicket: value
    })
  }

  submit (values, dispatch, event) {
    const {match: {params: {id}}} = this.props
    const {payType, needTicket, receive} = this.state
    console.log(values)
    const {content, address, bank_account, bank_name, consignee, consignee_address_city, consignee_address_info, consignee_mobile, mobile, taxpayer, taxpayer_id} = values
    return new Promise((resolve, reject) => {
      var errors = {}
      if (needTicket) {
        // if (isEmpty(header)) {
        //   errors.header = '必填'
        // }
        console.log(content)
        if (!content || content.length <= 0) {
          errors.content = '必填'
        }
        if (isEmpty(mobile)) {
          errors.mobile = '必填'
        }
        if (isEmpty(taxpayer)) {
          errors.taxpayer = '必填'
        }
        if (isEmpty(taxpayer_id)) {
          errors.taxpayer_id = '必填'
        }
        if (isEmpty(address)) {
          errors.address = '必填'
        }
        if (isEmpty(bank_account)) {
          errors.bank_account = '必填'
        }
        if (isEmpty(bank_name)) {
          errors.bank_name = '必填'
        }
        if (receive !== 'offline') {
          if (isEmpty(consignee)) {
            errors.consignee = '必填'
          }
          if (!consignee_address_city || consignee_address_city.length <= 0) {
            errors.consignee_address_city = '必填'
          }
          if (isEmpty(consignee_address_info)) {
            errors.consignee_address_info = '必填'
          }
          if (isEmpty(consignee_mobile)) {
            errors.consignee_mobile = '必填'
          }
        }
        if (Object.keys(errors).length > 0) {
          return reject(new SubmissionError(errors))
        }
      }
      const params = {
        order_type: 'business_classes_user',
        payment_channel: 'wx_pub',
        payment_method: payType,
        goods_list: [{
          id,
          count: 1
        }],
        ext_info: {
          is_need_invoice: 0
        }
      }
      if (needTicket) {
        const ext_info = {
          is_need_invoice: 1,
          type: 'vat',
          header: taxpayer,
          content: content[0],
          address,
          mobile,
          bank_name,
          bank_account,
          taxpayer,
          taxpayer_id,
          get_way: 'locale'
        }

        if (receive === 'mailing') {
          Object.assign(ext_info, {
            get_way: 'post',
            consignee,
            consignee_mobile,
            consignee_address: consignee_address_city.join('') + consignee_address_info,
            consignee_address_city: consignee_address_city.join(','),
            consignee_address_info
          })
        }
        Object.assign(params, {ext_info})
      }
      console.log(params)
      dispatch({
        type: 'college/pay',
        payload: {
          params,
          cb: (msg, charge_id, payment_method) => {
            if (payment_method === 'online') {
              if (msg === '支付成功') {
                dispatch({
                  type: 'shop/getChargeStatus',
                  payload: {
                    params: {charge_id}
                  }
                })
                Toast.info('购买成功', 2)
                dispatch(routerRedux.push(`/college/success/online`))
              } else {
                Toast.fail(msg || '购买失败', 1)
              }
            } else {
              dispatch(routerRedux.push(`/college/success/offline`))
            }
          }
        }
      })
      resolve()
    })
  }

  onCloseModal () {
    const {dispatch} = this.props
    this.setState({
      modal: false
    })
    dispatch(routerRedux.replace('/college'))
  }

  showErrorMsg () {
    Toast.info('必填')
  }

  componentDidMount () {
    const {match: {params: {id}}, dispatch} = this.props
    dispatch({
      type: 'college/fetchApplyInfo',
      payload: {
        params: {id},
        cb: () => {
          dispatch({
            type: 'college/fetchInvoiceInfo',
            payload: {
              params: {},
              cb: (values) => {
                console.log(values)
                const {vat} = values.user_invoice
                const user_consignee_address = values.user_consignee_address[0]
                this.props.initialize({
                  header: vat.header,
                  // content: [vat.content],
                  taxpayer: vat.taxpayer,
                  taxpayer_id: vat.taxpayer_id,
                  address: vat.address,
                  mobile: vat.mobile,
                  bank_name: vat.bank_name,
                  bank_account: vat.bank_account,
                  consignee: user_consignee_address.consignee,
                  consignee_mobile: user_consignee_address.mobile,
                  consignee_address_city: user_consignee_address.address_city.split(','),
                  consignee_address_info: user_consignee_address.address_info
                })
              }
            }
          })
        }
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    const {applyModel: {apply_status, pay_info}} = nextProps
    if (apply_status !== this.props.applyModel.apply_status && apply_status !== 'valid') {
      console.log('未审核')
      this.setState({
        modal: '您还没有通过审核，请耐心等待'
      })
    }
    // if (pay_info && pay_info.id) {
    //   console.log('已付款')
    //   this.setState({
    //     modal: '您已经成功支付'
    //   })
    // }
  }

  render () {
    const {payType, needTicket, receive} = this.state
    const {applyModel, applyModel: {name, mobile, company, department, job, permanent_area}, handleSubmit, loading} = this.props
    const area = Config.areaList.find(item => item.value === +permanent_area) || {label: ''}
    console.log(this.props)
    return (
      <div className={styles['confirm']}>
        <div className={styles['header']}>
          <h3>恭喜您通过智信资管研习社的入学审核</h3>
          <h3>还差一步就可以成为正式学员</h3>
        </div>
        <div className={styles['confirm-info']}>
          <div className={styles['confirm-info-header']}>报名信息:</div>
          <div className={styles['confirm-info-content']}>
            <p>姓名: {name}</p>
            <p>手机: {mobile}</p>
            <p>上课城市: {area.label}</p>
            <p>单位: {company}</p>
            <p>部门: {department}</p>
            <p>职位: {job}</p>
          </div>
        </div>
        <div className={styles['radio-container']}>
          <Flex>
            <label htmlFor=''>支付方式</label>
            <Flex.Item style={{textAlign: 'center'}} onClick={this.radioChange.bind(this, 'online')}>
              <span className={`radio ${payType === 'online' ? 'active' : ''}`} /><span
              style={{verticalAlign: 'middle'}}>在线支付</span>
            </Flex.Item>
            <Flex.Item style={{textAlign: 'center'}} onClick={this.radioChange.bind(this, 'offline')}>
              <span className={`radio ${payType === 'offline' ? 'active' : ''}`} /><span
              style={{verticalAlign: 'middle'}}>线下支付</span>
            </Flex.Item>
          </Flex>
        </div>
        <div className={styles['ticket-container']}>
          <Flex>
            <label htmlFor=''>是否需要发票</label>
            <Flex.Item style={{textAlign: 'right'}}>
              <Switch onChange={this.switchChange} checked={needTicket} />
            </Flex.Item>
          </Flex>
        </div>
        {
          needTicket ? (
            <form className={styles['ticket-form']}>
              <div className={styles['ticket-form-header']}>增值税专项发票</div>
              {/* <Field label="发票抬头" name="header" type="text" placeholder="请输入发票抬头"  component={FieldInput} /> */}
              <Field label="开票内容" name="content" placeholder="请输入纳税人识别号" component={FieldPicker}
                     dataSource={Config.edu.invoiceContent} row={1} showErrorMsg={this.showErrorMsg} />
              <Field label="公司名称" name="taxpayer" type="text" placeholder="请输入公司名称" component={FieldInput} />
              <Field label="纳税人识别号" name="taxpayer_id" type="text" placeholder="请输入纳税人识别号" component={FieldInput} />
              <Field label="注册地址" name="address" type="text" placeholder="请输入注册地址" component={FieldInput} />
              <Field label="注册电话" name="mobile" type="tel" placeholder="请输入注册电话" component={FieldInput} />
              <Field label="开户行" name="bank_name" type="text" placeholder="请输入开户行" component={FieldInput} />
              <Field label="开户行账号" name="bank_account" type="text" placeholder="请输入开户行账号" component={FieldInput} />
              <div className={styles['radio-container']} style={{borderTop: 'none'}}>
                <Flex>
                  <label>领取方式</label>
                  <Flex.Item style={{textAlign: 'center'}} onClick={this.receiveChange.bind(this, 'offline')}>
                    <span className={`radio ${receive === 'offline' ? 'active' : ''}`} /><span
                    style={{verticalAlign: 'middle'}}>现场领取</span>
                  </Flex.Item>
                  <Flex.Item style={{textAlign: 'center'}} onClick={this.receiveChange.bind(this, 'mailing')}>
                    <span className={`radio ${receive === 'mailing' ? 'active' : ''}`} /><span
                    style={{verticalAlign: 'middle'}}>邮寄</span>
                  </Flex.Item>
                </Flex>
              </div>
              {
                receive === 'mailing' ? (
                  <div>
                    <div className={styles['ticket-form-header']}>收件信息</div>
                    <Field label='收件人' name='consignee' type='text' placeholder='请输入收件人' component={FieldInput} />
                    <Field label='手机号' name='consignee_mobile' type='tel' placeholder='请输入手机号' component={FieldInput} />
                    <Field label='省市区选择' name='consignee_address_city' component={FieldPicker}
                           dataSource={Config.areaData} row={3} />
                    <Field label='详细地址' name='consignee_address_info' type='text' placeholder='请输入详细地址'
                           component={FieldInput} />
                  </div>
                ) : null
              }
            </form>
          ) : null
        }

        <div className={styles['footer']}>
          <Button type='primary' onClick={handleSubmit(this.submit.bind(this))} loading={applyModel.loading}
                  disabled={applyModel.loading}>立即提交</Button>
          <p className={styles['footer-hint']}>有疑问请联系我们: <a
            style={{color: '#3d74c7'}}>{Config.businessSchool.serviceTel}</a></p>
        </div>
        <Modal
          title='抱歉'
          transparent
          maskClosable={false}
          visible={this.state.modal}
          footer={[{text: '确定', onPress: this.onCloseModal}]}
        >
          <p>{this.state.modal}</p>
        </Modal>
      </div>
    )
  }
}
