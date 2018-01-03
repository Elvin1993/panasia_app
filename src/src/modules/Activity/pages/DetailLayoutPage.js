import autobind from 'autobind-decorator'
import cx from 'classname'
import Nav from 'components/Nav'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import pathToRegexp from 'path-to-regexp'
import React from 'react'
// import { resetWXShare } from 'utils/helper'
import ActivityBaseInfo from './BaseInfo'
import ActivityData from './Data'
import styles from './DetailLayoutPage.less'
import ActivityGuests from './Guests'

@connect(state => ({
  myHistory: state.app.myHistory,
  ...state.activity.activityDetailModel,
  activityBaseInfo: state.activity.activityBaseInfo.dataset
}))
@autobind
export default class extends React.Component {
  componentDidMount () {
    const {dispatch, match: {params: {aid}}, activityBaseInfo} = this.props
    if (!aid || activityBaseInfo.id) {
      return
    }
    dispatch({
      type: 'activity/fetchActivityBaseInfo',
      payload: {params: {id: aid}, cb: (v) => wx.ready(() => this.initWXShare(v))}
    })
    // const {activityIndex = 'info'} = this.props.location.query
    // props.dispatch({type: 'activity/setLayoutActivityIndex', payload: {activityIndex}})
  }

  componentWillUnmount () {
    console.log('clear baseInfo data guest')
    const {dispatch} = this.props
    dispatch({type: 'activity/clearActivityDetail'})
    // resetWXShare()
  }

  handlerChangeIndex (e) {
    const {match: {params: {aid}}} = this.props
    const activityIndex = e.target.id
    const {dispatch} = this.props

    // dispatch({type: 'activity/setLayoutActivityIndex', payload: {activityIndex}})
    dispatch(routerRedux.replace({
      pathname: `/activity/${aid}`,
      // search: `?activityIndex=${activityIndex}`,
      query: {
        activityIndex
      }
    }))
  }

  initWXShare (v) {
    let {dataset: {subject, logo_url: imgUrl, area_id}} = v
    const title = `智信活动 • ${area_id}`
    const tltitle = `${title} - ${subject}`
    // let link = location.href.replace(/\?(.*)/, '')
    // let link = location.href.replace(location.search, '')
    imgUrl = encodeURI(imgUrl)
    const {origin, hash, href} = location
    const message = {
      imgUrl,
      title: title,
      desc: subject,
      link: href,
      type: 'link'
    }

    let tlmessage = {...message, title: tltitle}
    wx.onMenuShareAppMessage(message)
    wx.onMenuShareQQ(message)
    wx.onMenuShareTimeline(tlmessage)
  }

  // goBack() {
  //   const {dispatch, location = {}} = this.props
  //   const {purl} = location.query || {}
  //   if (purl) {
  //     dispatch(routerRedux.push(purl))
  //   } else {
  //     dispatch(routerRedux.replace('/activity'))
  //   }
  //
  // }

  handlerGoBack () {
    const {dispatch, myHistory = {}, match: {params: {aid}}} = this.props
    const {pUrl} = myHistory
    const match1 = pathToRegexp('/activity/:aid/apply').exec(pUrl)
    const match2 = pathToRegexp('/activity/agenda/:aid').exec(pUrl)
    const match3 = pathToRegexp('/user/check/:aid/:sec').exec(pUrl)

    if (pUrl && !match1 && !match2 && !match3) {
      dispatch(routerRedux.goBack())
    } else {
      dispatch(routerRedux.push('/activity'))
    }
  }

  render () {
    const {dispatch, activityBaseInfo, location = {}} = this.props
    const {activityIndex = 'info'} = this.props.location.query

    const {apply_status, user_status, status, pending_status = 0} = activityBaseInfo
    // const isApply = !!apply_status    //isApply 报名状态 0未报名 1 已报名
    const isPass = (user_status === 'VALID')    // user_status用户审核状态 VALID已通过 INVALID未通过
    const isInfo = (activityIndex === 'info')
    const isGuest = (activityIndex === 'guest')
    const isData = (activityIndex === 'data')

    return (
      <div className='page'>
        {!isPass ? <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={this.handlerGoBack} center='活动' /> :
          <div className={styles.top}>
            <i onClick={this.handlerGoBack} className={cx('icon', 'icon-arrows-left', [styles.back])} />
            <ul className={styles.top_tab_bar}>
              <li id='info' className={cx({[styles.activity]: isInfo})} onClick={this.handlerChangeIndex}>活动信息</li>
              <li id='guest' className={cx({[styles.activity]: isGuest})} onClick={this.handlerChangeIndex}>参会嘉宾</li>
              <li id='data' className={cx({[styles.activity]: isData})} onClick={this.handlerChangeIndex}>活动资料</li>
            </ul>
          </div>
        }
        {isInfo && <ActivityBaseInfo {...this.props} />}
        {isGuest && <ActivityGuests {...this.props} />}
        {isData && (pending_status > 2 ? <ActivityData {...this.props} /> :
          <div className={styles.empty}><span>活动结束后，<br />可以在这里下载活动资料</span></div>)}
      </div>
    )
  }
}
