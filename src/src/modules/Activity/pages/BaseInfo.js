import React from 'react'
import { connect } from 'dva'
import autobind from 'autobind-decorator'
import { Link } from 'dva/router'
import ReactPlaceholder from 'react-placeholder'
import { TextBlock, TextRow, RectShape } from 'react-placeholder/lib/placeholders'
import Dialog from 'rc-dialog'
import 'rc-dialog/assets/index.css'
import { clearStyle, isNotEmpty, trim } from 'utils/helper'
import styles from './BaseInfo.less'

@connect(state => ({
  ...state.activity.activityBaseInfo,
  // loading: state.loading.models.activity
  loading: state.loading.global
}))
@autobind
export default class ActivityBaseInfo extends React.Component {
  static propTypes = {}

  constructor (props) {
    super(props)
    this.state = {
      dialogVisible: false
    }
  }

  // componentDidMount() {
  //   const { dispatch, match: {params: {aid}}, dataset } = this.props
  //   if (!aid || dataset.id) {
  //     return
  //   }
  //
  //   dispatch({
  //     type: 'activity/fetchActivityBaseInfo',
  //     payload: {params: {id:aid}}
  //   })
  // }

  showQRCode () {
    this.setState({
      dialogVisible: true
    })
  }

  hideQRcode () {
    this.setState({
      dialogVisible: false
    })
  }

  renderMsg () {
    const {dataset: {id, apply_status, user_status}} = this.props
    let prompt = null
    if (user_status === 'INVALID') {
      prompt = <span>很抱歉，由于名额有限，您未能通过本次活动报名审核。我们希望下次有更合适的活动，再请您参加。<br /><a href='https://mp.weixin.qq.com/s?__biz=MzA3NjE3MzYwMQ==&mid=203780394&idx=2&sn=6d1ae9ddb0e3644e88a0a12a07c5fb72'>点击查看“智信活动嘉宾审核标准”</a></span>
    } else if (user_status === 'VALID') {
      prompt = <span>恭喜您已通过本次活动报名审核！请携带本人名片准时到场参会。<br /><Link to={`/activity/agenda/${id}`}>点击查看活动议程单</Link></span>
    } else if (user_status === 'PENDING') {
      prompt = <span>您的报名信息已收到！我们在逐一确认报名嘉宾的话题相关度与专业性，请稍后！</span>
    }

    return (
      // apply_status 1报名0没报名
      apply_status ? <div className={styles.prompt_msg}>
        {prompt}
      </div>
        : null
    )
  }

  awesomePlaceholder () {
    const color = '#f2f6f9'
    return (
      <div className={styles.base_info_box}>
        <RectShape className={styles.img} style={{height: 340}} color={color} />
        <div className={styles.base_info_content}>
          <h3 className={styles.bold_title}>
            <TextRow style={{width: 300}} rows={5} color={color} />
          </h3>
          <TextBlock className={styles.activity_des} rows={7} color={color} />
        </div>
      </div>
    )
  }

  render () {
    const {loading, dataset} = this.props
    const {
      id, type, logo_url: banner, content: activity_des, subject, meeting_time, meeting_endtime, meeting_hour, meeting_endhour, area_id, max_user_count, join_deadline, speaker, circuit,
      honor_guest, requirement, notice, weixin, wx_qrcode: admin_weixin_qrcode, status, pending_status, apply_status, admin_mobile
    } = dataset
    const meeting_date = meeting_endtime ? (meeting_time + ' - ' + meeting_endtime) : meeting_time

    return (
      <ReactPlaceholder customPlaceholder={this.awesomePlaceholder()} ready={!loading}>
        <div className={styles.base_info_box}>
          <div className={styles.img_box}>
            <img src={banner} alt='活动形象图' className={styles.logo_img} />
          </div>
          <div className={styles.base_info_content}>
            {this.renderMsg()}
            <h3 className={styles.bold_title}>活动描述</h3>
            <div
              className={styles.activity_des} dangerouslySetInnerHTML={{
                __html: clearStyle(activity_des)
              }}
            />
            <h3 className={styles.bold_title}>活动基本信息</h3>
            <ul className={styles.base_info}>
              <li>
                <label className={styles.label}>活动主题：</label>
                <div>{subject}</div>
              </li>
              <li>
                <label className={styles.label}>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间：</label>
                <div>{meeting_date}<br />{meeting_hour} - {meeting_endhour}</div>
              </li>
              <li>
                <label className={styles.label}>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点：</label>
                <div>{area_id}</div>
              </li>
              <li>
                <label className={styles.label}>人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数：</label>
                <div>{max_user_count}</div>
              </li>
              <li>
                <label className={styles.label}>报名截止：</label>
                <div>{join_deadline}</div>
              </li>
            </ul>

            {
              trim(speaker) ? <div>
                <h3 className={styles.bold_title}>主讲嘉宾介绍</h3>
                <div className={styles.info} dangerouslySetInnerHTML={{__html: clearStyle(speaker)}} />
              </div>
                : null
            }

            <h3 className={styles.bold_title}>活动流程</h3>
            <div className={styles.info} dangerouslySetInnerHTML={{__html: circuit}} />

            {
              trim(honor_guest) ? <div>
                <h3 className={styles.bold_title}>部分参与机构</h3>
                <div className={styles.info} dangerouslySetInnerHTML={{__html: honor_guest}} />
              </div>
                : null
            }

            {
              requirement ? <div>
                <h3 className={styles.bold_title}>报名要求</h3>
                <div className={styles.info} dangerouslySetInnerHTML={{__html: requirement}} />
              </div>
                : null
            }

            {
              notice && isNotEmpty(notice) ? <div>
                <h3 className={styles.bold_title}>注意事项</h3>
                <div className={styles.info} dangerouslySetInnerHTML={{__html: notice}} />
              </div>
                : null
            }

            {
              weixin ? <div>
                <h3 className={styles.bold_title}>咨询更多信息</h3>
                <ul className={styles.contact_info}>
                  {
                    admin_weixin_qrcode && <li onClick={this.showQRCode}>
                      <div className={styles.left}>
                        <i className='icon icon-arrows-right' />点击添加活动经理微信号
                      </div>
                      <img src={admin_weixin_qrcode} alt='二维码' /></li>
                  }
                  {
                    admin_mobile && <li><a className={styles.call} href={`tel:${admin_mobile}`}>
                      <div className={styles.left}>
                        <i className='icon icon-arrows-right' />有疑问请拨打
                        <i className={styles.mobile}>{admin_mobile}</i></div>
                      <i className='icon icon-phone' /></a>
                    </li>
                  }
                </ul>
              </div>
                : null
            }
          </div>
          <Dialog
            visible={this.state.dialogVisible}
            animation='zoom'
            maskAnimation='fade'
            onClose={this.hideQRcode}
            closable
            wrapClassName='my-dialog-wrap ercode'
          >
            <img src={admin_weixin_qrcode} className='show_hide' alt='二维码' />
            <img src={admin_weixin_qrcode} className='show_code' alt='二维码' />
            <p className='text_blue'>长按识别二维码</p>
            <p className='text_blue'>即可添加活动经理微信号码</p>
          </Dialog>
          {
            (status === 'PENDING' && (pending_status | 0) === 2 && (apply_status | 0) !== 1) ? <Link to={`/activity/${id}/apply`} className={styles.footer}>
              <button className={styles.btn}>我要报名</button>
            </Link>
              : null
          }
        </div>
      </ReactPlaceholder>
    )
  }
}
