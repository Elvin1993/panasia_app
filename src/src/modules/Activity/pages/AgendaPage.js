import autobind from 'autobind-decorator'
import cx from 'classname'
import BaiduMap from 'components/BaiduMap'
import Spinner from 'components/Spinner'
import { connect } from 'dva'
import { Link } from 'dva/router'
import React from 'react'
import { trim, clearStyle, clearStyle1 } from 'utils/helper'
import styles from './AgendaPage.less'

@connect(state => ({
  ...state.activity.agendaModal,
  loading: state.loading.global
}))
@autobind
export default class AgendaPage extends React.Component {
  static propTypes = {}

  constructor (props) {
    super(props)
    this.category = {
      'S': '沙龙',
      'C': '咖啡',
      'O': '活动'
    }
  }

  componentDidMount () {
    const {dispatch, match: {params: {aid}}} = this.props

    dispatch({
      type: 'activity/fetchAgenda',
      payload: {params: {aid}, cb: (v) => wx.ready(() => this.initWXShare(v))}
    })
  }

  initWXShare (v) {
    // let link = location.href.replace(/\?(.*)/, '')
    let {origin, hash} = location
    hash = hash.replace(/\?(.*)/, '')
    const link = `${origin}/${hash}`
    let {dataset: {title, logo_url: imgUrl, type = 'S'}} = v
    document.title = `智信 • 活动 - ${title}`
    imgUrl = encodeURI(imgUrl)
    const message = {
      title: '智信 • 活动 - 议程单',
      link: link,
      imgUrl: imgUrl || `${origin}/img/agenda_O.jpg`,
      desc: title,
      type: 'link'
    }

    let tlmessage = {...message, title: `议程单 - ${title}`}
    wx.onMenuShareAppMessage(message)
    wx.onMenuShareQQ(message)
    wx.onMenuShareTimeline(tlmessage)
  }

  isShow (obj) {
    return obj && trim(obj) !== '' && clearStyle(obj) !== '<p><span>&nbsp;</span></p>'
  }

  submit () {
    const {dataset = {}, dispatch} = this.props
    const {id} = dataset
    dispatch({type: 'activity/updateAgendaUser', payload: {params: {id, is_confirm: 'Y'}}})
  }

  render () {
    const {dataset = {}, loading, match: {params: {aid}}} = this.props
    const {title, num = '', stime, address, meeting_info, user_name, usertel, other_name, othertel, circuit, speaker, way, heed, type, is_confirm, user = [], remark, status = false} = dataset
    const {isShow} = this
    const userList = user.map((item, i) => {
      return (
        <li key={i}>
          <table>
            <tbody>
            <tr>
              <td>姓&nbsp;&nbsp;&nbsp;&nbsp;名:</td>
              <td>{item.name}</td>
            </tr>
            <tr>
              <td>单&nbsp;&nbsp;&nbsp;&nbsp;位:</td>
              <td>{item.company}</td>
            </tr>
            <tr>
              <td>职&nbsp;&nbsp;&nbsp;&nbsp;务:</td>
              <td>{item.job}</td>
            </tr>
            </tbody>
          </table>
        </li>
      )
    })
    return (
      <div className={styles.apply_page}>
        <div className={styles.top_img} data-type={type} />
        <div className={styles.content}>
          <h1 className={styles.top_title}>{title}</h1>

          <div className={styles.box}>
            <div className={styles.row}>
              <label>期 数</label>
              <span>{`智信·资管${this.category[type] || ''}${num}期`}</span>
            </div>
            <div className={styles.row}>
              <label>时 间</label>
              <span>{stime}</span>
            </div>
            <div className={styles.row}>
              <label>地点</label>
              <span>{address}</span>
            </div>
            <Link className={styles.detail_link} to={`/activity/${aid}`}>点击查看活动详情</Link>
            <div className={styles.msg}>(为保证交流的私密性，请勿分享此链接)</div>
          </div>

          {
            circuit && trim(circuit) !== '' ? <div>
                <h3 className={styles.title}>活动流程</h3>
                <div className={styles.des} dangerouslySetInnerHTML={{__html: clearStyle1(circuit)}} />
              </div>
              : null
          }

          {user.length > 0 ? <section className={styles.attention_list}>
              <h3 className={styles.title}>出席嘉宾名单</h3>

              <ul className={styles.box}>
                {userList}
              </ul>

              {
                remark && trim(remark) !== '' ? <div className={styles.box} style={{borderBottom: 0}}>
                    <h3 className={styles.title}>备注：</h3>
                    <div className={styles.des} dangerouslySetInnerHTML={{__html: clearStyle1(remark)}} />
                  </div>
                  : null
              }
            </section>
            : null
          }
          <section className={styles.attention_list}>
            <h2>
              <span>注意事项</span>
            </h2>

            {address ? <BaiduMap is id='location' ref='location' address={address}
                                 style={{width: '100%', height: '420px', margin: '15px auto'}} /> : null}

            {
              isShow(meeting_info) ? <div className={styles.box}>
                  <h3 className={styles.title}>会场信息</h3>
                  <div className={styles.des} dangerouslySetInnerHTML={{__html: clearStyle1(meeting_info)}} />
                </div>
                : null
            }

            {
              isShow(way) ? <div className={styles.box}>
                  <h3 className={styles.title}>行车路线</h3>
                  <div className={styles.des} dangerouslySetInnerHTML={{__html: clearStyle1(way)}} />
                </div>
                : null
            }

            {
              isShow(heed) ? <div className={styles.box}>
                  <h3 className={styles.title}>温馨提示</h3>
                  <div className={styles.des} dangerouslySetInnerHTML={{__html: clearStyle1(heed)}} />
                </div>
                : null
            }

          </section>

          {
            user_name && trim(user_name) !== '' ? <div className={cx([styles.concat], [styles.box])}>
                <h3 className={styles.title}>联系信息</h3>
                <ul className={styles.contact_info}>
                  <li><a className={styles.call} href={`tel:${usertel}`}>
                    <div className={styles.left}>
                      <i className='icon icon-arrows-right' /><span className={styles.name}>{user_name}</span>
                      <i className={styles.mobile}>{usertel}</i></div>
                    <i className='icon icon-phone' /></a>
                  </li>
                  {
                    other_name && trim(other_name) !== '' && <li><a className={styles.call} href={`tel:${othertel}`}>
                      <div className={styles.left}>
                        <i className='icon icon-arrows-right' /><span className={styles.name}>{other_name}</span>
                        <i className={styles.mobile}>{othertel}</i></div>
                      <i className='icon icon-phone' /></a>
                    </li>
                  }
                </ul>
              </div>
              : null
          }

          <Link to='/' className={styles.btn_go_home}>去首页>></Link>

        </div>
        {
          status ? <footer>
              {
                is_confirm === 'Y' ? <button className={cx('btn', 'opacity5', [styles.btn])}>已确认参加</button>
                  : <button className={cx('btn', 'btn-blue', [styles.btn])} onClick={this.submit}>确认参加</button>

              }
            </footer>
            : null
        }
        <Spinner loading={loading} mask />
      </div>
    )
  }
}

// export default connect(state => ({count: state.count}))(HomePage);
