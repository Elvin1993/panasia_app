import { Result, Icon } from 'antd-mobile'
import React from 'react'
import styles from './PaySuccess.less'

export default class PaySuccess extends React.Component {
  render () {
    const {match: {params: {type}}} = this.props
    let title = type === 'offline' ? '提交成功' : '支付成功'
    let message = type === 'offline' ? '工作人员很快与您联系后续付费事宜！' : '工作人员很快与您联系注册入学事宜！'

    return (
      <div className={styles['paysuccess']}>
        <Result
          img={<Icon type="check-circle" className="icon" style={{fill: '#3d74c7', width: '1.2rem', height: '1.2rem'}}
                     size='lg' />}
          title={<p style={{color: '#3d74c7'}}>{title}</p>}
          message={<div><p>{message}</p><p style={{marginTop: '.2rem', fontSize: '.3rem'}}>有疑问请联系我们: <a
            style={{color: '#3d74c7', textDecoration: 'underline'}}>{Config.businessSchool.serviceTel}</a></p></div>}
        />
        {/* <div className={styles['footer']}>
          <Link to='/college' className={styles['footer-link']}>&lt;&lt;返回首页</Link>
        </div> */}
      </div>
    )
  }
}
