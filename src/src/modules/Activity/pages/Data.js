import { Checkbox } from 'antd-mobile'
import autobind from 'autobind-decorator'
import DataList from 'components/DataList'
// import Checkbox from 'rc-checkbox';
import { connect } from 'dva'
import moment from 'moment'
import 'rc-dialog/assets/index.css'
import React from 'react'
import styles from './Data.less'

@connect(state => ({...state.activity.activityDataModel, loading: state.loading.models.activity}))
@autobind
export default class ActivityData extends React.Component {
  static propTypes = {}

  constructor (props) {
    super(props)
    this.state = {
      dialogVisible: false,
      errorMsg: null
    }
  }

  componentDidMount () {
    const {dispatch, match: {params: {aid}}, dataset} = this.props
    if (!aid || dataset.length > 0) {
      return
    }

    dispatch({
      type: 'activity/fetchActivityData',
      payload: {
        params: {aid}
      }
    })
  }

  send2Email () {
    this.setState({
      dialogVisible: true
    })
  }

  hideQRcode () {
    this.setState({
      dialogVisible: false
    })
  }

  getSmallExt (ext = '?') {
    return ext.substr(0, 1)
  }

  handlerChangeCheckBox (id) {
    const {dispatch} = this.props
    dispatch({type: 'activity/selectFile', payload: {id}})
  }

  handlerChangeEmal (e) {
    const userEmail = e.target.value
    const {dispatch} = this.props
    dispatch({type: 'activity/setUserEmail', payload: {userEmail}})
  }

  postEmail (params, cb) {
    const {dispatch} = this.props
    params.aid = params.id
    delete params.id
    dispatch({type: 'activity/postFile2Email', payload: {params, cb}})
  }

  renderItem (row, showCheckBox = true) {
    return (
      <label className={styles.activity_item} key={row.id}>
        {
          showCheckBox &&
          <Checkbox
            className={styles.btn_select}
            checked={row.checked}
            onChange={() => this.handlerChangeCheckBox(row.id)}
            disabled={this.state.disabled}
          />
        }
        <div className='file-icon file-icon-lg' data-type={this.getSmallExt(row.extension)}
             style={{background: row.extension_bg}} />
        <div className={styles.file_info_box}>
          <div className={styles.file_name}>{row.name}</div>
          <div className={styles.file_info}>
            <span className={styles.file_time}>{moment(row.create_time * 1000).format('YYYY.MM.DD')}</span>
            <span className={styles.size}>{row.size}</span>
          </div>
        </div>
        {!showCheckBox && <div className={styles.btn_close} onClick={() => this.handlerChangeCheckBox(row.id)}><i
          className='icon icon-close' /></div>}
      </label>
    )
  }

  render () {
    const {dispatch, dataset = [], userEmail, sendOk = false, loading, match: {params: {aid}}} = this.props
    console.log(loading)
    return (
      <DataList dataset={dataset} loading={loading} id={aid} postEmail={this.postEmail} email={userEmail} />
    )
  }

  // render () {
  //   const {dispatch, dataset = [], userEmail, sendOk = false, loading} = this.props
  //   const selectList = dataset.filter(x => x.checked) || []
  //   return (
  //     <div className={styles.activity_data_wrapper}>
  //       <div className={styles.list_box}>
  //         {
  //           dataset.length > 0 ? dataset.map((item) => {
  //             return this.renderItem(item, true)
  //           })
  //             : (!loading ? <div className={styles.empty_box}>暂时没有活动资料</div> : null)

  //         }
  //       </div>
  //       <div className={styles.footer}>
  //         <button className={cx('btn', 'btn-blue', styles.btn_send2email)} onClick={this.send2Email} disabled={selectList.length <= 0}>一键发送到邮箱</button>
  //       </div>
  //       <Dialog
  //         visible={this.state.dialogVisible}
  //         animation='zoom'
  //         maskAnimation='fade'
  //         onClose={this.hideQRcode}
  //         wrapClassName='my-dialog-wrap'
  //         closable={false}
  //       >
  //         <h3>请填写你的个人邮箱</h3>
  //         <input type='text' value={userEmail} onChange={this.handlerChangeEmal} />
  //         <p className='my-msg'>我们将把活动资料发送到你个人邮箱，请确保
  //           邮箱填写正确。</p>
  //         <div className={cx(styles.list_box, styles.small)}>
  //           {
  //             selectList.length > 0 && selectList.map((item) => {
  //               return this.renderItem(item, false)
  //             })
  //           }
  //         </div>
  //         <div className='my-dialog-box'>
  //           <button className='btn btn-blue' onClick={this.postSendEmail}>发送</button>
  //           <button className='btn' style={{marginLeft: '25px'}} onClick={this.hideQRcode}>取消</button>
  //         </div>
  //       </Dialog>

  //       <Dialog
  //         visible={sendOk}
  //         animation='zoom'
  //         maskAnimation='fade'
  //         onClose={() => dispatch({type: 'activity/clearFileOperation'})}
  //         wrapClassName='my-dialog-wrap'
  //         closable={false}
  //       >
  //         <h3>发送成功</h3>
  //         <p className='my-msg'>活动资料已发送到{userEmail}的邮箱，请注意查收</p>
  //         <div className='my-dialog-box'>
  //           <button className='btn btn-blue' onClick={() => dispatch({type: 'activity/clearFileOperation'})}>我知道了</button>
  //         </div>
  //       </Dialog>
  //       <Spinner loading={loading} mask={false} />
  //     </div>
  //   )
  // }
}

// export default connect(state => ({count: state.count}))(HomePage);
