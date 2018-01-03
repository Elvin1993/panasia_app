import React from 'react'
import cx from 'classname'
import styles from './UserFaceBox.less'

export default class Nav extends React.Component {
  static defaultProps = {
    center: (<img src='img/zx_icon.png' className='logo' alt='智信' />)
  }

  constructor (props) {
    super(props)
  }

  render () {
    const {user_face, name, mobile, is_valid} = this.props

    return (
      <div className={styles.user_face_box}>
        <div className={styles.user_face}>
          <img src={user_face || 'img/user_face_default.png'} alt='头像' />
        </div>
        <div className={styles.name} data-type={is_valid ? '已认证' : '未认证'}>
          {name || mobile}
        </div>
      </div>
    )
  }
}
