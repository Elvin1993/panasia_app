/* global BASE_PATH */
import styles from './LoginPage.less'

@connect(state => ({
  ...state.my.myInfoModel,
  loading: state.loading.global
}))
@autobind
export default class LoginPage extends React.Component {
  static propTypes = {}

  login (url) {
    url = url || window.location.href

    let next_url = url
    // .replace(/\?(.*)#/, '#')
    //                 .replace(/\?(.*)/, '')
    next_url = encodeURIComponent(next_url)
    window.location.href = `${BASE_PATH}/login/auth?channel=weixin&next_url=${next_url}`
  }

  componentDidMount () {
    const {dispatch, dataset: {id}} = this.props
    const {query: {next_url}} = this.props.location
    if (id) {
      dispatch(routerRedux.replace(next_url))
    } else {
      this.login(next_url)
    }
  }

  render () {
    return (
      <div className='page'>
        <div className={styles.logon_page} />
      </div>
    )
  }
}
