import React from 'react'
import { Link } from 'dva/router'
import ArticleItem from './ArticleItem'
import styles from './ArticleList.less'

export default class ArticleList extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {data = [], click} = this.props
    if (data.length <= 0) {
      return null
    }
    return (
      <div className={styles.article_list}>
        {
          data.map((item, index) => {
            return <ArticleItem key={index} dataset={item} click={click} />
          })
        }
      </div>
    )
  }
}
