import { Picker, List, Switch, Modal, Icon, Radio } from 'antd-mobile'
import cx from 'classname'
import { Field, reduxForm } from 'redux-form'
import styles from './OrderForm.less'

const RadioItem = Radio.RadioItem

let maskProps
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault()
  }
}

@reduxForm({
  form: 'OrderForm',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})
@autobind
export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      is_need_invoice: false
    }
  }

  renderText ({input, label, type, disabled, placeholder = '请输入', meta: {touched, error, warning}}) {
    return (
      <div className={cx({
        [styles.row]: true,
        [styles.field_error]: true || (touched && error),
        [styles.field_disabled]: disabled
      })}>
        <label>{label}</label>
        <input {...input} type={type} disabled={disabled} className={styles.input} placeholder={placeholder} />
        {touched && ((error &&
          <span className={styles.error} style={{paddingRight: '30px'}}>{error}</span>) || (warning &&
          <span className={styles.warn}>{warning}</span>))}
      </div>
    )
  }

  renderSwitch ({input, label, type, disabled, meta: {touched, error, warning}}) {
    return (
      <List.Item extra={<Switch {...input} onChange={(v) => {
        this.setState({is_need_invoice: v})
        input.onChange(v)
      }} checked={input.value} />}>
        {label}
      </List.Item>
    )
  }

  renderPicker ({input, label, data, title, cols, extra, meta: {touched, error, warning}}) {
    return (
      <List className={cx({[styles.picker_list]: true, [styles.field_error]: touched && error})}>
        <Picker {...input} data={data} title={title} cols={cols}
                extra={touched && error ? <span className={styles.error}>{error}</span> : extra}
        >
          <List.Item arrow={touched && error ? false : 'horizontal'}>{label}</List.Item>
        </Picker>
      </List>
    )
  }

  showPopup (data, title, input) {
    this.setState({
      isPopup: true,
      popData: data,
      popTitle: title,
      popInput: input
    })
  }

  renderSelect ({input, list, title, extra, meta: {touched, error, warning}}) {
    return (
      <List.Item extra={input.value} arrow='horizontal'
                 onClick={() => this.showPopup(list, title, input)}>{title}</List.Item>
    )
  }

  renderPopup () {
    const {isPopup, popData: data, popTitle: title, popInput: input} = this.state
    if (!isPopup) {
      return null
    }
    return (
      <Modal popup
             visible={this.state.isPopup}
             animationType="slide-up"
             maskClosable={false}>
        <div>
          <List renderHeader={() => (
            <div style={{position: 'relative'}}>
              {title}
              <span
                style={{
                  position: 'absolute', right: 3, top: -5
                }}
                onClick={() => {
                  this.setState({
                    isPopup: false
                  })
                }}
              >
            <Icon type='cross' />
          </span>
            </div>)}
                className='popup-list'
          >
            {data.map(i => (
              <RadioItem key={i.value} checked={input.value === i.value} onClick={() => {
                input.onChange(i.value)
                this.props.onChangeExpress(i.value)
                this.setState({
                  isPopup: false
                })
              }}>
                {i.label}{!!+i.base_money && `，运费：¥ ${i.base_money}元`}
                {!!+i.base_money && <List.Item.Brief>费用标准：{i.extra}</List.Item.Brief>}
              </RadioItem>
            ))}
          </List>
        </div>
      </Modal>
    )
  }

  render () {
    const {handleSubmit, showInvoice, expressList = [], onChangeExpress} = this.props

    return (
      <form onSubmit={handleSubmit} className={styles.order_form}>
        {this.renderPopup()}
        <List className={styles.consignee_info}>
          <Field name='consignee' type='text' component={this.renderText} label='收件人' />
          <Field name='consignee_mobile' type='tel' component={this.renderText} label='手机号' />
          <Field name='consignee_address_city' component={this.renderPicker} label='省市区选择:' data={Config.areaData}
                 title='选择地区' cols={3} extra='请选择省市区' />
          <Field name='consignee_address_info' type='text' component={this.renderText} label='详细地址' />
        </List>

        {expressList.length > 0 &&
        <List className={styles.consignee_info}><Field name='express_name' component={this.renderSelect} label='运送方式:'
                                                       list={expressList} title='选择运送方式' /></List>}

        {
          showInvoice &&
          <List>
            <Field name='is_need_invoice' component={this.renderSwitch} label='是否需要开具发票' />
            {
              this.state.is_need_invoice &&
              <div>
                <Field name='header' type='text' component={this.renderText} label='发票抬头' />
                <Field name='taxpayer_id' type='text' component={this.renderText} label='纳税人识别号' />
              </div>
            }
          </List>
        }

      </form>
    )
  }
}
