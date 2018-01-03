import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './CountPage.less'

function CountPage (props) {
  console.log(props)
  const {count, dispatch} = props
  return (
    <div className={styles.normal}>
      <div className={styles.record}>Highest Record: {count.record}</div>
      <div className={styles.current}>{count.current}</div>
      <div className={styles.button}>
        <button onClick={() => { dispatch({type: 'count/add'}) }}>+</button>
      </div>
    </div>
  )
}

CountPage.propTypes = {}

export default connect(state => ({count: state.count}))(CountPage)
