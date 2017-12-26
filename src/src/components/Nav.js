import React from 'react'
import { Link } from 'dva/router'
import cx from 'classname'

export default class Nav extends React.Component {
  static defaultProps = {
    center: (<Link to='/'>智信</Link>)
  }

  constructor (props) {
    super(props)
  }

  render () {
    const {left, center, right, onLeftClick, onRightClick, className, style} = this.props

    return (
      <nav className={cx('nav', className)} style={style}>
        <div className='nav_left' onClick={onLeftClick}>{left}</div>
        <div className='nav_title'>{center}</div>
        <div className='nav_right' onClick={onRightClick}>{right}</div>
      </nav>
    )
  }
}
