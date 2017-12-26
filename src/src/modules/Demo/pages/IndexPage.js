import React from 'react'
import { connect } from 'dva'
import { Link, routerRedux } from 'dva/router'
import autobind from 'autobind-decorator'
import styles from './IndexPage.less'

// @autobind
// @connect(state => state)
export default class IndexPage extends React.Component {
  static propTypes = {}

  redirect () {
    console.log(this)
    routerRedux.push({
      pathname: '/logout',
      query: {
        page: 2
      }
    })
  }

  handleClick = (ev: Event) => {
    ev.preventDefault()
    // this.props.history.replace('/')
  }

  render () {
    const {dispatch} = this.props
    return (
      <div className={styles.normal}>
        <div className={styles.welcome} />
        <ul className={styles.list}>
          <li><Link to='/demo/calc'>dddddd</Link></li>
          <li><Link to='/demo/count'>count</Link></li>
          <li><Link to='/demo/video'>video</Link></li>
          <li><a onClick={this.handleClick}>count</a></li>
        </ul>
      </div>
    )
  }
}
