import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Button, InputItem } from 'antd-mobile'
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
          <InputItem
            type="money"
            placeholder="start from left"
            clear
            moneyKeyboardAlign="left"
          >光标在左</InputItem>
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
