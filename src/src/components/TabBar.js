import React from 'react'
import {Link} from 'dva/router'

export default class TabBar extends React.Component {
  static propTypes = {}

  render() {
    const {activity = 'article'} = this.props
    return (
      <footer className='tab-bar' onTouchMove={e => e.preventDefault()}>
        <ul className='tab-list'>
          {
            activity === 'demo' ?
              <li><i className='icon icon-activity activity'/><span className='text_blue'>活动</span></li> :
              <Link to='/demo'>
                <li><i className='icon icon-activity'/><span>Demo</span></li>
              </Link>
          }
          {
            activity === 'my' ? <li><i className='icon icon-my activity'/><span className='text_blue'>我</span></li> :
              <Link to='/my'>
                <li><i className='icon icon-my'/><span>我</span></li>
              </Link>
          }
        </ul>
      </footer>
    )
  }
}
