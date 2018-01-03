import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import autobind from 'autobind-decorator'
import SearchBar from 'components/SearchBar'
import ActivityList from 'components/ActivityList'
import Spinner from 'components/Spinner'
import styles from './SearchActivityPage.less'

@connect(state => ({...state.activity.searchModel, loading: state.loading.global}))
@autobind
export default class SearchActivityPage extends React.Component {
  constructor (props) {
    super(props)
  }

  handlerSearch (searchText) {
    const {dispatch} = this.props
    const params = {current: 1, search: {subject: searchText}}
    dispatch({type: 'activity/setSearchText', payload: {searchText}})
    dispatch({type: 'activity/searchActivity', payload: {params}})
  }

  handlerGoHome () {
    this.handlerClear()
    this.props.dispatch(routerRedux.goBack())
  }

  handlerClear () {
    const {dispatch} = this.props
    dispatch({type: 'activity/clearSearchList'})
  }

  handlerScrollToBottom (cb) {
    const {dispatch, current, searchText, total, size} = this.props
    console.log(current * size > total)
    if (current * size > total) {
      return cb()
    }
    const params = {search: {subject: searchText}, current: current + 1}
    dispatch({type: 'activity/searchActivity', payload: {params, cb}})
  }

  handlerOnScroll (Y) {
    const {dispatch} = this.props
    dispatch({type: 'article/saveSearchPageY', payload: {Y}})
  }

  render () {
    const {loading, searchText, dataset, current, size, total, Y} = this.props

    return (
      <div className='page'>
        <SearchBar value={searchText} onSearch={this.handlerSearch} onCancel={this.handlerGoHome} onClear={this.handlerClear} autoFocus />
        {dataset.length > 0
          ? <ActivityList Y={Y} onScroll={this.handlerOnScroll} dataset={dataset} loading={loading} onScrollToBottom={this.handlerScrollToBottom} current={current} size={size} total={total} />
          : (!loading ? <div className={styles.empty_box}>{searchText ? '找不到您想要的活动哦~' : '搜索指定内容' }</div> : null)
        }
        {loading && dataset.length <= 0 &&
        <Spinner loading={loading} mask={false} />
        }
      </div>
    )
  }
}
