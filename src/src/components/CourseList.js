import React from 'react'
import DropDownRefresh from 'components/DropDownRefresh'
import Item from './CourseItem'
import styles from './CourseList.less'

export default class CourseList extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {dataset = [], loading, onScrollToBottom, onClick, header, onScroll, Y} = this.props
    if (dataset.length <= 0) {
      return null
    }
    return (
      <DropDownRefresh Y={Y} loading={loading} className={styles.course_list} onScrollToBottom={onScrollToBottom} onScroll={onScroll}>
        {header}
        {
          dataset.map((item, index) => {
            return (
              <Item key={index} dataset={item} onClick={onClick} />
            )
          })
        }
      </DropDownRefresh>
    )
  }
}
