import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Button } from 'antd-mobile'
import styles from './IndexPage.css'

class IndexPage extends PureComponent {

  state = {
    number: 0
  }

  handleClick = () => {
    console.log('click')
    const {number} = this.state
    this.setState({
      number: number + 1
    })
  }

  render () {
    return (
      <div>
        <div className={styles.normal}>
          <Button onClick={this.handleClick}>Click</Button>
        </div>
        <div className={styles.normal}>
          clicked {this.state.number} times
        </div>
      </div>
    )
  }
}

IndexPage.propTypes = {}

export default connect()(IndexPage)
