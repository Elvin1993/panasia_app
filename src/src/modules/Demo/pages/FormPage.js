import React, { Component } from 'react'
import { connect } from 'dva'

import ContactForm from './forms/ContactForm'

@connect(state => state)
export default class FormPage extends Component {
  static propTypes = {}

  handleSubmit = (values) => {
    // Do something with the form values
    console.log(values)
    this.props.dispatch({type: 'demo/submitForm', payload: {values}})
  }

  render () {
    const {count, dispatch} = this.props
    // console.log(this.props)
    return (
      <div>
        <img src='img/logo.png' alt='' />
        <ContactForm onSubmit={this.handleSubmit} />
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
