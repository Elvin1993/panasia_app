import React from 'react'
import moment from 'moment'
import { clearStyle } from 'utils/helper'
import styles from './ArticleItem.less'

export default class ArticleItem extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {id, title, thumb_image: img_url, guide: summary, c_time = 0} = this.props.dataset || {}
    const time = moment(c_time * 1000).format('YYYY.MM.DD')

    return (
      <div className={styles.article_item} onClick={() => this.props.click(id)}>
        <h3>{title}</h3>
        <div className={styles.content}>
          <div className={styles.img}>
            <img src={img_url} alt='缩略图' />

          </div>
          <div className={styles.summary_box}>
            <div className={styles.summary} dangerouslySetInnerHTML={{__html: summary}} />
            <div className={styles.article_time}>{time}</div>
          </div>
        </div>
      </div>
    )
  }
}
