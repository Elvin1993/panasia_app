import React from 'react'
import { connect } from 'dva'

@connect(state => ({
  // isCheck: state.my.myInfoModel.isCheck,
  loading: state.loading.global
}))
@autobind
export default class AppLayout extends React.Component {
  // constructor (props) {
  //   super(props)
  //   // const {dispatch} = props
  //   // dispatch({type: 'my/fetchUserInfo'})
  // }

  render () {
    const {children} = this.props
    return (
      <div className='app'>
        {children}
      </div>
    )
  }
}
