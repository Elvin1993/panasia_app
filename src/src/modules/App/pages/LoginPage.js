import styles from './LoginPage.less'
import { List, InputItem, Icon } from 'antd-mobile'
import { Field, reduxForm } from 'redux-form'
import LoginForm  from 'components/LoginForm'

@reduxForm({form: 'LoginForm'})
@connect(state => {
  // const selector = formValueSelector('LoginForm')
  // const { name, password } = selector(state, 'name', 'password')
  return {
    ...state.my.myInfoModel,
    loading: state.loading.global,
    // name,
    // password
  }
})
@autobind
export default class LoginPage extends React.Component {
  static propTypes = {}

  componentDidMount () {

  }

  showResults(values) {
    console.log(values)
  }

  render () {
    console.log(this.props)
    return (
      <div className='page'>
        <div className={styles.logon_page}>
          <LoginForm initialValues={{name: '', password: ''}} onSubmit={this.showResults} />
        </div>
      </div>
    )
  }
}
