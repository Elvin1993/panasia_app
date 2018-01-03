import React from 'react'
import { Link } from 'dva/router'
import { Flex, InputItem, Picker, Icon, TextareaItem, Button } from 'antd-mobile'
import Dialog from 'rc-dialog'
import { Field, Fields, reduxForm, SubmissionError } from 'redux-form'
import cx from 'classname'
import WXCardUpload from 'components/WXCardUpload'
import styles from './Apply.less'
import Config from 'utils/Config'

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

const PickerHolder = props => (
  <div
    onClick={props.onClick}
    className={styles['picker-holder']}
  >
    <div style={{ display: 'flex', height: '0.6rem', lineHeight: '0.6rem' }}>
      <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}></div>
      <div style={{ textAlign: 'right', color: '#888' }}>{props.extra}</div>
    </div>
  </div>
)

const TextArea = ({input, label, type, meta: {touched, error, warning}, placeholder}) => (
  <div style={{ margin: `0 .3rem ${ touched && error ? '0' : '.3rem' }`, overflow: 'hidden' }}>
    <div className={cx({
      [styles.field]: true,
      [styles.field_error]: touched && error
    })}>
      <Flex className="textarea-flexbox">
        <label>{label}:</label>
        <Flex.Item>
          <textarea {...input} placeholder={placeholder} className={styles['textarea']} />
        </Flex.Item>
      </Flex>
    </div>
    {touched && ((error && <span className={styles.error}>{error}</span>) || (warning && <span className={styles.warn}>{warning}</span>))}
  </div>
)

const FieldInput = ({input, label, type, meta: {touched, error, warning}, placeholder}) => {
  return (
  <div style={{ margin: `0 .3rem ${ touched && error ? '0' : '.3rem' }`, overflow: 'hidden' }}>
    <div className={cx({
      [styles.field]: true,
      [styles.field_error]: touched && error
    })}>
      <Flex>
        <label>{label}:</label>
        <Flex.Item>
          <InputItem {...input} type={type} placeholder={placeholder} />
        </Flex.Item>
      </Flex>
    </div>
    {touched && ((error && <span className={styles.error}>{error}</span>) || (warning && <span className={styles.warn}>{warning}</span>))}
  </div>
)
}

const FieldPicker = ({input, label, type, meta: {touched, error, warning}, placeholder}) => (
  <div style={{ margin: `0 .3rem ${ touched && error ? '0' : '.3rem' }`, overflow: 'hidden' }}>
    <div className={cx({
      [styles.field]: true,
      [styles.field_error]: touched && error
    })}>
      <Flex>
        <label htmlFor={input.name}>上课城市:</label>
        <Flex.Item>
          <Picker
            data={Config.areaList}
            title="选择城市"
            cols={1}
            {...input}
          >
            <PickerHolder />
          </Picker>
        </Flex.Item>
      </Flex>
    </div>
    {touched && ((error && <span className={styles.error}>{error}</span>) || (warning && <span className={styles.warn}>{warning}</span>))}
  </div>
)

@connect(state => {
  const { myInfoModel } = state.my
  return {
    userInfo: {...myInfoModel.dataset},
    initialValues: {
      username: myInfoModel.dataset.name,
      mobile: myInfoModel.dataset.mobile,
      company: myInfoModel.dataset.company,
      department: myInfoModel.dataset.department,
      job: myInfoModel.dataset.job,
      business_card_a: myInfoModel.dataset.business_card_a,
      business_card_b: myInfoModel.dataset.business_card_b
    },
    loading: state.loading.global,
  }
})
@reduxForm({
  form: 'ApplyForm'
})
export default class Apply extends React.Component {
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.toggle = this.toggle.bind(this)
  }
  state = {
    pickerValue: '',
    showMsg: false,
    selectDetail: false
  }

  submit(values, dispatch, event) {
    console.log(values)
    const { username, mobile, company, department, job, area, business_card_a, business_card_b, reason } = values
    return new Promise((resolve, reject) => {
      var errors = {}
      if (isEmpty(username)) {
        errors.username = '必填'
      }
      if (isEmpty(mobile)) {
        errors.mobile = '必填'
      } else if (!(/^1\d{10}$/i.test(mobile))) {
        errors.mobile = '手机号码格式不正确'
      }
      if (!area || area.length <= 0) {
        errors.area = '必填'
      }

      // if (isEmpty(reason)) {
      //   errors.reason = '必填'
      // }

      if (this.state.selectDetail) {
        if (isEmpty(company)) {
          errors.company = '必填'
        }
        if (isEmpty(department)) {
          errors.department = '必填'
        }
        if (isEmpty(job)) {
          errors.job = '必填'
        }
      } else {
        if (isAllEmpty([business_card_a, business_card_b])) {
          errors.business_card_a = '请上传名片'
        }
      }

      if (Object.keys(errors).length > 0) {
        return reject(new SubmissionError(errors))
      }
      console.log('submit')
      dispatch({
        type: 'college/apply',
        payload: {
          params: {
            name: username,
            mobile,
            company,
            department,
            job,
            business_card_a,
            business_card_b,
            apply_remark: reason,
            permanent_area: area[0]
          },
          cb: () => {
            this.setState({
              showMsg: true
            })
          }
        }
      })
      resolve()
    })
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'college/fetchApplyStatus',
      payload: {
        params: {}
      }
    })
  }

  toggle() {
    const selectDetail = !this.state.selectDetail
    this.setState({
      selectDetail
    })
  }

  render() {
    const { handleSubmit, submitting, loading, userInfo } = this.props
    const { selectDetail } = this.state
    const WX_FollowURL = 'http://mp.weixin.qq.com/s?__biz=MzA3NjE3MzYwMQ==&mid=203780394&idx=1&sn=fdb290bdef350c039acc5a97ca647060#rd'
    return (
      <div className={styles['apply']}>
        <div className={styles['header']}>
          <h3>请填写您的真实信息</h3>
          <h3>后续工作人员会与您沟通</h3>
        </div>
        <form>
          <Field label="姓名" name="username" type="text" component={FieldInput} />
          <Field label="手机" name="mobile" type="tel" component={FieldInput} />
          <Field label="上课城市" name="area" component={FieldPicker} />
          <Field name="reason" component={TextArea} placeholder='可陈述个人履历、业务专长，对"智信资管研习社"的意见和建议等信息。' label="备注" />
          {
            selectDetail ? (
              <div>
                <Field label="单位" name="company" type="text" component={FieldInput} />
                <Field label="部门" name="department" type="text" component={FieldInput} placeholder='公司级领导请填"高管"' />
                <Field label="职务" name="job" type="text" component={FieldInput} />
                <div style={{ margin: '0 .3rem .3rem' }} onClick={this.toggle}><span className={styles.btn_card}>一键上传名片</span><span className={styles.msg}>（省去填写信息）</span></div>
              </div>
            ) : (
              <div style={{ margin: '0 .3rem .3rem' }}>
                <Fields names={['business_card_a', 'business_card_b']} component={WXCardUpload} type='text' editing />
                <div onClick={this.toggle}><span className={styles.btn_card}>名片不在手边</span><span className={styles.msg}>（手动填写信息）</span></div>
              </div>
            )
          }
          <div className={styles['footer']}>
            <Button type="primary" onClick={handleSubmit(this.submit)} loading={loading} disabled={loading}>提交报名申请</Button>
          </div>
        </form>
         <Dialog
          visible={this.state.showMsg}
          animation='zoom'
          maskAnimation='fade'
          closable={false}
          onClose={this.hideSuccessDialog}
          maskStyle={{backgroundColor: '#fff'}}
          wrapClassName='success-dialog-wrap'
        >
          <h1>您的入学申请已提交</h1>
          <h1>请等待工作人员的审核</h1>
          <h2>关注“智信网”服务号<br />第一时间获得通知信息。<br /><span className='text_blue'>请务必关注！</span></h2>
          <img src='img/zx_code.png' className='hide_code' alt='二维码' />
          <img src='img/zx_code.png' className='code_box ' alt='二维码' />
          <h2 style={{marginBottom: '30px'}}>长按识别二维码关注</h2>
          <a href={WX_FollowURL} className='btn btn-blue'>去关注</a>
          {/* <Link to='/college' className=' btn btn-cancel'>暂不关注</Link> */}
        </Dialog>
      </div>
    )
  }
}
