import React from 'react'
import cx from 'classname'
import styles from './NotFoundPage.less'

export default () => {
  return (
    <div className={cx('page', styles.not_found_page)}>
      <p className={styles.fof}>404</p>
    </div>
  )
}
