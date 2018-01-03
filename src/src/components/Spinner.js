import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/CustomIcon'
import cx from 'classnames'
import styles from './Spinner.less'

function Spinner ({loading, mask}) {
  const divClx = cx({
    [styles.hideSpiner]: !loading,
    [styles.showSpiner]: loading
  })
  const svgCls = cx({
    [styles.icon_loading]: true
  })
  return (
    <div className={divClx}>
      {mask ? <div className={styles.mask} /> : null}
      {/* <svg className={svgCls} viewBox="0 0 44 44"> */}
      {/* <circle className={styles.path} fill="none" strokeWidth="4" strokeLinecap="round" cx="22" cy="22" r="20" /> */}
      {/* </svg> */}
      <Icon className={svgCls} type={require('assets/svg/loading.svg')} />
    </div>
  )
}

Spinner.propTypes = {
  loading: PropTypes.bool.isRequired,
  mask: PropTypes.bool
}
Spinner.defaultProps = {
  loading: false,
  mask: true

}

export default Spinner
