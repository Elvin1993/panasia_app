import React from 'react'
import Icon from 'components/CustomIcon'
import styles from './CourseItem.less'
import autobind from 'autobind-decorator'
import moment from 'moment'

@autobind
export default class extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {hasCheck = false, onClick, dataset = {}, hideInfo} = this.props
    const {id, order_type, thumb_img, name, lecturer, lecturer_identity_desc, money, is_free, checked, payment_success_time} = dataset
    return (
      <div className={styles.course_item} onClick={onClick ? () => onClick(id) : null}>
        {
          hasCheck ? <Icon type={checked ? 'check-circle' : require('assets/svg/circle.svg')} size='sm' color='#3d74c7' className={styles.btn_checked} /> : null
        }
        <div className={styles.course_img}>
          <img src={order_type === 'vip' ? 'img/vip.jpg' : thumb_img} alt='缩略图' />
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{name}</h3>
          { !hideInfo ? <p>主讲人: {lecturer}</p> : null}
          <p>{lecturer_identity_desc}</p>
          <div className={styles.bottom}>
            <p className={styles.pice}>{(is_free | 0) === 0 ? <span>￥{money}</span> : <span className={styles.free}>免费</span>}</p>
            {payment_success_time && <span className={styles.time}>{moment(+payment_success_time * 1000).format('YYYY.MM.DD')}</span>}
          </div>
        </div>
      </div>
    )
  }
}
