import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import cx from 'classname'
import Nav from 'components/Nav'
import UserInfo from 'components/UserInfo'
import UserForm from 'components/UserForm'
import autobind from 'autobind-decorator'
import styles from './MyInfoPage.less'

@connect(state => ({
  ...state.my.myInfoModel,
  loading: state.loading.global
}))
@autobind
export default class MyInfoPage extends React.Component {
  static propTypes = {}

  constructor (props) {
    super(props)
    this.state = {
      editing: false
    }
  }

  componentDidMount () {
    // const {dispatch} = this.props
    // dispatch({
    //   type: 'my/fetchUserInfo'
    // })

  }

  hadlerEdit () {
    this.setState({
      editing: !this.state.editing
    })
  }

  handleSubmitted (v) {
    const {dispatch} = this.props
    dispatch({type: 'my/updateUserInfo', payload: {params: v}})
    this.hadlerEdit()
  }

  render () {
    const {dispatch, dataset = {}} = this.props

    return (
      <div className='page'>
        <div className={styles.my_info_page}>
          <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => { dispatch(routerRedux.goBack()) }} center={<div>个人信息</div>} />
          <UserForm onSubmitted={this.handleSubmitted} initialValues={{...dataset}} type='confimApply' self editing={this.state.editing} onEdit={this.hadlerEdit} />
        </div>
      </div>
    )
  }
}
