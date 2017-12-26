import React from 'react'
import { Link } from 'dva/router'

export default class TabBar extends React.Component {
  static propTypes = {}

  constructor (props) {
    super(props)
  }

  render () {
    const {activity = 'article'} = this.props
    return (
      <footer className='tab-bar' onTouchMove={e => e.preventDefault()}>
        <ul className='tab-list'>
          {
            activity === 'article' ? <li><i className='icon icon-home activity' /><span className='text_blue'>首页</span></li> : <Link to='/article'>
              <li><i className='icon icon-home' /><span>首页</span></li>
            </Link>
          }
          {
            //activity === 'edu' ? <li><i className='icon icon-edu activity' /><span className='text_blue'>学习</span></li> : <Link to='/edu'>
            //  <li><i className='icon icon-edu' /><span>学习</span></li>
            //</Link>
          }
          {
            activity === 'activity' ? <li><i className='icon icon-activity activity' /><span className='text_blue'>活动</span></li> : <Link to='/activity'>
              <li><i className='icon icon-activity' /><span>活动</span></li>
            </Link>
          }
          {
            activity === 'my' ? <li><i className='icon icon-my activity' /><span className='text_blue'>我</span></li> : <Link to='/my'>
              <li><i className='icon icon-my' /><span>我</span></li>
            </Link>
          }
        </ul>
      </footer>
    )
  }
}
