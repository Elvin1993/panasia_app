import styles from './QuestionItem.less'

export default (props) => (
  <div className={styles['student-item']}>
    <img className={styles['avatar']} src={props.user_info.user_face} alt='' />
    <div className={styles['student-info']}>
      <p className={styles['name']}>{props.user_info.name}</p>
      <div className={styles['question']}>{props.content}</div>
    </div>
  </div>
)