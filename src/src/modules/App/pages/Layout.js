import React from 'react'
import {connect} from 'dva'
import Spinner from 'components/Spinner'
@connect(state => ({
  isCheck: state.my.myInfoModel.isCheck,
  loading: state.loading.global
}))
@autobind
export default class AppLayout extends React.Component {
  constructor(props) {
    super(props)
    const {dispatch} = props
    dispatch({type: 'my/fetchUserInfo'})
  }

  render() {
    const {children, isCheck} = this.props
    return (
      <div className='app'>
        {isCheck ? children : <Spinner loading mask={false}/>}
      </div>
    )
  }
}
