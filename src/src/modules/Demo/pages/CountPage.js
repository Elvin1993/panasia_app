import Spinner from 'components/Spinner'
import { connect } from 'dva'
import React, { Component } from 'react'
import styles from './CountPage.less'

@connect(state => ({
  loading: state.loading.global,
  count: state.demo.count
}))
@autobind
export default class CountPage extends Component {
  static propTypes = {}

  componentDidMount () {
  }

  render () {
    const {loading, count, dispatch} = this.props
    return (
      <div className={styles.normal}>
        <Spinner loading={loading} mask />
        <div className={styles.record}>Highest Record: {count.record}</div>
        <div className={styles.current}>{count.current}</div>
        <div className={styles.button}>
          <button onClick={() => { dispatch({type: 'demo/add'}) }}>+</button>
        </div>
      </div>
    )
  }
}

// function CountPage(props) {
//   console.log(props)
//   const { count, dispatch } = props
//   return (
//     <div className={styles.normal}>
//       <div className={styles.record}>Highest Record: {count.record}</div>
//       <div className={styles.current}>{count.current}</div>
//       <div className={styles.button}>
//         <button onClick={() => { dispatch({ type: 'count/add' }); }}>+</button>
//       </div>
//     </div>
//   );
// }
//
// CountPage.propTypes = {};

// export default connect(state => ({ count: state.count }))(CountPage);
// export default connect(state => state)(CountPage);
