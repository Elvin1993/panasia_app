import React from 'react'
import { connect } from 'dva'
import autobind from 'autobind-decorator'
import { Button } from 'antd-mobile'
import { Link, routerRedux } from 'dva/router'
import UserList from 'components/UserList'
import Nav from 'components/Nav'
import SearchBar from 'components/SearchBar'
import styles from './SigninPage.less'
import cx from 'classname'
@connect(state => ({
  ...state.user.signinModel,
  selectUser: state.user.checkMobel.dataset,
  loading: state.loading.global
}))
@autobind
export default class SigninPage extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const {dispatch, match: {params: {aid}}, dataset = []} = this.props
    if (!aid || dataset.length > 0) {
      return
    }

    dispatch({
      type: 'user/fetchActivityUser',
      payload: {params: {current: 1, search: {aid}}}
    })
  }

  handlerScrollToBottom (cb) {
    const {match: {params: {aid}}, dispatch, size, current, total, searchText} = this.props
    if (current * size > total) {
      return cb()
    }
    const params = {current: current + 1, search: {aid, name: searchText}}

    dispatch({type: 'user/fetchActivityUser', payload: {params, cb}})
  }

  handlerLink (uid) {
    // const { dispatch } = this.props
    // dispatch(routerRedux.push(`/user/${uid}`))
  }

  handlerSearch (searchText) {
    const {dispatch, match: {params: {aid}}} = this.props
    const params = {current: 1, search: {aid, name: searchText}}
    dispatch({type: 'user/setSearchText', payload: {searchText}})
    dispatch({type: 'user/fetchActivityUser', payload: {params}})
  }

  handlerClear () {
    const {dispatch} = this.props
    dispatch({type: 'user/setSearchText', payload: {searchText: ''}})
  }

  handlerNext () {
    const {dispatch, match: {params: {aid, sec}}, selectUser = {}} = this.props
    if (selectUser.id) {
      dispatch(routerRedux.push({
        pathname: `/user/check/${aid}/${sec}`
      }))
    }
  }

  handlerSelect (selectUser) {
    const {dispatch} = this.props
    dispatch({type: 'user/selectUser', payload: {selectUser}})
  }

  render () {
    const {activityUser, loading, selectUser, match: {params: {aid, sec}}} = this.props
    return (
      <div className='page'>
        <Nav />
        <div className={styles.signin_page}>
          <div className={styles.top}>
            <h1 className={styles.title}>初次来这里，请先找到自己！</h1>
            <SearchBar placeholder='快速搜索自己的姓名' onSearch={this.handlerSearch} onCancel={() => { this.handlerSearch('') }} onClear={this.handlerClear} />
          </div>
          <UserList selectUser={selectUser} dataset={activityUser} onSelect={this.handlerSelect} loading={loading} showCheckBox onScrollToBottom={this.handlerScrollToBottom}
            onLink={this.handlerLink} />
        </div>
        <div className={styles.footer}>
          <Button className={styles.my_btn} type='primary' onClick={this.handlerNext} disabled={!selectUser.id}>进行身份验证</Button>
          <Link to={`/logon?aid=${aid}&&sec=${sec}`}><span className={styles.next}>找不到自己，前去填写个人信息</span></Link>
        </div>
      </div>
    )
  }
}
