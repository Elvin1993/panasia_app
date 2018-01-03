import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { ActivityIndicator } from 'antd-mobile'
import autobind from 'autobind-decorator'
import SearchBar from 'components/SearchBar'
import DropDownRefresh from 'components/DropDownRefresh'
import Spinner from 'components/Spinner'

import styles from './SearchArticlePage.less'
import ArticleList from 'components/ArticleList'

@connect(state => ({...state.article.searchModel, loading: state.loading.global}))
@autobind
export default class SearchArticle extends React.Component {
  constructor (props) {
    super(props)
  }

  handlerSearch (searchText) {
    const {dispatch, size} = this.props
    const params = {size, current: 1, search: {name: searchText}}
    dispatch({type: 'article/setSearchText', payload: {searchText}})
    dispatch({type: 'article/searchArticle', payload: {params}})
  }

  handlerGoHome () {
    const {dispatch} = this.props

    this.handlerClear()
    dispatch(routerRedux.goBack())
  }

  handlerClear () {
    const {dispatch} = this.props
    dispatch({type: 'article/clearSearchList'})
  }

  handlerScrollToBottom (cb) {
    const {dispatch, size, current, searchText, total} = this.props
    if (current * size > total) {
      return cb()
    }
    const params = {size, search: {name: searchText}, current: current + 1}
    dispatch({type: 'article/searchArticle', payload: {params, cb}})
  }

  handlerOnScroll (Y) {
    const {dispatch} = this.props
    dispatch({type: 'article/saveSearchPageY', payload: {Y}})
  }

  handlerClick (id) {
    const {dispatch} = this.props
    dispatch(routerRedux.push(`/article/detail/${id}`))
  }

  render () {
    const {loading, searchText, dataset, size, current, total, Y} = this.props
    return (
      <div className='page'>
        <SearchBar value={searchText} onSearch={this.handlerSearch} onCancel={this.handlerGoHome} onClear={this.handlerClear} autoFocus />
        {loading && dataset.length <= 0 &&
        <Spinner loading={loading} mask={false} />
        }
        <DropDownRefresh Y={Y} onScroll={this.handlerOnScroll} loading={loading} {...this.props} className={styles.search_page_content} onScrollToBottom={this.handlerScrollToBottom}>
          {dataset.length > 0 ? <ArticleList data={dataset} click={this.handlerClick} /> : (!loading ? <div className={styles.empty_box}>{searchText ? '搜索结果为空！' : '搜索指定内容' }</div> : null)}
          {dataset.length > 0 && !loading && (current * size >= total) && <div className='empty_box'>———— 列表到底了 ————</div>}
        </DropDownRefresh>
      </div>
    )
  }
}
