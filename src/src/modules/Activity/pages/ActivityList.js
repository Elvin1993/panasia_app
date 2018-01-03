import React from 'react'
import { Link } from 'dva/router'
import ActivityItem from '../../../components/ActivityItem'
import styles from './ActivityList.less'
export default class ActivityList extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {dataset = []} = this.props
    if (dataset.length <= 0) {
      return null
    }
    return (
      <div className={styles.article_list}>
        {
          dataset.map((item, index) => {
            return <Link key={index} to={`/activity/${item.id}`}><ActivityItem dataset={item} /></Link>
          })
        }
      </div>
    )
  }
}
