import React from 'react'
import {connect} from 'dva'
import {Link} from 'dva/router'
import autobind from 'autobind-decorator'
import {Modal, Button} from 'antd-mobile'
import Spinner from 'components/Spinner'
import TabBar from 'components/TabBar'
import styles from './IndexPage.less'

@connect(state => ({
  ...state.my.myInfoModel,
  loading: state.loading.global
}))
@autobind
export default class IndexPage extends React.Component {
  static propTypes = {}

  render() {
    const {loading} = this.props
    return (
      <div className='page'>
        <div className={styles.my_page}>
          <Button>default</Button>
        </div>
        <TabBar activity='my'/>
        <Spinner loading={loading} mask={false}/>
      </div>
    )
  }
}
