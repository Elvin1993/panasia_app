import React from 'react'
import { Link } from 'dva/router'
import DropDownRefresh from 'components/DropDownRefresh'
import Item from './ActivityItem'
import styles from './ActivityList.less'

export default class ActivityList extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {dataset = [], loading, onScrollToBottom, current, size, total, header, Y, onScroll} = this.props
    // if (dataset.length <= 0) {
    //   return null
    // }
    return (
      <DropDownRefresh Y={Y} loading={loading} className={styles.article_list} onScrollToBottom={onScrollToBottom} onScroll={onScroll}>
        {header}
        {
          dataset.map((item, index) => {
            return (
              <Link key={index} to={`/activity/${item.id}`}>
                <Item dataset={item} />
              </Link>
            )
          })
        }
        {!loading && (current * size >= total) && <div className='empty_box'>———— 列表到底了 ————</div>}
      </DropDownRefresh>
    )
  }
}
