/* global BASE_PATH */
import styles from './LoginPage.less'

@connect(state => ({
  ...state.my.myInfoModel,
  loading: state.loading.global
}))
@autobind
export default class LoginPage extends React.Component {
  static propTypes = {}
  componentDidMount () {
  }

  render () {
    return (
      <div className='page'>
        <div className={styles.logon_page} >
          <p>登录页面</p>
        </div>
      </div>
    )
  }
}
