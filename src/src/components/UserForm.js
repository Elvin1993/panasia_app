import React, { Component } from 'react'
import { Field, Fields, reduxForm, SubmissionError } from 'redux-form'
import { Button } from 'antd-mobile'
import autobind from 'autobind-decorator'
import WXCardUpload from 'components/WXCardUpload'
import styles from './UserForm.less'
import cx from 'classname'
@reduxForm({form: 'UserForm'})
@autobind
export default class UserForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cardVisible: true
    }
  }

  handlerChangeType () {
    this.setState({
      cardVisible: !this.state.cardVisible
    })
  }

  isEmpty (value) {
    return !(value && value.trim() !== '')
  }

  isAllEmpty (array = []) {
    let result = true
    array.map((value) => {
      result = result && !(value && value.trim() !== '')
    })
    return result
  }

  submit (values, dispatch, even) {
    const {isEmpty, isAllEmpty} = this
    const {type, self} = this.props
    const {name, mobile, company, department, job, remark, business_card_a, business_card_b, city} = values
    return new Promise((resolve, reject) => {
      var errors = {}
      if (isEmpty(name)) {
        errors.name = '必填'
      }
      if (isEmpty(mobile)) {
        errors.mobile = '必填'
      } else if (!(/^1\d{10}$/i.test(mobile))) {
        errors.mobile = '手机号码格式不正确'
      }

      if (type === 'confimApply') {
        if (!self && isEmpty(remark)) {
          errors.remark = '必填'
        }
        if (isAllEmpty([company, department, job, business_card_a, business_card_b])) {
          errors.business_card_a = '请上传名片或者填写名片信息'
        } else if (isAllEmpty([business_card_a, business_card_b])) {
          if (isEmpty(company)) {
            errors.company = '必填'
          }
          if (isEmpty(department)) {
            errors.department = '必填'
          }
          if (isEmpty(job)) {
            errors.job = '必填'
          }
        } else if (isAllEmpty([business_card_a, business_card_b])) {
          errors.business_card_a = '请上传名片'
        }
      } else {
        if (type === 'apply' && isEmpty(remark)) {
          errors.remark = '必填'
        }
        if (this.state.cardVisible) {
          if (isAllEmpty([business_card_a, business_card_b])) {
            errors.business_card_a = '请上传名片'
          }
        } else {
          if (isEmpty(company)) {
            errors.company = '必填'
          }
          if (isEmpty(department)) {
            errors.department = '必填'
          }
          if (isEmpty(job)) {
            errors.job = '必填'
          }
        }
      }
      if (Object.keys(errors).length > 0) {
        return reject(new SubmissionError(errors))
      }

      this.props.onSubmitted && this.props.onSubmitted({name, mobile, company, department, job, remark, business_card_a, business_card_b, city})
      resolve()
    })
  }

  renderBCardInfo () {
    return (
      <div>
        <Field name='company' type='text' component={this.renderField} label='单位' />
        <Field name='department' type='text' component={this.renderField} label='部门' />
        <Field name='job' type='text' component={this.renderField} label='职务' />
      </div>
    )
  }

  renderApplyForm () {
    const {handleSubmit, submitting} = this.props
    const {cardVisible} = this.state

    return (
      <form className={cx(styles.user_form, styles.editing)}>
        <h1 className={styles.title}>填写个人信息</h1>
        <h4 className={styles.sub_title}>请认真填写您的报名信息</h4>
        <Field name='name' type='text' component={this.renderField} label='姓名' />

        <Field name='mobile' type='tel' component={this.renderField} label='电话' />
        <Field name='remark' placeholder='填写与本次活动主题相关的职业经历，陈述自己的见解或关注点，将有助于获得参会机会。' component={this.renderTextArea} label='备注' />
        {
          !cardVisible && this.renderBCardInfo()
        }
        {cardVisible && <Fields names={['business_card_a', 'business_card_b']} component={WXCardUpload} type='text' editing />}
        {cardVisible ? <div onClick={this.handlerChangeType}><span className={styles.btn_card}>名片不在手边</span><span className={styles.msg}>（手动填写信息）</span></div>
          : <div onClick={this.handlerChangeType}><span className={styles.btn_card}>一键上传名片</span><span className={styles.msg}>（省去填写信息）</span></div>}
        <Button type='primary' className='my_btn' onClick={handleSubmit(this.submit)} loading={submitting} disabled={submitting}>提交</Button>
      </form>
    )
  }

  renderShopForm () {
    const {handleSubmit, submitting, initialValues} = this.props
    let {name} = initialValues
    const {cardVisible} = this.state

    return (
      <div className={styles.book_user_info}>
        <div className={cx(styles.user_form, styles.editing)}>
          <h1 className={styles.title}>填写相关个人信息 <br />有机会和作者深度交流</h1>
          <Field name='name' disabled={!!name} type='text' component={this.renderField} label='姓名' />
          <Field name='mobile' type='tel' component={this.renderField} label='电话' />
          {
            !cardVisible && this.renderBCardInfo()
          }
          {cardVisible && <Fields names={['business_card_a', 'business_card_b']} component={WXCardUpload} type='text' editing />}
          {cardVisible ? <div onClick={this.handlerChangeType}><span className={styles.btn_card}>名片不在手边</span><span className={styles.msg}>（手动填写信息）</span></div>
            : <div onClick={this.handlerChangeType}><span className={styles.btn_card}>一键上传名片</span><span className={styles.msg}>（上传名片 快速购买）</span></div>}
          <Button type='primary' className='my_btn' onClick={handleSubmit(this.submit)} loading={submitting} disabled={submitting}>去购买</Button>
        </div>
      </div>
    )
  }

  renderLogonForm () {
    const {handleSubmit, submitting} = this.props
    const {cardVisible} = this.state

    return (
      <form className={cx(styles.user_form, styles.editing)}>
        <Field name='name' type='text' component={this.renderField} label='姓名' />
        <Field name='mobile' type='tel' component={this.renderField} label='电话' />
        {
          !cardVisible && this.renderBCardInfo()
        }
        {cardVisible && <Fields names={['business_card_a', 'business_card_b']} component={WXCardUpload} type='text' editing />}
        {cardVisible ? <div onClick={this.handlerChangeType}><span className={styles.btn_card}>名片不在手边</span><span className={styles.msg}>（手动填写信息）</span></div>
          : <div onClick={this.handlerChangeType}><span className={styles.btn_card}>一键上传名片</span><span className={styles.msg}>（省去填写信息）</span></div>}
        <Button type='primary' className='my_btn' onClick={handleSubmit(this.submit)} loading={submitting} disabled={submitting}>提交</Button>
      </form>
    )
  }

  renderConfirmApplyForm () {
    const {handleSubmit, submitting, self, editing = true, onEdit, initialValues} = this.props
    let {name} = initialValues
    return (
      <form className={cx({[styles.user_form]: true, [styles.editing]: editing})}>
        <fieldset disabled={!editing}>
          {
            !self &&
            <div>
              <h1 className={styles.title}>确认个人信息</h1>
            </div>
          }
          <Field name='name' disabled={!!name} type='text' component={this.renderField} label='姓名' />
          <Field name='mobile' type='tel' component={this.renderField} label='电话' />
          {!self && <Field name='remark' placeholder='填写与本次活动主题相关的职业经历，陈述自己的见解或关注点，将有助于获得参会机会。' component={this.renderTextArea} label='备注' />}
          {this.renderBCardInfo()}
          <Fields names={['business_card_a', 'business_card_b']} component={WXCardUpload} type='text' editing={editing} />
        </fieldset>
        <p style={{color: '#dd4b39'}}><i className="icon icon-warn"></i>如果您的信息有变化，请修改!</p>
        {editing && <Button style={{ marginTop: '.2rem' }} type='primary' className='my_btn' onClick={handleSubmit(this.submit)} loading={submitting} disabled={submitting}>{self ? '保存' : '提交'}</Button>}
        {self && !editing && <Button style={{ marginTop: '.2rem' }} type='primary' className='my_btn' onClick={onEdit}>编辑</Button>}

      </form>
    )
  }

  renderTextArea ({input, label, type, meta: {touched, error, warning}, placeholder}) {
    return (
      <div className={styles.field_wrapper}>
        <div className={cx({[styles.row_mx]: true, [styles.row]: true, [styles.field_error]: touched && error})}>
          <label>{label}</label>
          <textarea {...input} placeholder={placeholder} cols='30' rows='4' className={styles.input} />
        </div>
        {touched && ((error && <span className={styles.error}>{error}</span>) || (warning && <span className={styles.warn}>{warning}</span>))}
      </div>

    )
  }

  renderField ({input, label, type, disabled, meta: {touched, error, warning}}) {
    return (
      <div className={styles.field_wrapper}>
        <div className={cx({[styles.row]: true, [styles.field_error]: touched && error, [styles.field_disabled]: disabled})}>
          <label>{label}</label>
          <input {...input} type={type} disabled={disabled} className={styles.input} />
        </div>
        {touched && ((error && <span className={styles.error}>{error}</span>) || (warning && <span className={styles.warn}>{warning}</span>))}
      </div>

    )
  }

  render () {
    const {type} = this.props

    if (type === 'apply') {
      return this.renderApplyForm()
    } else if (type === 'confimApply') {
      return this.renderConfirmApplyForm()
    } else if (type === 'shopForm') {
      return this.renderShopForm()
    } else {
      return this.renderLogonForm()
    }
  }
}
