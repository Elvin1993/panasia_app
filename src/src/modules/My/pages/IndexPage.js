import React from 'react'
import {connect} from 'dva'
import autobind from 'autobind-decorator'
import { Button} from 'antd-mobile'
import styles from './IndexPage.less'

@connect(state => ({
  ...state.my.myInfoModel,
  loading: state.loading.global
}))
@autobind
export default class IndexPage extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className='page'>
        <div className={styles.my_page}>
          <Button>default</Button>
        </div>
      </div>
    )
  }
}
