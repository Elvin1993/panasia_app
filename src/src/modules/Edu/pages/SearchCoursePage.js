import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import autobind from 'autobind-decorator'
import SearchBar from 'components/SearchBar'
import CourseList from 'components/CourseList'
import Spinner from 'components/Spinner'

import styles from './SearchCoursePage.less'

@connect(state => ({...state.edu.searchModel, loading: state.loading.models.edu}))
@autobind
export default class SearchCoursePage extends React.Component {
  constructor (props) {
    super(props)
  }

  handlerSearch (searchText) {
    const {dispatch, size} = this.props
    const params = {size, current: 1, search: {name: searchText}}
    dispatch({type: 'edu/setSearchText', payload: {searchText}})
    dispatch({type: 'edu/searchCourse', payload: {params}})
  }

  handlerGoHome () {
    const {dispatch} = this.props

    this.handlerClear()
    dispatch(routerRedux.goBack())
  }

  handlerClear () {
    const {dispatch} = this.props
    dispatch({type: 'edu/clearSearchList'})
  }

  handlerScrollToBottom (cb) {
    console.log('onScrollToBottom')
    const {dispatch, size, current, searchText, total} = this.props
    if (current * size > total) {
      return cb()
    }
    const params = {size, search: {name: searchText}, current: current + 1}
    dispatch({type: 'edu/searchCourse', payload: {params, cb}})
  }

  handlerClick (id) {
    const {dispatch} = this.props
    dispatch(routerRedux.push(`/edu/video/${id}`))
  }

  handlerOnScroll (Y) {
    const {dispatch} = this.props
    dispatch({type: 'edu/saveSearchPageY', payload: {Y}})
  }

  render () {
    const {Y, loading, searchText, dataset} = this.props
    return (
      <div className='page'>
        <SearchBar value={searchText} onSearch={this.handlerSearch} onCancel={this.handlerGoHome} onClear={this.handlerClear} autoFocus />
        <div className={styles.search_page_content}>
          {dataset.length > 0
            ? <CourseList Y={Y} dataset={dataset} loading={loading} onScrollToBottom={this.handlerScrollToBottom} onClick={this.handlerClick} onScroll={this.handlerOnScroll} />
            : (!loading ? <div className={styles.empty_box}>{searchText ? '找不到您想要的课程哦~' : '搜索指定课程' }</div> : null)
          }
          {loading && dataset.length <= 0 &&
          <Spinner loading={loading} mask={false} />
          }
        </div>
      </div>
    )
  }
}
