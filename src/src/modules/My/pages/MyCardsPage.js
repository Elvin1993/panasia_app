import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Nav from 'components/Nav'
import SearchBar from 'components/SearchBar'
import UserList from 'components/UserList'
import autobind from 'autobind-decorator'
import styles from './MyCardsPage.less'

@connect(state => ({
  ...state.my.cardsModel,
  loading: state.loading.global
}))
@autobind
export default class extends React.Component {
  static propTypes = {}

  componentDidMount () {
    const {dataset = []} = this.props
    if (dataset.length > 0) { return }
    this.initCardPage()
  }

  initCardPage () {
    const {dispatch} = this.props
    dispatch({
      type: 'my/fetchUserBussinessCards',
      payload: {params: {current: 1}}
    })
  }

  handlerLink (uid) {
    const {dispatch} = this.props
    dispatch(routerRedux.push(`/user/${uid}`))
  }

  handlerSearch (searchText) {
    const {dispatch} = this.props
    const params = {current: 1, search: {name: searchText}}
    dispatch({type: 'my/setSearchText', payload: {searchText}})
    dispatch({type: 'my/fetchUserBussinessCards', payload: {params}})
  }

  handlerClear () {
    const {dispatch} = this.props
    dispatch({type: 'my/setSearchText', payload: {searchText: ''}})
  }

  handlerScrollToBottom (cb) {
    const {dispatch, size, total, current, searchText} = this.props
    if (current * size > total) {
      return cb()
    }
    const params = {search: {name: searchText}, current: current + 1}
    dispatch({type: 'my/fetchUserBussinessCards', payload: {params, cb}})
  }

  render () {
    const {dispatch, dataset = [], loading} = this.props

    return (
      <div className='page'>
        <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => { dispatch(routerRedux.goBack()) }} center={<div>名片夹</div>} />
        <div className={styles.search_bar}>
          <SearchBar onSearch={this.handlerSearch} onCancel={this.initCardPage} onClear={this.handlerClear} />
        </div>
        <div className={styles.my_bussiness_card_page}>
          {dataset.length > 0 ? <UserList dataset={dataset} loading={loading} onScrollToBottom={this.handlerScrollToBottom} onLink={this.handlerLink} />
            : <div className={styles.empty_box}>找不到您要找的人哦~</div>}
        </div>
      </div>
    )
  }
}
