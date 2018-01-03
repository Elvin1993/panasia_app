import autobind from 'autobind-decorator'
import Spinner from 'components/Spinner'
import UserForm from 'components/UserForm'
import { connect } from 'dva'
import { Link } from 'dva/router'
import Dialog from 'rc-dialog'
import 'rc-dialog/assets/index.css'
import React from 'react'
import styles from './ApplyPage.less'

@connect(state => ({
  ...state.activity.applyModel,
  loading: state.loading.global
}))
@autobind
export default class ApplyPage extends React.Component {
  static propTypes = {}

  constructor (props) {
    super(props)
    this.state = {
      showMsg: false
    }

    this.checkLogin()
  }

  checkLogin () {
    const next_url = location.href
    const {dispatch} = this.props
    dispatch({
      type: 'my/checkLogin',
      payload: {next_url}
    })
  }

  componentDidMount () {
    const {dispatch, match: {params: {aid}}} = this.props

    dispatch({
      type: 'activity/checkApplyed',
      payload: {params: {aid}}
    })

    dispatch({
      type: 'activity/fetchUserInfo'
    })
  }

  handlerSubmitted (v) {
    const {dispatch, match: {params: {aid}}} = this.props

    dispatch({
      type: 'activity/userApply',
      payload: {params: {...v, aid}, cb: () => this.setState({showMsg: true})}
    })
  }

  render () {
    console.log(this.props)
    const {loading, dataset = {}, dataset: {status}, match: {params: {aid}}} = this.props
    const type = (status === 'WEIXIN') ? 'apply' : 'confimApply'
    const WX_FollowURL = 'http://mp.weixin.qq.com/s?__biz=MzA3NjE3MzYwMQ==&mid=203780394&idx=1&sn=fdb290bdef350c039acc5a97ca647060#rd'

    return (
      <div className={styles.apply_page}>
        {
          dataset.id &&
          <UserForm initialValues={{...dataset, remark: ''}} type={type} onSubmitted={this.handlerSubmitted} />
        }
        <Spinner loading={loading} />
        <Dialog
          visible={this.state.showMsg}
          animation='zoom'
          maskAnimation='fade'
          closable={false}
          onClose={this.hideSuccessDialog}
          maskStyle={{backgroundColor: '#fff'}}
          wrapClassName='success-dialog-wrap'
        >
          <h1>您的报名信息已提交</h1>
          <h2>关注“智信网”服务号<br />第一时间获得通知信息。<br /><span className='text_blue'>请务必关注！</span></h2>
          <img src='img/zx_code.png' className='hide_code' alt='二维码' />
          <img src='img/zx_code.png' className='code_box ' alt='二维码' />
          <h2 style={{marginBottom: '30px'}}>长按识别二维码关注</h2>
          <a href={WX_FollowURL} className='btn btn-blue'>去关注</a>
          <Link to={`/activity/${aid}?purl=/activity`} className=' btn btn-cancel'>暂不关注</Link>
        </Dialog>
      </div>
    )
  }
}

// export default connect(state => ({count: state.count}))(HomePage);
