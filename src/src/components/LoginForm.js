import { List, InputItem, Icon } from 'antd-mobile'
import { Field, reduxForm } from 'redux-form'

@reduxForm({form: 'LoginForm'})
@autobind
export default class LoginForm extends React.Component {
  static propTypes = {}

  componentDidMount () {

  }

  render () {
    return (
      <div>
        <List renderHeader={() => '登录'}>
          <Field name='name' component={InputItem} placeholder='用户名1'><Icon type={require('assets/svg/login_user.svg')} /></Field>
          <Field name='password' component={InputItem} placeholder='密码'><Icon type={require('assets/svg/login_password.svg')} /></Field>
        </List>
        <p>{this.props.name}</p>
        <p>{this.props.password}</p>
      </div>
    )
  }
}
