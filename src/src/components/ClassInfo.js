import styles from './ClassInfo.less'

export default (props) => (
  <div style={{ display: 'block', width: '100%' }}>
    <div className={styles['content-title']}>
      <p>主讲人</p>
    </div>
    <div className={styles['content-item']}>
      <div className={styles['presenter']}>
        <img className={styles['avatar']} src={props.info.lecturer_img && props.info.lecturer_img !== '' ? props.info.lecturer_img : 'img/user_face_default.png' } alt='presenter-avatar' />
        <div className={styles['info']}>
          <p className={styles['name']}>{props.info.lecturer}</p>
          <p className={styles['position']}>{props.info.lecturer_identity_desc}</p>
        </div>
      </div>
      <p>{props.info.lecturer_full_desc}</p>
    </div>
    <div className={styles['content-title']}>
      <p>课程介绍</p>
    </div>
    <div className={styles['content-item']} style={{ paddingTop: '.3rem' }}>
      <p>{props.info.desc}</p>
    </div>
  </div>
)
