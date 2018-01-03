import React, { Component } from 'react'
import styles from './ActivityItem.less'

export default class Item extends Component {
  constructor (props) {
    super(props)
    this.user_status = {
      PENDING: '等待审核',
      INVALID: '未通过',
      VALID: '已通过'
    }
  }

  render () {
    const {dataset = {}} = this.props
    const {id, subject, logo_url, status, area_id: city, user_status, pending_status, meeting_time, meeting_endtime, meeting_hour, meeting_endhour} = dataset
    const pending = pending_status >> 0 === 4 ? '进行中' : '报名中'
    const meeting_date = meeting_endtime ? (meeting_time + ' - ' + meeting_endtime) : meeting_time

    return (
      <div className={styles.activity_item}>
        <h3 className={styles.title}>{subject}</h3>
        <div className={styles.img_box}>
          <img className={styles.img} src={logo_url} alt='活动形象图' />
        </div>
        <div className={styles.info}>
          <span className={styles.time}>{meeting_date}&nbsp;{meeting_hour}-{meeting_endhour}</span>
          <span className={styles.city}>{city}</span>
        </div>
        <div className={styles.status}>
          {user_status
            ? <span>报名结果：<span className={user_status !== 'INVALID' ? 'text_blue' : 'text_gray'}>{this.user_status[user_status]}</span></span>
            : <span>活动状态：<span className={status !== 'INVALID' ? 'text_blue' : 'text_gray'}>{status === 'INVALID' ? '已结束' : pending }</span></span>
          }
        </div>
      </div>
    )
  }
}
