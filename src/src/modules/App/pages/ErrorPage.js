import React from 'react'
import { connect } from 'dva'
import autobind from 'autobind-decorator'
import { Result, Icon } from 'antd-mobile'
import s from './ErrorPage.less'

@connect(state => ({
  ...state.my.myInfoModel,
  loading: state.loading.global
}))
@autobind
export default class LogonPage extends React.Component {
  static propTypes = {}

  componentDidMount () {

  }

  render () {
    const {query: {message}} = this.props.location
    return (
      <div className={s.not_found_page}>
        <div className={s.result_example}>
          <Result
            img={<Icon type={require('assets/svg/notice.svg')} className={s.icon} />}
            title="签到失败"
            message={message}
          />
        </div>
      </div>

    )
  }
}
