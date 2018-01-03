import React from 'react'
import DropDownRefresh from 'components/DropDownRefresh'
import { Link } from 'dva/router'
import Item from './CourseItem'
import styles from './OrderList.less'
import moment from 'moment'

export default class OrderList extends React.Component {
  constructor (props) {
    super(props)
  }

  renderVIP (item, key) {
    return (
      <Link to='/my/edu/vip' className={styles.course_item} key={key}>
        <div className={styles.course_img}>
          <img src='img/vip.jpg' alt='缩略图' />
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{item.name}</h3>
          <div className={styles.bottom}>
            <span className={styles.pice}>￥{item.order_money}</span>
            <span className={styles.time}>{moment(+item.payment_success_time * 1000).format('YYYY.MM.DD HH:mm:ss')}</span>
          </div>
        </div>
      </Link>
    )
  }

  renderBook (item, key) {
    return (
      <Link to={`/shop/order/${item.oid}`} className={styles.course_item} key={key}>
        <div className={styles.course_img} style={{height: 'auto'}}>
          <img src={item.thumb_img} alt='缩略图' />
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{item.name}</h3>
          <div className={styles.bottom}>
            <span className={styles.pice}>￥{item.order_money}</span>
            <span className={styles.time}>{moment(+item.payment_success_time * 1000).format('YYYY.MM.DD HH:mm:ss')}</span>
          </div>
        </div>
      </Link>
    )
  }

  render () {
    const {dataset = [], loading, onScrollToBottom, onClick, header} = this.props
    if (dataset.length <= 0) {
      return null
    }
    return (
      <DropDownRefresh loading={loading} className={styles.list} onScrollToBottom={onScrollToBottom}>
        {header}
        {
          dataset.map((item, index) => {
            const {id, order_type, goods_list = [], payment_success_time, money} = item
            const goods = {...goods_list[0], payment_success_time, oid: id, order_money: money}
            if (order_type === 'video') {
              return <Item key={index} dataset={goods} onClick={onClick} />
            } else if (order_type === 'book') {
              return this.renderBook(goods, index)
            } else {
              return this.renderVIP(goods, index)
            }
          })
        }
      </DropDownRefresh>
    )
  }
}
