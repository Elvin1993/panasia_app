import { Picker, List } from 'antd-mobile'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import styles from './InvoiceForm.less'
import cx from 'classname'

@reduxForm({
  form: 'InvoiceForm',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})
@autobind
export default class extends React.Component {
  constructor (props) {
    super(props)
  }

  renderText ({input, label, type, disabled, placeholder = '请输入', meta: {touched, error, warning}}) {
    return (
      <div className={cx({[styles.row]: true, [styles.field_error]: touched && error, [styles.field_disabled]: disabled})}>
        <label>{label}</label>
        <input {...input} type={type} disabled={disabled} className={styles.input} placeholder={placeholder} />
        {touched && ((error && <span className={styles.error}>{error}</span>) || (warning && <span className={styles.warn}>{warning}</span>))}
      </div>

    )
  }

  renderPicker ({input, label, data, title, cols, extra, meta: {touched, error, warning}}) {
    return (
      <List className={cx({[styles.picker_list]: true, [styles.field_error]: touched && error})}>
        <Picker {...input} data={data} title={title} cols={cols} extra={touched && error ? <span className={styles.error}>{error}</span> : extra}
        >
          <List.Item arrow={touched && error ? false : 'horizontal'}>{label}</List.Item>
        </Picker>
      </List>
    )
  }

  isEmpty (value) {
    return !(value && value.trim() !== '')
  }

  validate (values, _error = '操作失败') {
    const {isEmpty} = this
    const {type, header, content = [], taxpayer, taxpayer_id, address, mobile, bank_name, bank_account, consignee, consignee_mobile, consignee_address_city = [], consignee_address_info} = values
    // let content = (values.content || []).join('')
    // TODO 验证组件, values.content是否先join后再验证?
    let errors = {}
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
      } else if (!(/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/i.test(mobile))) {
        errors.mobile = '注册电话格式不正确'
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

    if (Object.keys(errors).length) {
      errors._error = _error
      // throw new SubmissionError(errors)
    }
    return errors
  }

  submit (values, dispatch, even) {
    const {type, header, content = [], taxpayer, taxpayer_id, address, mobile, bank_name, bank_account, consignee, consignee_mobile, consignee_address_city = [], consignee_address_info} = values

    return new Promise((resolve, reject) => {
      const errors = this.validate(values)

      if (Object.keys(errors).length > 0) {
        return reject(new SubmissionError(errors))
      }

      const params = {
        ...values,
        consignee_address: consignee_address_city.join('') + consignee_address_info,
        consignee_address_city: consignee_address_city.join(','),
        content: content.join('')
      }
      this.props.onSubmitted && this.props.onSubmitted(params, resolve, reject)
      return resolve()
    })
  }

  render () {
    const {handleSubmit, type} = this.props
    return (
      <div className={styles.invoice_form}>
        {
          type === 'plain' ? (
            <div>
              <div className={styles.title}>发票详情</div>
              <Field name='header' type='text' component={this.renderText} label='发票抬头' />
              <Field name='content' component={this.renderPicker} label='发票内容:' data={Config.edu.invoiceContent} title='选择发票内容' cols={1} extra='请选择发票内容' />
            </div>
          ) : (
            <div>
              <div className={styles.title}>发票详情</div>
              <Field name='content' component={this.renderPicker} label='发票内容:' data={Config.edu.invoiceContent} title='选择发票内容' cols={1} extra='请选择发票内容' />
              <Field name='taxpayer' type='text' component={this.renderText} label='公司名称' />
              <Field name='taxpayer_id' type='text' component={this.renderText} label='纳税人识别号' />
              <Field name='address' type='text' component={this.renderText} label='注册地址' />
              <Field name='mobile' type='text' component={this.renderText} label='注册电话' />
              <Field name='bank_name' type='text' component={this.renderText} label='开户行' />
              <Field name='bank_account' type='text' component={this.renderText} label='开户行账号' />
            </div>
          )
        }
        <div className={styles.title}>收件信息</div>
        <Field name='consignee' type='text' component={this.renderText} label='收件人' />
        <Field name='consignee_mobile' type='tel' component={this.renderText} label='手机号' />
        <Field name='consignee_address_city' component={this.renderPicker} label='省市区选择:' data={Config.areaData} title='选择地区' cols={3} extra='请选择省市区' />
        <Field name='consignee_address_info' type='text' component={this.renderText} label='详细地址' />

        <div className={styles.footer}>
          <button onClick={handleSubmit(this.submit)} className='btn btn-blue'>提交</button>
        </div>
      </div>
    )
  }
}
